import {walkUp} from 'walk-up-path';
import {resolve} from 'node:path';
import {stat, readFile} from 'node:fs/promises';

/**
 * Determines if a file exists or not
 * @param {string} path Path of the file
 * @return {Promise<boolean>}
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch (_err) {
    return false;
  }
}

/**
 * Finds the path of the first `package.json` encountered when traversing
 * the file system upwards from the specified `cwd`.
 * @param {string} cwd Current/starting directory
 * @return {Promise<string|null>}
 */
export async function findPackagePath(cwd: string): Promise<string | null> {
  for (const path of walkUp(cwd)) {
    const packagePath = resolve(path, 'package.json');
    const hasPackageJson = await fileExists(packagePath);

    if (hasPackageJson) {
      return packagePath;
    }
  }

  return null;
}

export type Package = Record<string, unknown>;

/**
 * Finds and returns the contents of the first `package.json` encountered
 * when traversing the file system upwards from the specified `cwd`.
 * @param {string} cwd Current/starting directory
 * @return {Promise<Package | null>}
 */
export async function findPackage(cwd: string): Promise<Package | null> {
  const packagePath = await findPackagePath(cwd);

  if (!packagePath) {
    return null;
  }

  try {
    const source = await readFile(packagePath, {encoding: 'utf8'});
    return JSON.parse(source);
  } catch (_err) {
    return null;
  }
}
