import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Reads a file, returning an object containing the
 * function and a method that allows to write to that file.
 * @param path The path to the file.
 */
export function readFile(...path: string[]) {
  const fullPath = join(...path);
  const content = readFileSync(fullPath, 'utf-8');

  const write = (newContent: string) => {
    writeFileSync(fullPath, newContent, 'utf-8');
    return newContent;
  };

  return { content, write };
}
