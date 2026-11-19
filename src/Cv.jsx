import React from 'react';

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function Tags({ items, className = '' }) {
  return <ul className={`tags ${className}`}>{items.map(item => <li key={item}>{item}</li>)}</ul>;
}

function SectionHeading({ number, children }) {
  return <div className="section-heading"><span aria-hidden="true">{number}</span><h2>{children}</h2></div>;
}

function Highlights({ items }) {
  return <div className="highlights">{items.map(item => <article className="highlight" key={item.title}>
    <h4>{item.title}</h4><p>{item.text}</p>
  </article>)}</div>;
}

function Overview({ data }) {
  const { profile, ui, featuredProject, skills, experience } = data;
  return <section id="panel-overview" className="view overview" aria-labelledby="tab-overview" tabIndex={-1}>
    <div className="overview-grid">
      <section className="profile-block" aria-labelledby="profile-heading">
        <div className="section-heading"><span aria-hidden="true">01</span><h2 id="profile-heading">{ui.summaryHeading}</h2></div>
        {profile.summary.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      </section>
      <aside className="focus-block" aria-label={ui.focusAriaLabel}>
        <span className="eyebrow">{ui.focusLabel}</span>
        {profile.focus.map((item, index) => <div className="focus-item" key={item}><span className="focus-number">0{index + 1}</span><span>{item}</span></div>)}
      </aside>
    </div>

    <section className="cv-section skills-section">
      <SectionHeading number="02">{ui.skillsHeading}</SectionHeading>
      <div className="skill-grid">{skills.map(group => <div className="skill-group" key={group.label}>
        <h3>{group.label}</h3><p>{group.items.join(' · ')}</p>
      </div>)}</div>
    </section>

    <section className="cv-section project-section">
      <SectionHeading number="03">{ui.projectHeading}</SectionHeading>
      <div className="project-heading"><div><p className="eyebrow">{featuredProject.domain}</p><h3>{featuredProject.name}</h3></div><span className="project-role">{featuredProject.role}</span></div>
      <p className="project-description">{featuredProject.description}</p>
      <Highlights items={featuredProject.highlights} />
      <a className="details-link" href="#stripe" data-select="stripe">{ui.detailsLabel} <Arrow /></a>
    </section>

    <section className="cv-section experience-section">
      <SectionHeading number="04">{ui.experienceHeading}</SectionHeading>
      <div className="experience-list">{experience.map(entry => <article className="experience" key={`${entry.period}-${entry.context}`}>
        <div className="experience-period">{entry.period}</div>
        <div className="experience-content"><p className="experience-context">{entry.context}</p><h3>{entry.title}</h3><p>{entry.description}</p>
          {entry.highlights.length ? <ul className="experience-points">{entry.highlights.map(point => <li key={point}>{point}</li>)}</ul> : null}
          <p className="experience-stack">{entry.technologies.join(' / ')}</p>
        </div>
      </article>)}</div>
    </section>

    <section className="education cv-section"><SectionHeading number="05">{ui.educationHeading}</SectionHeading><p>{profile.education}</p></section>
  </section>;
}

function TechnologyPanel({ section, index, ui }) {
  return <section id={`panel-${section.id}`} className="view technology-panel" aria-labelledby={`tab-${section.id}`} tabIndex={-1}>
    <header className="technology-header"><div><p className="eyebrow">{ui.technologyEyebrow} / {String(index + 1).padStart(2, '0')}</p><h2>{section.title}</h2><p>{section.description}</p></div><span className="topic-count">{String(section.topics.length).padStart(2, '0')}<small>{ui.topicLabel}</small></span></header>
    <Tags items={section.technologies} />
    <div className="technical-topics">{section.topics.map((topic, topicIndex) => <article className="technical-topic" key={topic.title}>
      <span className="topic-number" aria-hidden="true">{String(topicIndex + 1).padStart(2, '0')}</span><div><h3>{topic.title}</h3><p>{topic.text}</p></div>
    </article>)}</div>
  </section>;
}

export function CvDocument({ data, styles, clientScript }) {
  const { profile, ui, technologySections } = data;
  return <html lang={data.locale}>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="color-scheme" content="light" />
      <meta httpEquiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'" />
      <meta name="description" content={ui.metaDescription} />
      <meta name="referrer" content="no-referrer" />
      <title>{ui.documentTitle}</title>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </head>
    <body>
      <a href="#content" className="skip-link">{ui.skipLabel}</a>
      <div className="page-shell">
        <header className="masthead"><a className="wordmark" href="#overview" data-select="overview">M<span className="wordmark-dot">.</span></a><span className="edition">{ui.anonymousLabel}</span><button className="print-button enhanced-control" type="button" data-print><span>{ui.printLabel}</span><Arrow /></button></header>
        <div className="hero"><div className="hero-main"><p className="eyebrow">{profile.eyebrow}</p><h1>{profile.firstName}<span className="hero-period">.</span></h1><p className="role">{profile.headline}</p></div><div className="hero-note"><span className="draft-mark"><span aria-hidden="true" />{ui.draftLabel}</span><p>{ui.heroNote.map((line, index) => <React.Fragment key={line}>{index > 0 ? <br /> : null}{line}</React.Fragment>)}</p></div></div>

        <div className="workspace">
          <nav className="navigation" aria-label={ui.navigationLabel}>
            <p className="nav-caption">{ui.contentsLabel}</p>
            <div className="tabs"><a href="#overview" id="tab-overview" className="tab active" data-tab="overview"><span className="nav-index">00</span><span>{ui.overviewLabel}</span><span className="nav-arrow" aria-hidden="true">↗</span></a>
              {technologySections.map((section, index) => <a href={`#${section.id}`} className="tab" data-tab={section.id} id={`tab-${section.id}`} key={section.id}><span className="nav-index">{String(index + 1).padStart(2, '0')}</span><span>{section.label}</span><span className="nav-arrow" aria-hidden="true">↗</span></a>)}
            </div>
            <p className="nav-note">{ui.privacyNote}</p>
          </nav>
          <main id="content" tabIndex={-1}><Overview data={data} />{technologySections.map((section, index) => <TechnologyPanel key={section.id} section={section} index={index} ui={ui} />)}</main>
        </div>
        <footer className="footer"><span>{profile.firstName}<span className="footer-dot">.</span></span><p>{ui.footer}</p><a href="#overview" data-select="overview">{ui.backToTopLabel}</a></footer>
      </div>
      <script dangerouslySetInnerHTML={{ __html: clientScript }} />
    </body>
  </html>;
}
