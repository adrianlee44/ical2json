// Make sure lines are splited correctly
// http://stackoverflow.com/questions/1155678/javascript-string-newline-character
const NEW_LINE = /\r\n|\n|\r/;
const COLON = ':';
// const COMMA = ",";
// const DQUOTE = "\"";
// const SEMICOLON = ";";
const SPACE = ' ';

export interface IcalObject {
  [key: string]: string | string[] | IcalObject[];
}

/**
 * Take ical string data and convert to JSON
 */
function convert(source: string): IcalObject {
  const output: IcalObject = {};
  const lines = source.split(NEW_LINE);

  let parentObj: IcalObject = {};
  let currentObj: IcalObject = output;
  const parents: IcalObject[] = [];

  let currentKey = '';

  for (let i = 0; i < lines.length; i++) {
    let currentValue = '';

    const line = lines[i];
    if (line.charAt(0) === SPACE) {
      currentObj[currentKey] += line.substr(1);
    } else {
      const splitAt = line.indexOf(COLON);

      if (splitAt < 0) {
        continue;
      }

      currentKey = line.substr(0, splitAt);
      currentValue = line.substr(splitAt + 1);

      switch (currentKey) {
        case 'BEGIN':
          parents.push(parentObj);
          parentObj = currentObj;
          if (parentObj[currentValue] == null) {
            parentObj[currentValue] = [];
          }
          // Create a new object, store the reference for future uses
          currentObj = {};
          (parentObj[currentValue] as IcalObject[]).push(currentObj);
          break;
        case 'END':
          currentObj = parentObj;
          parentObj = parents.pop() as IcalObject;
          break;
        default:
          if (currentObj[currentKey]) {
            if (!Array.isArray(currentObj[currentKey])) {
              currentObj[currentKey] = [currentObj[currentKey]] as string[];
            }
            (currentObj[currentKey] as string[]).push(currentValue);
          } else {
            (currentObj[currentKey] as string) = currentValue;
          }
      }
    }
  }
  return output;
}

/**
 * Take JSON, revert back to ical
 */
function revert(object: IcalObject): string {
  const lines = [];

  for (let key in object) {
    const value = object[key];
    if (Array.isArray(value)) {
      if (key === 'RDATE') {
        (value as string[]).forEach((item: string) => {
          lines.push(key + ':' + item);
        });
      } else {
        (value as IcalObject[]).forEach((item: IcalObject) => {
          lines.push('BEGIN:' + key);
          lines.push(revert(item));
          lines.push('END:' + key);
        });
      }
    } else {
      let fullLine = key + ':' + value;
      do {
        // According to ical spec, lines of text should be no longer
        // than 75 octets
        lines.push(fullLine.substr(0, 75));
        fullLine = SPACE + fullLine.substr(75);
      } while (fullLine.length > 1);
    }
  }

  return lines.join('\n');
}

export {revert, convert};
