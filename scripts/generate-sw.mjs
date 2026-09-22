import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const templateUrl = new URL('../pwa/sw.js', import.meta.url);
const publicUrl = new URL('../public/', import.meta.url);
const outputUrl = new URL('sw.js', publicUrl);
const placeholder = '__PWA_BUILD_VERSION__';
const template = await readFile(templateUrl, 'utf8');

if (template.split(placeholder).length !== 2) {
  throw new Error(
    'Service worker template must contain exactly one version placeholder.'
  );
}

const version =
  process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || randomUUID();
const source = template.replace(placeholder, version);

await mkdir(publicUrl, { recursive: true });
await writeFile(outputUrl, source, 'utf8');
console.log(`Generated public/sw.js with version ${version}`);
