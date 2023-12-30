
export * as io from './io.js';
export * as date from './date.js';
export * as path from './path.js';
export * as bash from './bash.js';

// General
import * as io from './io.js';
import * as path from './path.js';

export const pkg = JSON.parse(io.readFile(
  `${path.program}/../package.json`, `{
    "name": "horas"
  }`
));
