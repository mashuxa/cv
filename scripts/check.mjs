import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateCv } from './validate.mjs';

const data = JSON.parse(await readFile(new URL('../data/cv.json', import.meta.url), 'utf8'));
const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');
validateCv(data);
assert.ok(html.startsWith('<!doctype html>'));
assert.ok(!/https?:\/\/|mailto:|tel:|file:\/\/|sourceMappingURL|fetch\(/i.test(html), 'Build must be standalone, with no contacts or remote requests');
assert.ok(!/<(?:iframe|form|img)\b|<script[^>]+src=|<link[^>]+href=/i.test(html));
assert.ok(!/__html|\*\*|�/.test(html), 'No template tokens, Markdown or encoding errors');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML IDs must be unique');
for (const section of data.technologySections) {
  assert.ok(ids.includes(`tab-${section.id}`));
  assert.ok(ids.includes(`panel-${section.id}`));
  for (const topic of section.topics) assert.ok(html.includes(topic.title.replaceAll('&', '&amp;')));
}
for (const key of ['email', 'phone', 'surname', 'location']) {
  const invalid = structuredClone(data);
  invalid.profile[key] = 'withheld';
  assert.throws(() => validateCv(invalid), 'Personal fields must fail validation');
}
for (const sample of ['person@example.test', 'https://identity.example.test', 'C:\\private\\file']) {
  const invalid = structuredClone(data);
  invalid.profile.summary.push(sample);
  assert.throws(() => validateCv(invalid), 'Contact-like content must fail validation');
}
console.log(`Checked JSON, privacy rules, HTML, ${data.technologySections.length + 1} tabs, and ${data.technologySections.reduce((count, section) => count + section.topics.length, 0)} technical topics.`);
