import fs from 'fs';
import { config } from './config';

function getSharedUserDataFolder(): string{
  return process.env.APPDATA || (
    process.platform == 'darwin' ?
      process.env.HOME + '/Library/Preferences' :
      process.env.HOME + "/.local/share"
    );
}

function getUserHomeFolder(): string{
  return process.env.HOME || process.env.USERPROFILE || '~/';
}

function dateformat(date: Date, format?: string){
  return (format || config.get('dateformat'))
    .replace('yyyy', String(date.getFullYear()))
    .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
    .replace('dd', String(date.getDate()).padStart(2, '0'));
}

function readFile(file_path: string, notFound?: string): string {
  try {
    return fs.readFileSync(file_path, {
      encoding: 'utf-8'
    }) || notFound || '';
  }
  catch(err) {
    return notFound || '';
  }
}

function writeFile(file_path: string, textData: string){
  fs.writeFileSync(file_path, textData, {
    encoding: 'utf-8'
  });
}

function pathExists(file_path: string): boolean {
  return fs.existsSync(file_path);
}

function mkdirRecursive(file_path: string){
  fs.mkdirSync(file_path, { recursive: true });
}

function run(fn: Function){
  try {
    return fn();
  }
  catch(err){
    if(err instanceof Error){
      console.error(err.message);
    }
  }
}

export const utils = {
  path: {
    get user_shared_data() {
      return getSharedUserDataFolder();
    },
    get user_data() {
      return getSharedUserDataFolder() + '/task-time-manager';
    },
    get user_home() {
      return getUserHomeFolder();
    }
  },
  text: {
    dateformat
  },
  io: {
    readFile,
    writeFile,
    exists: pathExists,
    mkdirRecursive
  },
  run
}
