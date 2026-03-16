import * as os from 'os';
import {IcalParam} from './ical2json';
import {COLON, CONTENT_LINE_LENGTH_FOLDED, SEMICOLON, SPACE} from './constants';

const homeDir = os.homedir();

export function untildify(path: string): string {
  return homeDir ? path.replace(/^~(?=$|\/|\\)/, homeDir) : path;
}

/**
 * Fold a content line at {@link CONTENT_LINE_LENGTH_FOLDED} octets and push
 * each segment into `lines`, per RFC 5545 §3.1 line-folding rules.
 * https://datatracker.ietf.org/doc/html/rfc5545#section-3.1
 */
export function maybeFoldLine(lines: string[], fullLine: string): void {
  do {
    lines.push(fullLine.substring(0, CONTENT_LINE_LENGTH_FOLDED));
    fullLine = SPACE + fullLine.substring(CONTENT_LINE_LENGTH_FOLDED);
  } while (fullLine.length > 1);
}

export function reconstructParam(key: string, param: IcalParam): string {
  const paramParts = Object.keys(param)
    .filter((k) => k !== '_')
    .map((k) => k + '=' + param[k]);
  const prefix =
    paramParts.length > 0 ? key + SEMICOLON + paramParts.join(SEMICOLON) : key;
  return prefix + COLON + param._;
}
