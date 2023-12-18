function getSharedUserDataFolder(){
  return process.env.APPDATA || (
    process.platform == 'darwin' ?
      process.env.HOME + '/Library/Preferences' :
      process.env.HOME + "/.local/share"
    );
}


export const utils = {
  path: {
    get user_shared_data() {
      return getSharedUserDataFolder();
    },
    get user_data() {
      return getSharedUserDataFolder() + '/task-time-manager';
    },
  }
}
