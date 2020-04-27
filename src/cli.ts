import * as path from 'path';
import * as fs from 'fs';
import {convert, revert, IcalObject} from './ical2json';

const cwd = process.cwd();

interface Ical2JsonOptions {
  revert: boolean;
  args?: string[];
}

/**
 * Pass in options to parse and generate JSON files
 * @param {Object} options
 * @return {Promise}
 */
export default function (options: Ical2JsonOptions) {
  const filePromises = [];
  const files = options.args || [];

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

    const basename = path.basename(filePath, ext);
    const dirname = path.dirname(filePath);
    const compiledExt = isConvert ? '.json' : '.ics';
    const writePath = path.join(dirname, basename) + compiledExt;

    fs.writeFileSync(writePath, output);
  }

  return true;
}
