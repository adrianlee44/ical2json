import mock from "mock-fs";
import { existsSync, writeFileSync } from "fs";
import run from "../lib/run";
import { convert } from "../index";
import test from "ava";

test.before(() => {
  mock();

  const eventString =
    "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20130101\nDTEND;VALUE=DATE:20130102\nDTSTAMP:20111213T124028Z\nUID:9d6fa48343f70300fe3109efe@calendarlabs.com\nCREATED:20111213T123901Z\nDESCRIPTION:Visit http://calendarlabs.com/holidays/us/new-years-day.php to kn\n ow more about New Year's Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.\nLAST-MODIFIED:20111213T123901Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:New Year's Day\nTRANSP:TRANSPARENT\nEND:VEVENT";
  const eventObjs = convert(eventString);
  writeFileSync("test.ics", eventString);
  writeFileSync("wrongExt.data", eventString);
  writeFileSync("test-1.json", JSON.stringify(eventObjs, null, "  "));
});

test.after(() => {
  mock.restore();
});

test("read ics and write json", t => {
  return run({
    args: ["doesNotExist.ics", "wrongExt.data", "test.ics"]
  }).then(() => {
    t.false(existsSync("doesNotExist.json"));
    t.false(existsSync("wrongExt.json"));
    t.true(existsSync("test.json"));
  });
});

test("read .json and write ics", t => {
  return run({
    revert: true,
    args: ["test-1.json"]
  }).then(() => {
    t.true(existsSync("test-1.ics"));
  });
});
