import * as path from 'path';
import * as fs from 'fs';
import {convert, revert, IcalObject} from './ical2json';
import {untildify} from './utils';

const cwd = process.cwd();

interface Ical2JsonOptions {
  outputDir?: string;
  revert?: boolean;
  stdout?: boolean;
}

export default function (
  files: string[] = [],
  options: Ical2JsonOptions
): boolean {
  let outputDir = '';
  if (options.outputDir) {
    outputDir = path.resolve(cwd, untildify(options.outputDir));
    const outputDirStat = fs.statSync(outputDir, {throwIfNoEntry: false});

    if (!outputDirStat || !outputDirStat.isDirectory()) {
      console.error(`ical2json: ${outputDir}: Invalid directory`);
      return false;
    }
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.resolve(cwd, file);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath);

    const isConvert = !options.revert && ext === '.ics';
    const isRevert = options.revert && ext === '.json';

    if (!stat.isFile() || (!isConvert && !isRevert)) {
      continue;
    }

    const buffer = fs.readFileSync(filePath);

    let output;
    const data = buffer.toString();

    if (isConvert) {
      output = convert(data);
      output = JSON.stringify(output, null, '  ');
    } else if (isRevert) {
      output = revert(JSON.parse(data) as IcalObject);
    }

    if (!output) continue;

    const basename = path.basename(filePath, ext);
    const dirname = outputDir || path.dirname(filePath);
    const compiledExt = isConvert ? '.json' : '.ics';
    const writePath = path.join(dirname, basename) + compiledExt;

    if (options.stdout) {
      console.log(output);
    } else {
      fs.writeFileSync(writePath, output);
    }
  }

  return true;
}
