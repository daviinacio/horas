import type { ConfigEntries } from './types.js';
import * as utils from './utils/index.js';

const config_file_path = `${utils.path.user_data}/config.json`;

type ConfigType<Data> = {
  set: (key: keyof Data, value: string) => void,
  get: (key: keyof Data) => string,
  unset: (key: keyof Data) => void,
  setDefault: (key: keyof Data, value: string) => void,
  getDefault: (key: keyof Data) => string,
  getAll: () => Data
}

function ConfigLib<Data = never>() : ConfigType<Data> {

  utils.io.mkdir(utils.path.user_data);

  const data = JSON.parse(utils.io.readFile(config_file_path, '{}'));
  const defaultData = {} as any;

  function set(key: keyof Data, value: string): void {
    data[key] = value.replace('$', utils.path.user_home);
    utils.io.writeFile(config_file_path, JSON.stringify(data));
  }

  function get(key: keyof Data): string {
    return data[key] ?? defaultData[key];
  }

  function unset(key: keyof Data): void {
    delete data[key];
    utils.io.writeFile(config_file_path, JSON.stringify(data));
  }

  function setDefault(key: keyof Data, value: string): void {
    defaultData[key] = value.replace('$', utils.path.user_home);
  }

  function getDefault(key: keyof Data): string {
    return defaultData[key];
  }

  function getAll(): Data {
    return data as Data
  }

  return {
    set, get, unset,
    setDefault, getDefault,
    getAll
  }
}

export const config = ConfigLib<ConfigEntries>();
