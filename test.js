var ical2json = require("./index"),
    eventString = "BEGIN:VEVENT\nDTSTART;VALUE=DATE:20130101\nDTEND;VALUE=DATE:20130102\nDTSTAMP:20111213T124028Z\nUID:9d6fa48343f70300fe3109efe@calendarlabs.com\nCREATED:20111213T123901Z\nDESCRIPTION:Visit http://calendarlabs.com/holidays/us/new-years-day.php to kn\n ow more about New Year's Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.\nLAST-MODIFIED:20111213T123901Z\nLOCATION:\nSEQUENCE:0\nSTATUS:CONFIRMED\nSUMMARY:New Year's Day\nTRANSP:TRANSPARENT\nEND:VEVENT";

exports.convert = {
  setUp: function (callback) {
    this.eventObjs = ical2json.convert(eventString);
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
    var desc = "Visit http://calendarlabs.com/holidays/us/new-years-day.php to know more about New Year\'s Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.";
    test.equal(this.eventObjs.VEVENT[0].DESCRIPTION, desc);
    test.done();
  },

  "summary": function (test) {
    test.equal(this.eventObjs.VEVENT[0].SUMMARY, "New Year\'s Day");
    test.done();
  }
};

exports["convert CR"] = {
  "make sure CR is handled correctly": function (test) {
    eventString = "BEGIN:VEVENT\rDTSTART;VALUE=DATE:20130101\rEND:VEVENT";
    eventObjs = ical2json.convert(eventString);

    test.notEqual(eventObjs.VEVENT, undefined);

    test.done();
  }
};

exports["convert old newline"] = {
  "make sure CR is handled correctly": function (test) {
    eventString = "BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20130101\r\nEND:VEVENT";
    eventObjs = ical2json.convert(eventString);

    test.notEqual(eventObjs.VEVENT, undefined);

    test.done();
  }
};

exports["convert multi-child"] = {
  "make sure multiple child nodes are handled correctly": function (test) {
    eventString = "BEGIN:VEVENT\nINDEX:1\nBEGIN:VALARM\nTRIGGER:-P1DT0H0M0S\nEND:VALARM\nBEGIN:VALARM\nTRIGGER:-P0DT1H0M0S\nEND:VALARM\nEND:VEVENT\nBEGIN:VEVENT\nINDEX:2\nBEGIN:VALARM\nTRIGGER:-P1DT0H0M0S\nEND:VALARM\nBEGIN:VALARM\nTRIGGER:-P0DT1H0M0S\nEND:VALARM\nEND:VEVENT"
    eventObjs = ical2json.convert(eventString);

    test.equal(eventObjs.VEVENT.length, 2);
    test.equal(eventObjs.VEVENT[0].VALARM.length, 2);
    test.equal(eventObjs.VEVENT[1].VALARM.length, 2);

    test.done();
  }
};
