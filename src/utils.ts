import * as os from 'os';

const homeDir = os.homedir();

export function untildify(path: string): string {
  return homeDir ? path.replace(/^~(?=$|\/|\\)/, homeDir) : path;
}
