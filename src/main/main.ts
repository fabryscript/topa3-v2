/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { spawn } from 'child_process';
import MenuBuilder from './menu';
import {
  getProjectFolderPath,
  getProjectsFileName,
  resolveHtmlPath,
} from './util';
import { ProjectFile } from '../renderer/types';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 720,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    resizable: false,
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

// create a new projects.json file if it doesn't already exist
const projectsFilePath = app.getPath('documents') + getProjectsFileName();
const projectsFileExists = existsSync(projectsFilePath);
const DEFAULT_PROJECTS_FILE_CONTENT = JSON.stringify([]);
const readProjectsFile = () => readFileSync(projectsFilePath).toString();
const writeToProjectsFile = (content: string) =>
  writeFileSync(projectsFilePath, Buffer.from(content));

if (!projectsFileExists) writeToProjectsFile(DEFAULT_PROJECTS_FILE_CONTENT);

const runningShells: { name: string; pid: number }[] = [];

ipcMain.handle('retrieve-projects', (e) => {
  e.preventDefault();
  console.log('fire retrieve-projects');
  return readProjectsFile();
});

ipcMain.handle('new-project', async (_, file: string) => {
  const inputFile: { path: string; content: string; name: string } =
    JSON.parse(file);
  const projectsFile = JSON.parse(readProjectsFile());
  const payload = [...projectsFile, inputFile];
  try {
    writeToProjectsFile(JSON.stringify(payload));
    return 'ok';
  } catch (error) {
    return error;
  }
});

ipcMain.handle('start-project', async (e, file: ProjectFile[]) => {
  const { content, path: filePath, name } = file[0];
  const command = `cd ${getProjectFolderPath(filePath)} && ${content}`;
  const commandShell = spawn('sh', ['-c', command], {
    detached: true,
  });
  const decoder = new TextDecoder('utf-8');

  if (commandShell.stdout) {
    commandShell.stdout.on('data', (data) => {
      mainWindow?.webContents.send('shell-result', {
        name,
        out: decoder.decode(data),
      });
    });
  }
  runningShells.push({ name, pid: commandShell.pid! });
  commandShell.unref();
});

ipcMain.handle('kill-shell', async (e, name: string[]) => {
  const processIdx = runningShells.findIndex(
    (process) => process.name === name[0],
  );
  if (processIdx === -1) {
    return;
  }
  const { pid } = runningShells[processIdx];
  runningShells.splice(processIdx, 1);
  // Kill the process group associated with the parent shell process
  process.kill(-pid, 'SIGTERM');
});

app.on('window-all-closed', () => {
  runningShells.forEach(({ pid }) => process.kill(-pid, 'SIGTERM'));
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
