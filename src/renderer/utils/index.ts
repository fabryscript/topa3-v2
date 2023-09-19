export function getWorkspaceFolderName(path: string) {
  let r;
  if (path.includes('\\')) {
    r = path.split('\\');
  } else {
    r = path.split('/');
  }
  return r[r.length - 2];
}

export function getFileName(path: string) {
  let r;
  if (path.includes('\\')) {
    r = path.split('\\');
  } else {
    r = path.split('/');
  }
  return r[r.length - 1];
}
