# Snapshot report for `test/ical2json.js`

The actual snapshot is saved in `ical2json.js.snap`.

Generated by [AVA](https://ava.li).

## convert VEVENT

> Snapshot 1

    {
      VEVENT: [
        {
          CREATED: '20111213T123901Z',
          DESCRIPTION: 'Visit http://calendarlabs.com/holidays/us/new-years-day.php to know more about New Year\'s Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.',
          'DTEND;VALUE=DATE': '20130102',
          DTSTAMP: '20111213T124028Z',
          'DTSTART;VALUE=DATE': '20130101',
          'LAST-MODIFIED': '20111213T123901Z',
          LOCATION: '',
          SEQUENCE: '0',
          STATUS: 'CONFIRMED',
          SUMMARY: 'New Year\'s Day',
          TRANSP: 'TRANSPARENT',
          UID: '9d6fa48343f70300fe3109efe@calendarlabs.com',
        },
      ],
    }

## converting VEVENT

> Snapshot 1

    {
      VEVENT: [
        {
          CREATED: '20111213T123901Z',
          DESCRIPTION: 'Visit http://calendarlabs.com/holidays/us/new-years-day.php to know more about New Year\'s Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.',
          'DTEND;VALUE=DATE': '20130102',
          DTSTAMP: '20111213T124028Z',
          'DTSTART;VALUE=DATE': '20130101',
          'LAST-MODIFIED': '20111213T123901Z',
          LOCATION: '',
          SEQUENCE: '0',
          STATUS: 'CONFIRMED',
          SUMMARY: 'New Year\'s Day',
          TRANSP: 'TRANSPARENT',
          UID: '9d6fa48343f70300fe3109efe@calendarlabs.com',
        },
      ],
    }

## converting CR and making sure CR is handled correctly

> Snapshot 1

    {
      VEVENT: [
        {
          'DTSTART;VALUE=DATE': '20130101',
        },
      ],
    }

## converting multi-child w/o BEGIN-END

> Snapshot 1

    {
      VEVENT: [
        {
          CREATED: '20111213T123901Z',
          DESCRIPTION: 'Visit http://calendarlabs.com/holidays/us/new-years-day.php to know more about New Year\'s Day. Like us on Facebook: http://fb.com/calendarlabs to get updates.',
          'DTEND;VALUE=DATE': '20130102',
          DTSTAMP: '20111213T124028Z',
          'DTSTART;VALUE=DATE': '20130101',
          EXDATE: [
            '20111215T093000',
            '20111216T093000',
          ],
          'LAST-MODIFIED': '20111213T123901Z',
          LOCATION: '',
          SEQUENCE: '0',
          STATUS: 'CONFIRMED',
          SUMMARY: 'New Year\'s Day',
          TRANSP: 'TRANSPARENT',
          UID: '9d6fa48343f70300fe3109efe@calendarlabs.com',
        },
      ],
    }

## converting multiple child nodes is handled correctly

> Snapshot 1

    {
      VEVENT: [
        {
          INDEX: '1',
          VALARM: [
            {
              TRIGGER: '-P1DT0H0M0S',
            },
            {
              TRIGGER: '-P0DT1H0M0S',
            },
          ],
        },
        {
          INDEX: '2',
          VALARM: [
            {
              TRIGGER: '-P1DT0H0M0S',
            },
            {
              TRIGGER: '-P0DT1H0M0S',
            },
          ],
        },
      ],
    }

## converting old newline and making sure CR is handled correctly

> Snapshot 1

    {
      VEVENT: [
        {
          'DTSTART;VALUE=DATE': '20130101',
        },
      ],
    }

## the parent object is popping from the stack

> Snapshot 1

    {
      VCALENDAR: [
        {
          VERSION: '2.0',
          VEVENT: [
            {
              CREATED: '20170321T082755Z',
              'DTEND;TZID=Asia/Shanghai': '20170322T110000',
              DTSTAMP: '20170321T163132Z',
              'DTSTART;TZID=Asia/Shanghai': '20170322T100000',
              'LAST-MODIFIED': '20170321T092344Z',
              LOCATION: 'Unknown',
              SUMMARY: 'Testing event',
            },
          ],
          VTIMEZONE: [
            {
              STANDARD: [
                {
                  DTSTART: '19700101T000000',
                  TZNAME: 'CST',
                  TZOFFSETFROM: '+0800',
                  TZOFFSETTO: '+0800',
                },
              ],
              TZID: 'Asia/Shanghai',
            },
          ],
        },
      ],
    }