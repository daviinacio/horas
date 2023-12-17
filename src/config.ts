async function SetupConfig(){
  let root_path = '/documents';

  return {
    get root_path(){
      return root_path;
    }
  }
}
