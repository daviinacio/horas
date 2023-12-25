import fs from 'fs';

export function readFile(file_path: string, notFound?: string): string {
  try {
    return fs.readFileSync(file_path, {
      encoding: 'utf-8'
    }) || notFound || '';
  }
  catch(err) {
    return notFound || '';
  }
}

export function writeFile(file_path: string, textData: string){
  fs.writeFileSync(file_path, textData, {
    encoding: 'utf-8'
  });
}

export function exists(file_path: string): boolean {
  return fs.existsSync(file_path);
}

export function mkdir(file_path: string, recursive = true){
  fs.mkdirSync(file_path, { recursive: true });
}
