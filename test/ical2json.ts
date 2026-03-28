import {convert, revert, IcalObject} from '../src/ical2json.js';
import test from 'ava';

test('converting VEVENT', (t) => {
  const sampleContent =
    "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20130101\nDTEND;VALUE=DATE:20130102\nDTSTAMP:20111213T124028Z\nUID:9d6fa48343f70300fe3109efe@calendarlabs.com\nCREATED:20111213T123901Z\nDESCRIPTION:Visit http://calendarlabs.com/holidays/us/new-years-day.php to kn\n ow more about New Year's Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.\nLAST-MODIFIED:20111213T123901Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:New Year's Day\nTRANSP:TRANSPARENT\nEND:VEVENT";

  t.snapshot(convert(sampleContent));
});

test('missing :', (t) => {
  const testString = 'BEGIN:VEVENT\rDTSTART;VALUE=DATE\rEND:VEVENT';
  const eventObjs = convert(testString);

  t.not(eventObjs.VEVENT, undefined);
  t.false(
    Object.prototype.hasOwnProperty.call(
      (eventObjs.VEVENT as IcalObject[])[0],
      'DTSTART;VALUE=DATE'
    )
  );
});

test('converting and reverting result in same content', (t) => {
  const normalize = (text: string) => text.replace(/\n\s?/g, '');

  const sampleContent =
    "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20130101\nDTEND;VALUE=DATE:20130102\nDTSTAMP:20111213T124028Z\nRDATE:20111213T124028Z,20111213T124028Z\nUID:9d6fa48343f70300fe3109efe@calendarlabs.com\nCREATED:20111213T123901Z\nDESCRIPTION:Visit http://calendarlabs.com/holidays/us/new-years-day.php to kn\n ow more about New Year's Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.\nLAST-MODIFIED:20111213T123901Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:New Year's Day\nTRANSP:TRANSPARENT\nEND:VEVENT";
  const output = revert(convert(sampleContent));
  t.is(normalize(output), normalize(sampleContent));
});

test('converting CR and making sure CR is handled correctly', (t) => {
  const eventString = 'BEGIN:VEVENT\rDTSTART;VALUE=DATE:20130101\rEND:VEVENT';
  const eventObjs = convert(eventString);
  t.snapshot(eventObjs);
});

test('converting old newline and making sure CR is handled correctly', (t) => {
  const eventString =
    'BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20130101\r\nEND:VEVENT';
  const eventObjs = convert(eventString);
  t.snapshot(eventObjs);
});

test('converting multiple child nodes is handled correctly', (t) => {
  const eventString =
    'BEGIN:VEVENT\nINDEX:1\nBEGIN:VALARM\nTRIGGER:-P1DT0H0M0S\nEND:VALARM\nBEGIN:VALARM\nTRIGGER:-P0DT1H0M0S\nEND:VALARM\nEND:VEVENT\nBEGIN:VEVENT\nINDEX:2\nBEGIN:VALARM\nTRIGGER:-P1DT0H0M0S\nEND:VALARM\nBEGIN:VALARM\nTRIGGER:-P0DT1H0M0S\nEND:VALARM\nEND:VEVENT';
  const eventObjs = convert(eventString);
  t.snapshot(eventObjs);
});

test('converting multi-child w/o BEGIN-END', (t) => {
  const eventString =
    "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20130101\nDTEND;VALUE=DATE:20130102\nDTSTAMP:20111213T124028Z\nUID:9d6fa48343f70300fe3109efe@calendarlabs.com\nCREATED:20111213T123901Z\nDESCRIPTION:Visit http://calendarlabs.com/holidays/us/new-years-day.php to kn\n ow more about New Year's Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.\nLAST-MODIFIED:20111213T123901Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:New Year's Day\nEXDATE:20111215T093000\nEXDATE:20111216T093000\nTRANSP:TRANSPARENT\nEND:VEVENT";
  const eventObjs = convert(eventString);

  t.snapshot(eventObjs);
});

test('the parent object is popping from the stack', (t) => {
  const eventString =
    'BEGIN:VCALENDAR\rVERSION:2.0\rBEGIN:VTIMEZONE\rTZID:Asia/Shanghai\rBEGIN:STANDARD\rTZOFFSETFROM:+0800\rTZOFFSETTO:+0800\rTZNAME:CST\rDTSTART:19700101T000000\rEND:STANDARD\rEND:VTIMEZONE\rBEGIN:VEVENT\rDTSTART;TZID=Asia/Shanghai:20170322T100000\rDTEND;TZID=Asia/Shanghai:20170322T110000\rLOCATION:Unknown\rSUMMARY:Testing event\rDTSTAMP:20170321T163132Z\rCREATED:20170321T082755Z\rLAST-MODIFIED:20170321T092344Z\rEND:VEVENT\rEND:VCALENDAR\r';
  const eventObjs = convert(eventString);
  t.snapshot(eventObjs);
});

test('converting VTIMEZONE with STANDARD and DAYLIGHT', (t) => {
  const eventString =
    'BEGIN:VCALENDAR\r\nPRODID:-//RDU Software//NONSGML HandCal//EN\r\nVERSION:2.0\r\nBEGIN:VTIMEZONE\r\nTZID:America/New_York\r\nBEGIN:STANDARD\r\nDTSTART:19981025T020000\r\nTZOFFSETFROM:-0400\r\nTZOFFSETTO:-0500\r\nTZNAME:EST\r\nEND:STANDARD\r\nBEGIN:DAYLIGHT\r\nDTSTART:19990404T020000\r\nTZOFFSETFROM:-0500\r\nTZOFFSETTO:-0400\r\nTZNAME:EDT\r\nEND:DAYLIGHT\r\nEND:VTIMEZONE\r\nBEGIN:VEVENT\r\nDTSTAMP:19980309T231000Z\r\nUID:guid-1.example.com\r\nORGANIZER:mailto:mrbig@example.com\r\nATTENDEE;RSVP=TRUE;ROLE=REQ-PARTICIPANT;CUTYPE=GROUP:\r\n mailto:employee-A@example.com\r\nDESCRIPTION:Project XYZ Review Meeting\r\nCATEGORIES:MEETING\r\nCLASS:PUBLIC\r\nCREATED:19980309T130000Z\r\nSUMMARY:XYZ Project Review\r\nDTSTART;TZID=America/New_York:19980312T083000\r\nDTEND;TZID=America/New_York:19980312T093000\r\nLOCATION:1CP Conference Room 4350\r\nEND:VEVENT\r\nEND:VCALENDAR';
  const eventObjs = convert(eventString);
  t.snapshot(eventObjs);
});

test('converting comma-separated multi-value property', (t) => {
  const line = 'CATEGORIES:APPOINTMENT,EDUCATION';
  t.deepEqual(convert(line), {CATEGORIES: ['APPOINTMENT', 'EDUCATION']});
});

test('round-trip comma-separated multi-value property', (t) => {
  const input = 'BEGIN:VEVENT\nCATEGORIES:APPOINTMENT,EDUCATION\nEND:VEVENT';
  t.deepEqual(convert(revert(convert(input))), convert(input));
});

test('comma in non-multi-value property is preserved as string', (t) => {
  const line = 'SUMMARY:Dinner, drinks, and discussion';
  t.deepEqual(convert(line), {SUMMARY: 'Dinner, drinks, and discussion'});
});

test('round-trip non-multi-value property with comma', (t) => {
  const input =
    'BEGIN:VEVENT\nSUMMARY:Dinner, drinks, and discussion\nEND:VEVENT';
  t.deepEqual(convert(revert(convert(input))), convert(input));
});

test('Apple x-property with x-params is parsed correctly', (t) => {
  const line =
    'X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS=1 Infinite Loop;X-APPLE-RADIUS=100;X-TITLE=Apple HQ:geo:37.3317,-122.0307';
  t.deepEqual(convert(line), {
    'X-APPLE-STRUCTURED-LOCATION': {
      _: 'geo:37.3317,-122.0307',
      VALUE: 'URI',
      'X-ADDRESS': '1 Infinite Loop',
      'X-APPLE-RADIUS': '100',
      'X-TITLE': 'Apple HQ',
    },
  });
});

test('x-param is parsed as a parameter', (t) => {
  const line = 'DTSTART;X-FOO=bar;VALUE=DATE:19980312T083000';
  t.deepEqual(convert(line), {
    DTSTART: {_: '19980312T083000', 'X-FOO': 'bar', VALUE: 'DATE'},
  });
});

test('parameter parsing', (t) => {
  const line = 'DTSTART;TZID=America/New_York;VALUE=DATE:19980312T083000';
  const result = convert(line);
  t.deepEqual(result, {
    DTSTART: {_: '19980312T083000', TZID: 'America/New_York', VALUE: 'DATE'},
  });
});

test('round-trip parameterized property', (t) => {
  const input =
    'BEGIN:VEVENT\nDTSTART;TZID=America/New_York:19980312T083000\nEND:VEVENT';
  const output = revert(convert(input));
  t.deepEqual(convert(output), convert(input));
});

test('RFC example 1', (t) => {
  const eventString =
    'BEGIN:VCALENDAR\nPRODID:-//xyz Corp//NONSGML PDA Calendar Version 1.0//EN\nVERSION:2.0\nBEGIN:VEVENT\nDTSTAMP:19960704T120000Z\nUID:uid1@example.com\nORGANIZER:mailto:jsmith@example.com\nDTSTART:19960918T143000Z\nDTEND:19960920T220000Z\nSTATUS:CONFIRMED\nCATEGORIES:CONFERENCE\nSUMMARY:Networld+Interop Conference\nDESCRIPTION:Networld+Interop Conference\n  and Exhibit\n  Atlanta World Congress Center\n  Atlanta, Georgia\nEND:VEVENT\nEND:VCALENDAR';
  const eventObjs = convert(eventString);
  t.snapshot(eventObjs);
});
