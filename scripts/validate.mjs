import assert from 'node:assert/strict';

const contactKeys = /^(lastName|surname|fullName|email|phone|mobile|address|location|city|country|birthday|birthDate|photo|avatar|linkedin|telegram|github|website|url|employer|company|university)$/i;
const privateContent = [
  /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i,
  /(?:https?:\/\/|mailto:|tel:|file:\/\/)/i,
  /(?:[A-Z]:[\\/]|\\\\[\w.-]+\\)/i,
  /(?:\+\d[\d\s()-]{7,}\d)/,
  /(?:linkedin\.com|t\.me\/|github\.com\/|instagram\.com\/)/i,
];

export function validateCv(data) {
  assert.equal(data.version, 1, 'Unsupported CV schema version');
  assert.equal(data.locale, 'ru');
  assert.equal(data.profile.firstName, 'Мария', 'Only the approved first name may be used');
  const identifiers = data.technologySections.map(section => section.id);
  assert.equal(new Set(identifiers).size, identifiers.length, 'Technology IDs must be unique');
  for (const id of identifiers) assert.match(id, /^[a-z][a-z0-9-]*$/);
  assert.ok(!identifiers.includes('overview'));
  assert.ok(data.featuredProject.highlights.length > 0);
  assert.ok(data.experience.length > 0);
  for (const section of data.technologySections) {
    assert.ok(section.label && section.title && section.description);
    assert.ok(section.topics.length > 0);
    for (const topic of section.topics) assert.ok(topic.title && topic.text);
  }
  function visit(value) {
    if (typeof value === 'string') {
      for (const pattern of privateContent) assert.ok(!pattern.test(value), 'CV must not include contacts, external identity links or local paths');
    } else if (Array.isArray(value)) {
      value.forEach(visit);
    } else if (value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        assert.ok(!contactKeys.test(key), `Personal field is not allowed: ${key}`);
        visit(child);
      }
    }
  }
  visit(data);
}
