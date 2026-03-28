// RFC 5545 Appendix C — iCalendar Object Examples
// https://datatracker.ietf.org/doc/html/rfc5545#autoid-114

import {convert} from '../src/ical2json.js';
import test from 'ava';

// Three-day conference beginning at 2:30 PM UTC September 18, 1996
test('RFC 5545 example 1: three-day conference', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'PRODID:-//xyz Corp//NONSGML PDA Calendar Version 1.0//EN',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'DTSTAMP:19960704T120000Z',
    'UID:uid1@example.com',
    'ORGANIZER:mailto:jsmith@example.com',
    'DTSTART:19960918T143000Z',
    'DTEND:19960920T220000Z',
    'STATUS:CONFIRMED',
    'CATEGORIES:CONFERENCE',
    'SUMMARY:Networld+Interop Conference',
    'DESCRIPTION:Networld+Interop Conference',
    '  and Exhibit\\nAtlanta World Congress Center\\n',
    ' Atlanta\\, Georgia',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// Group-scheduled meeting 8:30–9:30 AM EST March 12, 1998 with timezone
test('RFC 5545 example 2: group-scheduled meeting with timezone', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'PRODID:-//RDU Software//NONSGML HandCal//EN',
    'VERSION:2.0',
    'BEGIN:VTIMEZONE',
    'TZID:America/New_York',
    'BEGIN:STANDARD',
    'DTSTART:19981025T020000',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0500',
    'TZNAME:EST',
    'END:STANDARD',
    'BEGIN:DAYLIGHT',
    'DTSTART:19990404T020000',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0400',
    'TZNAME:EDT',
    'END:DAYLIGHT',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    'DTSTAMP:19980309T231000Z',
    'UID:guid-1.example.com',
    'ORGANIZER:mailto:mrbig@example.com',
    'ATTENDEE;RSVP=TRUE;ROLE=REQ-PARTICIPANT;CUTYPE=GROUP:',
    ' mailto:employee-A@example.com',
    'DESCRIPTION:Project XYZ Review Meeting',
    'CATEGORIES:MEETING',
    'CLASS:PUBLIC',
    'CREATED:19980309T130000Z',
    'SUMMARY:XYZ Project Review',
    'DTSTART;TZID=America/New_York:19980312T083000',
    'DTEND;TZID=America/New_York:19980312T093000',
    'LOCATION:1CP Conference Room 4350',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// Calendaring interoperability planning meeting (from MIME message body)
test('RFC 5545 example 3: calendaring interoperability meeting', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'METHOD:xyz',
    'VERSION:2.0',
    'PRODID:-//ABC Corporation//NONSGML My Product//EN',
    'BEGIN:VEVENT',
    'DTSTAMP:19970324T120000Z',
    'SEQUENCE:0',
    'UID:uid3@example.com',
    'ORGANIZER:mailto:jdoe@example.com',
    'ATTENDEE;RSVP=TRUE:mailto:jsmith@example.com',
    'DTSTART:19970324T123000Z',
    'DTEND:19970324T210000Z',
    'CATEGORIES:MEETING,PROJECT',
    'CLASS:PUBLIC',
    'SUMMARY:Calendaring Interoperability Planning Meeting',
    'DESCRIPTION:Discuss how we can test c&s interoperability\\n',
    ' using iCalendar and other IETF standards.',
    'LOCATION:LDB Lobby',
    'ATTACH;FMTTYPE=application/postscript:ftp://example.com/pub/',
    ' conf/bkgrnd.ps',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// To-do due April 15, 1998 with audio alarm repeating hourly four times
test('RFC 5545 example 4: to-do with audio alarm', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ABC Corporation//NONSGML My Product//EN',
    'BEGIN:VTODO',
    'DTSTAMP:19980130T134500Z',
    'SEQUENCE:2',
    'UID:uid4@example.com',
    'ORGANIZER:mailto:unclesam@example.com',
    'ATTENDEE;PARTSTAT=ACCEPTED:mailto:jqpublic@example.com',
    'DUE:19980415T000000',
    'STATUS:NEEDS-ACTION',
    'SUMMARY:Submit Income Taxes',
    'BEGIN:VALARM',
    'ACTION:AUDIO',
    'TRIGGER:19980403T120000Z',
    'ATTACH;FMTTYPE=audio/basic:http://example.com/pub/audio-',
    ' files/ssbanner.aud',
    'REPEAT:4',
    'DURATION:PT1H',
    'END:VALARM',
    'END:VTODO',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// Journal entry
test('RFC 5545 example 5: journal entry', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ABC Corporation//NONSGML My Product//EN',
    'BEGIN:VJOURNAL',
    'DTSTAMP:19970324T120000Z',
    'UID:uid5@example.com',
    'ORGANIZER:mailto:jsmith@example.com',
    'STATUS:DRAFT',
    'CLASS:PUBLIC',
    'CATEGORIES:Project Report,XYZ,Weekly Meeting',
    'DESCRIPTION:Project xyz Review Meeting Minutes\\n',
    ' Agenda\\n1. Review of project version 1.0 requirements.\\n2.',
    '  Definition',
    ' of project processes.\\n3. Review of project schedule.\\n',
    ' Participants: John Smith\\, Jane Doe\\, Jim Dandy\\n-It was',
    '  decided that the requirements need to be signed off by',
    '  product marketing.\\n-Project processes were accepted.\\n',
    ' -Project schedule needs to account for scheduled holidays',
    '  and employee vacation time. Check with HR for specific',
    '  dates.\\n-New schedule will be distributed by Friday.\\n-',
    ' Next weeks meeting is cancelled. No meeting until 3/23.',
    'END:VJOURNAL',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// Published busy time information
test('RFC 5545 example 6: freebusy', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RDU Software//NONSGML HandCal//EN',
    'BEGIN:VFREEBUSY',
    'ORGANIZER:mailto:jsmith@example.com',
    'DTSTART:19980313T141711Z',
    'DTEND:19980410T141711Z',
    'FREEBUSY:19980314T233000Z/19980315T003000Z',
    'FREEBUSY:19980316T153000Z/19980316T163000Z',
    'FREEBUSY:19980318T030000Z/19980318T040000Z',
    'URL:http://www.example.com/calendar/busytime/jsmith.ifb',
    'END:VFREEBUSY',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});
