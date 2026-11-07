import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createProjectFilter } from '../src/project-search.js';

const projects = JSON.parse(await readFile('src/data/projects.json', 'utf8'));
const brands = JSON.parse(await readFile('src/data/brands.json', 'utf8'));
const showcases = JSON.parse(await readFile('src/data/showcases.json', 'utf8'));
const filterProjects = createProjectFilter(projects);

assert.equal(projects.length, 10, 'The portfolio archive must contain 10 projects.');
assert(projects.every((project) => project.title && project.category && project.description));
assert(
  ['Full Stack', 'Web App', 'Backend & API', 'Frontend UI', 'Sistem Informasi', 'Operasional'].every(
    (category) => projects.some((project) => project.category === category),
  ),
  'Every requested project category must be represented.',
);
assert(brands.length >= 5, 'The brand rail needs at least 5 entries.');
assert.equal(showcases.length, 6, 'The project showcase must contain all 6 supplied screenshots.');
assert(showcases.every((showcase) => showcase.title && showcase.alt && showcase.image));
await Promise.all(
  showcases.map(({ image }) => access(resolve(image.replace(/^\.\//, '')))),
);
assert.deepEqual(filterProjects('Semua', ''), projects, 'An empty search must return every project.');
assert.equal(
  filterProjects('Backend & API', ' REST API ').length,
  2,
  'Search must be case-insensitive, trimmed, and combined with category filters.',
);
assert.equal(
  filterProjects('Full Stack', 'mysql').length,
  1,
  'Search must include project stack values.',
);
console.log('Portfolio data checks passed.');
