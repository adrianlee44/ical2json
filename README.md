ical2json
===
A simple node package to convert iCal data (.ics file) to JSON format

[![Build Status](https://img.shields.io/travis/adrianlee44/ical2json/master.svg?style=flat-square)](https://travis-ci.org/adrianlee44/ical2json)
[![Coveralls branch](https://img.shields.io/coveralls/adrianlee44/ical2json/master.svg?style=flat-square)](https://coveralls.io/github/adrianlee44/ical2json?branch=master)
[![npm](https://img.shields.io/npm/v/ical2json.svg?style=flat-square)](https://www.npmjs.com/package/ical2json)

![David](https://img.shields.io/david/adrianlee44/ical2json.svg?style=flat-square)
![David](https://img.shields.io/david/dev/adrianlee44/ical2json.svg?style=flat-square)

## Getting started
Download and install from npm
```
npm install -g ical2json
```

To convert ics file to json
```
ical2json ./US-Holiday.ics
```

The json output will be written to a `.json` file in the same directory
```
./US-Holiday.json
```

File output:
```json
{
  "VCALENDAR": [
    {
      "PRODID": "-//Calendar Labs//Calendar 1.0//EN",
      "VERSION": "2.0",
      "CALSCALE": "GREGORIAN",
      "METHOD": "PUBLISH",
      "X-WR-CALNAME": "Usa Holidays",
      "X-WR-TIMEZONE": "America/New_York",
      "VEVENT": [
        {
          "DTSTART;VALUE=DATE": "20130101",
          "DTEND;VALUE=DATE": "20130102",
          "DTSTAMP": "20111213T124028Z",
          "UID": "9d6fa48343f70300fe3109efe@calendarlabs.com",
          "CREATED": "20111213T123901Z",
          "DESCRIPTION": "Visit http",
          "LAST-MODIFIED": "20111213T123901Z",
          "LOCATION": "",
          "SEQUENCE": "0",
          "STATUS": "CONFIRMED",
          "SUMMARY": "New Year's Day",
          "TRANSP": "TRANSPARENT"
        },
        {
          "DTSTART;VALUE=DATE": "20130121",
          "DTEND;VALUE=DATE": "20130122",
          "DTSTAMP": "20111213T124028Z",
          "UID": "03fd8b92ac65ba1d2883d915c@calendarlabs.com",
          "CREATED": "20111213T123901Z",
          "DESCRIPTION": "Visit http",
          "LAST-MODIFIED": "20111213T123901Z",
          "LOCATION": "",
          "SEQUENCE": "0",
          "STATUS": "CONFIRMED",
          "SUMMARY": "M L King Day",
          "TRANSP": "TRANSPARENT"
        },
        {
          "DTSTART;VALUE=DATE": "20130214",
          "DTEND;VALUE=DATE": "20130215",
          "DTSTAMP": "20111213T124028Z",
          "UID": "4ea01fceaa9f61bbacb7d7ba6@calendarlabs.com",
          "CREATED": "20111213T123901Z",
          "DESCRIPTION": "Visit http",
          "LAST-MODIFIED": "20111213T123901Z",
          "LOCATION": "",
          "SEQUENCE": "0",
          "STATUS": "CONFIRMED",
          "SUMMARY": "Valentine's Day",
          "TRANSP": "TRANSPARENT"
        }
      ]
    }
  ]
}
```

## API
```
  Usage: ical2json [options] [FILES...]

  Options:

    -h, --help     output usage information
    -r, --revert   Revert JSON to ical
    -V, --version  output the version number
```

Programmatic API
```
var ical2json = require("ical2json");

// From ical to JSON
var output = ical2json.convert(icalData);

// From JSON to ical
var icalOutput = ical2json.revert(icalJson);
```
