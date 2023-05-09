"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Reads a file, returning an object containing the
 * function and a method that allows to write to that file.
 * @param path The path to the file.
 */
function readFile(...path) {
    const fullPath = (0, path_1.join)(...path);
    const content = (0, fs_1.readFileSync)(fullPath, 'utf-8');
    const write = (newContent) => {
        (0, fs_1.writeFileSync)(fullPath, newContent, 'utf-8');
        return newContent;
    };
    return { content, write };
}
exports.readFile = readFile;
