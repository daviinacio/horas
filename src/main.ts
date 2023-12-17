#!/usr/bin/env node

async function main(){
  const config = await SetupConfig();
  console.log(config.root_path, '2');
}

main();
