import {join, dirname} from 'node:path';
import {existsSync, readFileSync} from 'node:fs';
import run from '../src/cli.js';
import {convert} from '../src/ical2json.js';
import anyTest, {TestFn} from 'ava';
import {write, directory} from 'tempy';

interface TestContext {
  eventString: string;
  testIcsFile: string;
  wrongExtFile: string;
  testJsonFile: string;
  directoryPath: string;
}

const test = anyTest as TestFn<TestContext>;

const outputFilePath = (source: string, filename: string) => {
  const sourceDir = dirname(source);
  return join(sourceDir, filename);
};

test.before(async (t) => {
  t.context.eventString =
    "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20130101\nDTEND;VALUE=DATE:20130102\nDTSTAMP:20111213T124028Z\nUID:9d6fa48343f70300fe3109efe@calendarlabs.com\nCREATED:20111213T123901Z\nDESCRIPTION:Visit http://calendarlabs.com/holidays/us/new-years-day.php to \n know more about New Year's Day. Like us on Facebook: http://fb.com/calenda\n rlabs to get updates.\nLAST-MODIFIED:20111213T123901Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:New Year's Day\nTRANSP:TRANSPARENT\nEND:VEVENT";
  const eventObjs = convert(t.context.eventString);

  t.context.testIcsFile = await write(t.context.eventString, {
    name: 'test.ics',
  });
  t.context.wrongExtFile = await write(t.context.eventString, {
    name: 'wrongExt.data',
  });
  t.context.testJsonFile = await write(JSON.stringify(eventObjs, null, '  '), {
    name: 'test-1.json',
  });
  t.context.directoryPath = await directory();
});

test('read ics and write json', (t) => {
  const doesNotExistFile = join(t.context.directoryPath, 'doesNotExist.ics');
  run({
    revert: false,
    args: [doesNotExistFile, t.context.wrongExtFile, t.context.testIcsFile],
  });
  t.false(existsSync(outputFilePath(doesNotExistFile, 'doesNotExist.json')));
  t.false(existsSync(outputFilePath(t.context.wrongExtFile, 'wrongExt.json')));
  t.true(existsSync(outputFilePath(t.context.testIcsFile, 'test.json')));
});

test('read .json and write ics', (t) => {
  run({
    revert: true,
    args: [t.context.testJsonFile],
  });
  const outputIcs = outputFilePath(t.context.testIcsFile, 'test.ics');
  t.true(existsSync(outputIcs));
  t.is(readFileSync(outputIcs).toString(), t.context.eventString);
});
