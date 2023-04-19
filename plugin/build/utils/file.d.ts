/**
 * Reads a file, returning an object containing the
 * function and a method that allows to write to that file.
 * @param path The path to the file.
 */
export declare function readFile(...path: string[]): {
    content: string;
    write: (newContent: string) => string;
};
