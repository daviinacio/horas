import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { app } from '../constants.js';

// Program folder
export const program = (() =>{
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return __dirname.replace('/utils', '');
})();

export const user_home = process.env.HOME || process.env.USERPROFILE || '~/';

export const user_shared_data = process.env.APPDATA || (
  process.platform == 'darwin' ?
    process.env.HOME + '/Library/Preferences' :
    process.env.HOME + "/.local/share"
);

export const user_data = user_shared_data + '/' + app.name;
