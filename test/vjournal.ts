// VJOURNAL component tests
// https://datatracker.ietf.org/doc/html/rfc5545#section-3.6.3

import {convert, revert} from '../src/ical2json';
import test from 'ava';

// Minimal required properties: DTSTAMP and UID
test('simple journal', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VJOURNAL',
    'DTSTAMP:20130101T000000Z',
    'UID:simple-journal@example.com',
    'SUMMARY:Team retrospective notes',
    'END:VJOURNAL',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// STATUS can be DRAFT, FINAL, or CANCELLED for journals
test('journal with DRAFT status', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VJOURNAL',
    'DTSTAMP:20130101T000000Z',
    'UID:draft-journal@example.com',
    'SUMMARY:Q1 Planning Notes',
    'STATUS:DRAFT',
    'DESCRIPTION:Initial draft of Q1 planning meeting minutes.',
    'END:VJOURNAL',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

test('journal with FINAL status', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VJOURNAL',
    'DTSTAMP:20130301T000000Z',
    'UID:final-journal@example.com',
    'SUMMARY:Q1 Planning Notes',
    'STATUS:FINAL',
    'DESCRIPTION:Approved minutes of Q1 planning meeting.',
    'END:VJOURNAL',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

test('journal with CANCELLED status', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VJOURNAL',
    'DTSTAMP:20130101T000000Z',
    'UID:cancelled-journal@example.com',
    'SUMMARY:Cancelled meeting notes',
    'STATUS:CANCELLED',
    'END:VJOURNAL',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// ATTACH with FMTTYPE parameter and folded URI
test('journal with ATTACH', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VJOURNAL',
    'DTSTAMP:20130101T000000Z',
    'UID:attach-journal@example.com',
    'SUMMARY:Project kickoff notes',
    'STATUS:FINAL',
    'ATTACH;FMTTYPE=application/pdf:http://example.com/docs/kickoff-',
    ' notes.pdf',
    'END:VJOURNAL',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// Multiple ATTACH properties on the same journal
test('journal with multiple ATTACHes', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VJOURNAL',
    'DTSTAMP:20130101T000000Z',
    'UID:multi-attach-journal@example.com',
    'SUMMARY:Sprint review notes',
    'STATUS:FINAL',
    'ATTACH;FMTTYPE=application/pdf:http://example.com/docs/minutes.pdf',
    'ATTACH;FMTTYPE=application/vnd.ms-powerpoint:http://example.com/',
    ' docs/slides.ppt',
    'ATTACH;FMTTYPE=text/plain:http://example.com/docs/action-items.txt',
    'END:VJOURNAL',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// Multiple VJOURNAL components in a single VCALENDAR
test('multiple journals', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VJOURNAL',
    'DTSTAMP:20130101T000000Z',
    'UID:journal-1@example.com',
    'SUMMARY:January retrospective',
    'STATUS:FINAL',
    'DTSTART:20130131T000000Z',
    'END:VJOURNAL',
    'BEGIN:VJOURNAL',
    'DTSTAMP:20130201T000000Z',
    'UID:journal-2@example.com',
    'SUMMARY:February retrospective',
    'STATUS:DRAFT',
    'DTSTART:20130228T000000Z',
    'END:VJOURNAL',
    'BEGIN:VJOURNAL',
    'DTSTAMP:20130301T000000Z',
    'UID:journal-3@example.com',
    'SUMMARY:March retrospective',
    'STATUS:CANCELLED',
    'DTSTART:20130331T000000Z',
    'END:VJOURNAL',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// Round-trip: convert → revert → convert should produce identical output
test('journal round-trip', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VJOURNAL',
    'DTSTAMP:19970324T120000Z',
    'UID:roundtrip-journal@example.com',
    'SUMMARY:Project xyz Review Meeting Minutes',
    'STATUS:FINAL',
    'CATEGORIES:Project Report,XYZ,Weekly Meeting',
    'ATTACH;FMTTYPE=application/pdf:http://example.com/docs/minutes.pdf',
    'END:VJOURNAL',
    'END:VCALENDAR',
  ].join('\n');

  t.deepEqual(convert(revert(convert(ical))), convert(ical));
});
