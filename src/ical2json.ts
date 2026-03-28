import {maybeFoldLine, reconstructParam} from './utils';
import {
  COLON,
  COMMA,
  COMMA_SPLIT,
  EQUAL,
  MULTI_VALUE_PROPERTIES,
  NEW_LINE,
  SEMICOLON,
  SPACE,
} from './constants';

export interface IcalParam {
  _: string;
  [key: string]: string;
}

export interface IcalObject {
  [key: string]: string | string[] | IcalObject[] | IcalParam | IcalParam[];
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
    let currentValue: string;

    const line = lines[i];
    // Folded lines
    if (line.charAt(0) === SPACE) {
      const existing = currentObj[currentKey];
      // Continuation of a single IcalParam — append to its value
      if (
        existing !== null &&
        typeof existing === 'object' &&
        !Array.isArray(existing)
      ) {
        (existing as IcalParam)._ += line.substring(1);
      } else if (
        // Continuation of the last IcalParam in an array
        Array.isArray(existing) &&
        existing.length > 0 &&
        typeof existing[0] === 'object' &&
        '_' in (existing[0] as IcalParam)
      ) {
        (existing as IcalParam[])[existing.length - 1]._ += line.substring(1);
      } else {
        // Continuation of a plain string value
        currentObj[currentKey] += line.substring(1);
      }
    } else {
      const splitAt = line.indexOf(COLON);

      if (splitAt < 0) {
        continue;
      }

      currentKey = line.substring(0, splitAt);
      currentValue = line.substring(splitAt + 1);

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
        default: {
          const semicolonAt = currentKey.indexOf(SEMICOLON);
          if (semicolonAt >= 0) {
            const segments = currentKey.split(SEMICOLON);
            currentKey = segments[0];
            const param: IcalParam = {_: currentValue};
            for (let j = 1; j < segments.length; j++) {
              const eqAt = segments[j].indexOf(EQUAL);
              if (eqAt >= 0) {
                param[segments[j].substring(0, eqAt)] = segments[j].substring(
                  eqAt + 1
                );
              }
            }
            if (currentObj[currentKey]) {
              if (!Array.isArray(currentObj[currentKey])) {
                currentObj[currentKey] = [
                  currentObj[currentKey],
                ] as IcalParam[];
              }
              (currentObj[currentKey] as IcalParam[]).push(param);
            } else {
              currentObj[currentKey] = param;
            }
          } else {
            const values = MULTI_VALUE_PROPERTIES.has(currentKey)
              ? currentValue.split(COMMA_SPLIT)
              : null;

            if (values && values.length > 1) {
              if (Array.isArray(currentObj[currentKey])) {
                (currentObj[currentKey] as string[]).push(...values);
              } else {
                currentObj[currentKey] = values;
              }
            } else {
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
      }
    }
  }
  return output;
}

/**
 * Take JSON, revert back to ical
 */
function revert(object: IcalObject): string {
  const lines: string[] = [];

  for (const key in object) {
    const value = object[key];
    if (Array.isArray(value)) {
      if (value.length === 0) {
        // nothing to emit
      } else if (typeof value[0] === 'string') {
        if (MULTI_VALUE_PROPERTIES.has(key)) {
          // Emit as comma-joined single line
          maybeFoldLine(lines, key + COLON + (value as string[]).join(COMMA));
        } else {
          // Emit as separate content lines (custom/duplicate properties)
          (value as string[]).forEach((item: string) => {
            lines.push(key + COLON + item);
          });
        }
      } else if ('_' in (value[0] as IcalParam)) {
        // IcalParam[]
        (value as IcalParam[]).forEach((param: IcalParam) => {
          maybeFoldLine(lines, reconstructParam(key, param));
        });
      } else {
        // IcalObject[]
        (value as IcalObject[]).forEach((item: IcalObject) => {
          lines.push('BEGIN:' + key);
          lines.push(revert(item));
          lines.push('END:' + key);
        });
      }
    } else if (typeof value === 'object' && '_' in (value as IcalParam)) {
      // single IcalParam
      maybeFoldLine(lines, reconstructParam(key, value as IcalParam));
    } else {
      // plain string
      maybeFoldLine(lines, key + COLON + value);
    }
  }

  return lines.join('\n');
}

export {revert, convert};
