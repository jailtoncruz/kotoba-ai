/**
 * Splits a file path into an array of folders.
 * Supports both Windows and Linux/Unix path formats.
 *
 * @param path - The file or folder path to split.
 * @returns An array of folders in the path.
 */
export function splitPathToArray(path: string): string[] {
  if (!path || typeof path !== 'string')
    throw new Error('Invalid path. Please provide a valid string.');

  const normalizedPath = path.replace(/\\/g, '/');
  return normalizedPath.split('/').filter((part) => part.length > 0);
}
