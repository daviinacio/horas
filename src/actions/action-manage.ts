import type { ConfigEntries } from '../types.js';
import * as utils from '../utils/index.js';
import * as constants from '../constants.js';
import { config } from '../config.js';

export function update(){
  const program_folder = utils.path.program;

  // Update using git and build
  if(utils.io.exists(`${program_folder}/../.git`)){
    console.log('Buscando atualizações (git)');

    const root_folder = `${program_folder}/..`;

    /** TODO:
     * - validate command errors
     * - validate up-to-date
     */
    
    utils.bash.exec(`
      cd ${root_folder}
      git pull
      npm install
      npm run build
    `);

    console.log('Atualizado com sucesso');
  }
  else {
    console.log('Buscando atualizações');
    utils.bash.exec(`
      npm up -g ${constants.app.name}
    `);

    console.log('Atualizado com sucesso');
  }

  /** 
   * Using GIT
   * git pull
   * <!up-do-date>
   *   npm run build
   * 
   * Not using GIT
   *  fetch version info
   *  <!up-do-date>
   *    fetch new version
   *    override files
   */
};

type ConfigOptions = {
  global: undefined | true
  listAll: undefined | true
  unset: undefined | keyof ConfigEntries
  get: undefined | keyof ConfigEntries
}

export function configure(key: keyof ConfigEntries, value: string, options: ConfigOptions){
  // TODO: Validar se key está na lista de permitidos.
  // TODO: Criar helper com lista de configs permitidas

  if(options.listAll){
    Object.keys(config.getAll()).forEach(key => {
      console.log(`${key}: ${config.get(key as keyof ConfigEntries)}`)
    });
  }
  else
  if(options.unset){
    config.unset(options.unset)
  }
  else
  if(options.get){
    console.log(
      config.get(options.get)
    )
  }
  else
  if(key && value){
    config.set(key, value);
  }
}
