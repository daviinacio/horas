import { execSync } from "child_process";

export function exec(command: string){
  return execSync(command);
}
