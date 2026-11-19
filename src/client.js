// Small progressive enhancement: all content is already present in the HTML.
(() => {
  const tabs = [...document.querySelectorAll('[data-tab]')];
  const panels = [...document.querySelectorAll('.view')];
  const tabList = document.querySelector('.tabs');
  const knownTabs = new Set(tabs.map(tab => tab.dataset.tab));

  function activate(id, { focus = false, updateHistory = false } = {}) {
    const selectedId = knownTabs.has(id) ? id : 'overview';
    tabs.forEach(tab => {
      const active = tab.dataset.tab === selectedId;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panels.forEach(panel => {
      const active = panel.id === `panel-${selectedId}`;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    if (updateHistory && location.hash !== `#${selectedId}`) {
      // Works for an offline file too; no History API dependency.
      location.hash = selectedId;
    }
  }

  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-label', document.querySelector('.navigation').getAttribute('aria-label'));
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `panel-${tab.dataset.tab}`);
    tab.addEventListener('click', event => {
      event.preventDefault();
      activate(tab.dataset.tab, { updateHistory: true });
    });
    tab.addEventListener('keydown', event => {
      let nextIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(tabs[nextIndex].dataset.tab, { focus: true, updateHistory: true });
    });
  });
  panels.forEach(panel => panel.setAttribute('role', 'tabpanel'));

  document.querySelectorAll('[data-select]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    activate(link.dataset.select, { updateHistory: true });
    document.getElementById(`panel-${link.dataset.select}`).focus();
  }));
  document.querySelector('[data-print]').addEventListener('click', () => window.print());
  window.addEventListener('hashchange', () => {
    const hash = location.hash.slice(1);
    // Preserve native in-document anchors such as the skip link.
    if (knownTabs.has(hash) || !hash) activate(hash);
  });
  activate(location.hash.slice(1));
  document.documentElement.classList.add('js');
})();
