/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function getProjectsFileName() {
  const slash = process.platform === 'win32' ? '\\' : '/';
  return `${slash}projects.json`;
}

export function getProjectFolderPath(dir: string) {
  // <path>/_topa3
  const slash = process.platform === 'win32' ? '\\' : '/';
  const splittedDir = dir.split(slash);
  splittedDir.splice(splittedDir.length - 1, 1);
  return splittedDir.join(slash) + slash;
}
