import * as utils from '../utils/index.js';

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
      npm up -g horas
    `);
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
