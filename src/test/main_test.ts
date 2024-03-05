import assert from 'node:assert';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';
import {join as joinPath} from 'node:path';
import {findPackage, findPackagePath} from '../main.js';

const currentDir = fileURLToPath(new URL('../../', import.meta.url));
const rootPackagePath = joinPath(currentDir, 'package.json');

test('findPackagePath', async (t) => {
  await t.test('null for trees without package files', async () => {
    assert.equal(await findPackagePath('/'), null);
  });

  await t.test('skips directories named `package.json`', async () => {
    const fixturePath = joinPath(
      currentDir,
      'test/fixtures/package-json-dir/package.json'
    );
    assert.equal(await findPackagePath(fixturePath), rootPackagePath);
  });

  await t.test('finds package in first dir', async () => {
    const fixturePath = joinPath(currentDir, 'test/fixtures/simple-package');
    const packagePath = joinPath(
      currentDir,
      'test/fixtures/simple-package/package.json'
    );
    assert.equal(await findPackagePath(fixturePath), packagePath);
  });

  await t.test('finds package in parent dir', async () => {
    const fixturePath = joinPath(
      currentDir,
      'test/fixtures/simple-package/src'
    );
    const packagePath = joinPath(
      currentDir,
      'test/fixtures/simple-package/package.json'
    );
    assert.equal(await findPackagePath(fixturePath), packagePath);
  });

  await t.test('finds package in nested package', async () => {
    const fixturePath = joinPath(
      currentDir,
      'test/fixtures/nested-packages/nested-package-a'
    );
    const packagePath = joinPath(
      currentDir,
      'test/fixtures/nested-packages/nested-package-a/package.json'
    );
    assert.equal(await findPackagePath(fixturePath), packagePath);
  });
});

test('findPackage', async (t) => {
  await t.test('finds package in simple tree', async () => {
    const fixturePath = joinPath(currentDir, 'test/fixtures/simple-package');
    const result = await findPackage(fixturePath);

    assert.equal(result!.name, 'simple-package');
  });

  await t.test('null for non-existent packages', async () => {
    assert.equal(await findPackage('/'), null);
  });

  await t.test('null for invalid package.json', async () => {
    const fixturePath = joinPath(currentDir, 'test/fixtures/broken-package');
    assert.equal(await findPackage(fixturePath), null);
  });
});
