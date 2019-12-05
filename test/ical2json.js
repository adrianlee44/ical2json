import { convert, revert } from "../index";
import test from "ava";

test("converting VEVENT", t => {
  const sampleContent =
    "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20130101\nDTEND;VALUE=DATE:20130102\nDTSTAMP:20111213T124028Z\nUID:9d6fa48343f70300fe3109efe@calendarlabs.com\nCREATED:20111213T123901Z\nDESCRIPTION:Visit http://calendarlabs.com/holidays/us/new-years-day.php to kn\n ow more about New Year's Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.\nLAST-MODIFIED:20111213T123901Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:New Year's Day\nTRANSP:TRANSPARENT\nEND:VEVENT";

  t.snapshot(convert(sampleContent));
});

test("missing :", t => {
  const testString = "BEGIN:VEVENT\rDTSTART;VALUE=DATE\rEND:VEVENT";
  const eventObjs = convert(testString);

  t.not(eventObjs.VEVENT, undefined);
  t.false(Object.prototype.hasOwnProperty.call(eventObjs.VEVENT[0], "DTSTART;VALUE=DATE"))
});

test("converting and reverting result in same content", t => {
  const normalize = text => text.replace(/\n\s?/g, "");

  const sampleContent =
    "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20130101\nDTEND;VALUE=DATE:20130102\nDTSTAMP:20111213T124028Z\nRDATE:20111213T124028Z\nRDATE:20111213T124028Z\nUID:9d6fa48343f70300fe3109efe@calendarlabs.com\nCREATED:20111213T123901Z\nDESCRIPTION:Visit http://calendarlabs.com/holidays/us/new-years-day.php to kn\n ow more about New Year's Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.\nLAST-MODIFIED:20111213T123901Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:New Year's Day\nTRANSP:TRANSPARENT\nEND:VEVENT";
  const output = revert(convert(sampleContent));
  t.is(normalize(output), normalize(sampleContent));
});

test("converting CR and making sure CR is handled correctly", t => {
  const eventString = "BEGIN:VEVENT\rDTSTART;VALUE=DATE:20130101\rEND:VEVENT";
  const eventObjs = convert(eventString);
  t.snapshot(eventObjs);
});

test("converting old newline and making sure CR is handled correctly", t => {
  const eventString =
    "BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20130101\r\nEND:VEVENT";
  const eventObjs = convert(eventString);
  t.snapshot(eventObjs);
});

test("converting multiple child nodes is handled correctly", t => {
  const eventString =
    "BEGIN:VEVENT\nINDEX:1\nBEGIN:VALARM\nTRIGGER:-P1DT0H0M0S\nEND:VALARM\nBEGIN:VALARM\nTRIGGER:-P0DT1H0M0S\nEND:VALARM\nEND:VEVENT\nBEGIN:VEVENT\nINDEX:2\nBEGIN:VALARM\nTRIGGER:-P1DT0H0M0S\nEND:VALARM\nBEGIN:VALARM\nTRIGGER:-P0DT1H0M0S\nEND:VALARM\nEND:VEVENT";
  const eventObjs = convert(eventString);
  t.snapshot(eventObjs);
});

test("converting multi-child w/o BEGIN-END", t => {
  const eventString =
    "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20130101\nDTEND;VALUE=DATE:20130102\nDTSTAMP:20111213T124028Z\nUID:9d6fa48343f70300fe3109efe@calendarlabs.com\nCREATED:20111213T123901Z\nDESCRIPTION:Visit http://calendarlabs.com/holidays/us/new-years-day.php to kn\n ow more about New Year's Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.\nLAST-MODIFIED:20111213T123901Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:New Year's Day\nEXDATE:20111215T093000\nEXDATE:20111216T093000\nTRANSP:TRANSPARENT\nEND:VEVENT";
  const eventObjs = convert(eventString);

  t.snapshot(eventObjs);
});

test("the parent object is popping from the stack", t => {
  const eventString =
    "BEGIN:VCALENDAR\rVERSION:2.0\rBEGIN:VTIMEZONE\rTZID:Asia/Shanghai\rBEGIN:STANDARD\rTZOFFSETFROM:+0800\rTZOFFSETTO:+0800\rTZNAME:CST\rDTSTART:19700101T000000\rEND:STANDARD\rEND:VTIMEZONE\rBEGIN:VEVENT\rDTSTART;TZID=Asia/Shanghai:20170322T100000\rDTEND;TZID=Asia/Shanghai:20170322T110000\rLOCATION:Unknown\rSUMMARY:Testing event\rDTSTAMP:20170321T163132Z\rCREATED:20170321T082755Z\rLAST-MODIFIED:20170321T092344Z\rEND:VEVENT\rEND:VCALENDAR\r";
  const eventObjs = convert(eventString);
  t.snapshot(eventObjs);
});

test("RFC example 1", t => {
  const eventString =
    "BEGIN:VCALENDAR\nPRODID:-//xyz Corp//NONSGML PDA Calendar Version 1.0//EN\nVERSION:2.0\nBEGIN:VEVENT\nDTSTAMP:19960704T120000Z\nUID:uid1@example.com\nORGANIZER:mailto:jsmith@example.com\nDTSTART:19960918T143000Z\nDTEND:19960920T220000Z\nSTATUS:CONFIRMED\nCATEGORIES:CONFERENCE\nSUMMARY:Networld+Interop Conference\nDESCRIPTION:Networld+Interop Conference\n  and Exhibit\n  Atlanta World Congress Center\n  Atlanta, Georgia\nEND:VEVENT\nEND:VCALENDAR";
  const eventObjs = convert(eventString);
  t.snapshot(eventObjs);
});