'use strict';

const ical2json = require("./index");
const fs = require("fs");

exports["convert"] = {
  setUp: function (callback) {
    this.eventString = "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20130101\nDTEND;VALUE=DATE:20130102\nDTSTAMP:20111213T124028Z\nUID:9d6fa48343f70300fe3109efe@calendarlabs.com\nCREATED:20111213T123901Z\nDESCRIPTION:Visit http://calendarlabs.com/holidays/us/new-years-day.php to kn\n ow more about New Year's Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.\nLAST-MODIFIED:20111213T123901Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:New Year's Day\nTRANSP:TRANSPARENT\nEND:VEVENT";
    this.eventObjs = ical2json.convert(this.eventString);
    callback();
  },

  "converted VEVENT": function (test) {
    test.notEqual(this.eventObjs.VEVENT, undefined);
    test.done();
  },

  "event count": function (test) {
    test.equal(this.eventObjs.VEVENT.length, 1);
    test.done();
  },

  "long description": function (test) {
    let desc = "Visit http://calendarlabs.com/holidays/us/new-years-day.php to know more about New Year\'s Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.";
    test.equal(this.eventObjs.VEVENT[0].DESCRIPTION, desc);
    test.done();
  },

  "summary": function (test) {
    test.equal(this.eventObjs.VEVENT[0].SUMMARY, "New Year\'s Day");
    test.done();
  },

  "missing :": function (test) {
    let testString = "BEGIN:VEVENT\rDTSTART;VALUE=DATE\rEND:VEVENT";
    let eventObjs = ical2json.convert(testString);

    test.notEqual(eventObjs.VEVENT, undefined);
    test.ok(!eventObjs.VEVENT[0].hasOwnProperty('DTSTART;VALUE=DATE'));

    test.done();
  },

  "revert": function (test) {
    test.equal(this.eventString.replace(/\n\s?/g, ''),
      ical2json.revert(this.eventObjs).replace(/\n\s?/g, ''));
    test.done();
  }
};

exports["convert CR"] = {
  "make sure CR is handled correctly": function (test) {
    let eventString = "BEGIN:VEVENT\rDTSTART;VALUE=DATE:20130101\rEND:VEVENT";
    let eventObjs = ical2json.convert(eventString);

    test.notEqual(eventObjs.VEVENT, undefined);
    test.equal(eventObjs.VEVENT[0]['DTSTART;VALUE=DATE'], '20130101');
    test.done();
  }
};

exports["convert old newline"] = {
  "make sure CR is handled correctly": function (test) {
    let eventString = "BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20130101\r\nEND:VEVENT";
    let eventObjs = ical2json.convert(eventString);

    test.notEqual(eventObjs.VEVENT, undefined);

    test.done();
  }
};

exports["convert multi-child"] = {
  "make sure multiple child nodes are handled correctly": function (test) {
    let eventString = "BEGIN:VEVENT\nINDEX:1\nBEGIN:VALARM\nTRIGGER:-P1DT0H0M0S\nEND:VALARM\nBEGIN:VALARM\nTRIGGER:-P0DT1H0M0S\nEND:VALARM\nEND:VEVENT\nBEGIN:VEVENT\nINDEX:2\nBEGIN:VALARM\nTRIGGER:-P1DT0H0M0S\nEND:VALARM\nBEGIN:VALARM\nTRIGGER:-P0DT1H0M0S\nEND:VALARM\nEND:VEVENT";
    let eventObjs = ical2json.convert(eventString);

    test.equal(eventObjs.VEVENT.length, 2);
    test.equal(eventObjs.VEVENT[0].VALARM.length, 2);
    test.equal(eventObjs.VEVENT[1].VALARM.length, 2);

    test.equal(eventString.replace(/\n\s?/g, ''),
      ical2json.revert(eventObjs).replace(/\n\s?/g, ''));

    test.done();
  }
};

exports["convert multi-child w/o BEGIN-END"] =  {
  "make sure multiple child nodes are handled properly": function (test) {
    let eventString = "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20130101\nDTEND;VALUE=DATE:20130102\nDTSTAMP:20111213T124028Z\nUID:9d6fa48343f70300fe3109efe@calendarlabs.com\nCREATED:20111213T123901Z\nDESCRIPTION:Visit http://calendarlabs.com/holidays/us/new-years-day.php to kn\n ow more about New Year's Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.\nLAST-MODIFIED:20111213T123901Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:New Year's Day\nEXDATE:20111215T093000\nEXDATE:20111216T093000\nTRANSP:TRANSPARENT\nEND:VEVENT";
    let eventObjs = ical2json.convert(eventString);

    test.deepEqual(eventObjs.VEVENT[0].EXDATE, [ "20111215T093000", "20111216T093000" ]);
    test.done();
  }
};

exports["multiple parents"] = {
  "make sure the just parent object is popping from the stack": function (test) {
    let eventString = "BEGIN:VCALENDAR\rVERSION:2.0\rBEGIN:VTIMEZONE\rTZID:Asia/Shanghai\rBEGIN:STANDARD\rTZOFFSETFROM:+0800\rTZOFFSETTO:+0800\rTZNAME:CST\rDTSTART:19700101T000000\rEND:STANDARD\rEND:VTIMEZONE\rBEGIN:VEVENT\rDTSTART;TZID=Asia/Shanghai:20170322T100000\rDTEND;TZID=Asia/Shanghai:20170322T110000\rLOCATION:Unknown\rSUMMARY:Testing event\rDTSTAMP:20170321T163132Z\rCREATED:20170321T082755Z\rLAST-MODIFIED:20170321T092344Z\rEND:VEVENT\rEND:VCALENDAR\r";
    let eventObjs = ical2json.convert(eventString);

    test.ok(eventObjs.VCALENDAR[0].VEVENT);
    test.equal(eventObjs.VCALENDAR[0].VEVENT.length, 1);

    test.equal(eventString.replace(/(\n|\r)\s?/g, ''),
      ical2json.revert(eventObjs).replace(/(\n|\r)\s?/g, ''));

    test.done();
  }
}

exports["run"] = {
  setUp: function (done) {
    let eventString = "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20130101\nDTEND;VALUE=DATE:20130102\nDTSTAMP:20111213T124028Z\nUID:9d6fa48343f70300fe3109efe@calendarlabs.com\nCREATED:20111213T123901Z\nDESCRIPTION:Visit http://calendarlabs.com/holidays/us/new-years-day.php to kn\n ow more about New Year's Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.\nLAST-MODIFIED:20111213T123901Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:New Year's Day\nTRANSP:TRANSPARENT\nEND:VEVENT";
    let eventObjs = ical2json.convert(eventString);

    fs.writeFileSync("test.ics", eventString);
    fs.writeFileSync("wrongExt.data", eventString);
    fs.writeFileSync("test-1.json", JSON.stringify(eventObjs, null, "  "));
    done();
  },

  "read .ics and write .json": function (test) {
    ical2json.run({
      args: ["doesNotExist.ics", "wrongExt.data", "test.ics"]
    })
    .then(() => {
      test.ok(!fs.existsSync("doesNotExist.json"));
      test.ok(!fs.existsSync("wrongExt.json"));
      test.ok(fs.existsSync("test.json"));
      test.done();
    });
  },

  "read .json and write .ics": function (test) {
    ical2json.run({
      revert: true,
      args: ["test-1.json"]
    })
    .then(() => {
      test.ok(fs.existsSync("test-1.ics"));
      test.done();
    });
  }
}
