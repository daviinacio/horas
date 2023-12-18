import { utils } from "./utils";
import fs from 'fs';
import type { ConfigEntries } from './types';

const config_file_path = `${utils.path.user_data}/config.json`;

type ConfigType<Entries> = {
  set: (key: Entries, value: string) => void,
  get: (key: Entries) => string,
  unset: (key: Entries) => void
}

function ConfigLib<Entries>() : ConfigType<Entries> {
  fs.mkdirSync(utils.path.user_data, { recursive: true });

  const data = JSON.parse(readFile());

  function set(key: Entries, value: string): void {
    data[key] = value;
    writeFile(JSON.stringify(data));
  }

  function get(key: Entries): string {
    return data[key];
  }

  function unset(key: Entries): void {
    delete data[key];
    writeFile(JSON.stringify(data));
  }

  function readFile(): string{
    try {
      return fs.readFileSync(config_file_path, {
        encoding: 'utf-8'
      }) || '{}';
    }
    catch(err) {
      return '{}'
    }
  }

  function writeFile(textData: string){
    fs.writeFileSync(config_file_path, textData, {
      encoding: 'utf-8'
    })
  }

  return {
    set, get, unset
  }
}

export const config = ConfigLib<keyof ConfigEntries>();
