# ical2json

A simple node package to convert iCal data (.ics file) to JSON format

![Tests](https://github.com/adrianlee44/ical2json/workflows/Tests/badge.svg)
[![codecov](https://codecov.io/gh/adrianlee44/ical2json/graph/badge.svg?token=SIFGIFEB7T)](https://codecov.io/gh/adrianlee44/ical2json)

Requires Node.js ≥ 20.

## Getting started

Install globally for CLI use:

```sh
npm install -g ical2json
```

Install locally for programmatic use:

```sh
npm install ical2json
```

To convert an ics file to json:

```sh
$ ical2json ./US-Holiday.ics
```

The json output will be written to a `.json` file in the same directory:

```
./US-Holiday.json
```

To write the output to a separate directory, use the `-o` or `--output-dir` option:

```sh
$ ical2json --output-dir ~/destination/directory ./US-Holiday.ics
```

To revert a JSON file back to ical:

```sh
$ ical2json --revert ./US-Holiday.json
```

To print output to stdout instead of a file:

```sh
$ ical2json --stdout ./US-Holiday.ics
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
          "CREATED": "20111213T123901Z",
          "DESCRIPTION": "Visit http://calendarlabs.com/holidays/us/new-years-day.php to know more about New Year's Day.",
          "DTEND": {
            "VALUE": "DATE",
            "_": "20130102"
          },
          "DTSTAMP": "20111213T124028Z",
          "DTSTART": {
            "VALUE": "DATE",
            "_": "20130101"
          },
          "LAST-MODIFIED": "20111213T123901Z",
          "LOCATION": "",
          "SEQUENCE": "0",
          "STATUS": "CONFIRMED",
          "SUMMARY": "New Year's Day",
          "TRANSP": "TRANSPARENT",
          "UID": "9d6fa48343f70300fe3109efe@calendarlabs.com"
        }
      ]
    }
  ]
}
```

Properties with parameters (e.g. `DTSTART;VALUE=DATE`) are represented as objects where parameters become keys and the value is stored under `_`.

## CLI

```
Usage: ical2json [options] [FILES...]

Options:
  -V, --version            output the version number
  -o, --output-dir <path>  Output directory
  -r, --revert             Revert JSON to ical
  -s, --stdout             Output to stdout
  -h, --help               display help for command
```

## Programmatic API

```js
import { convert, revert } from "ical2json";

// convert(icalString: string): IcalObject — parse ical text into JSON
const output = convert(icalData);

// revert(json: IcalObject): string — serialize JSON back to ical text
const icalOutput = revert(output);
```
