import type { ConfigEntries } from './types.js';
import * as utils from './utils/index.js';

const config_file_path = `${utils.path.user_data}/config.json`;

type ConfigType<Entries> = {
  set: (key: Entries, value: string) => void,
  get: (key: Entries) => string,
  unset: (key: Entries) => void,
  setDefault: (key: Entries, value: string) => void,
  getDefault: (key: Entries) => string,
}

function ConfigLib<Entries>() : ConfigType<Entries> {
  utils.io.mkdir(utils.path.user_data);

  const data = JSON.parse(utils.io.readFile(config_file_path, '{}'));
  const defaultData = {} as any;

  function set(key: Entries, value: string): void {
    data[key] = value.replace('$', utils.path.user_home);
    utils.io.writeFile(config_file_path, JSON.stringify(data));
  }

  function get(key: Entries): string {
    return data[key] ?? defaultData[key];
  }

  function unset(key: Entries): void {
    delete data[key];
    utils.io.writeFile(config_file_path, JSON.stringify(data));
  }

  function setDefault(key: Entries, value: string): void {
    defaultData[key] = value.replace('$', utils.path.user_home);
  }

  function getDefault(key: Entries): string {
    return defaultData[key];
  }

  return {
    set, get, unset,
    setDefault, getDefault
  }
}

export const config = ConfigLib<keyof ConfigEntries>();
