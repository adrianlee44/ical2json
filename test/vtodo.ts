// VTODO component tests
// https://datatracker.ietf.org/doc/html/rfc5545#section-3.6.2

import {convert, revert} from '../src/ical2json';
import test from 'ava';

// Minimal required properties: DTSTAMP and UID
test('simple to-do', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VTODO',
    'DTSTAMP:20130101T000000Z',
    'UID:simple-todo@example.com',
    'SUMMARY:Buy groceries',
    'STATUS:NEEDS-ACTION',
    'END:VTODO',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// DUE specifies the date the to-do is expected to be completed
test('to-do with DUE date', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VTODO',
    'DTSTAMP:19980130T134500Z',
    'UID:due-todo@example.com',
    'SUMMARY:Submit Income Taxes',
    'DUE:19980415T000000',
    'STATUS:NEEDS-ACTION',
    'END:VTODO',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// DUE with TZID parameter
test('to-do with DUE date and timezone', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VTODO',
    'DTSTAMP:20240101T000000Z',
    'UID:due-tz-todo@example.com',
    'SUMMARY:File quarterly report',
    'DUE;TZID=America/New_York:20240315T170000',
    'STATUS:NEEDS-ACTION',
    'END:VTODO',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// DURATION instead of DUE (RFC 5545 §3.6.2: either DUE or DURATION, not both)
test('to-do with DURATION', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VTODO',
    'DTSTAMP:20130101T000000Z',
    'UID:duration-todo@example.com',
    'SUMMARY:Team standup prep',
    'DTSTART:20130101T090000Z',
    'DURATION:PT15M',
    'STATUS:NEEDS-ACTION',
    'END:VTODO',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// ATTACH with FMTTYPE parameter and folded URI
test('to-do with ATTACH', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VTODO',
    'DTSTAMP:19980130T134500Z',
    'UID:attach-todo@example.com',
    'SUMMARY:Review design document',
    'ATTACH;FMTTYPE=application/pdf:http://example.com/docs/design-',
    ' spec.pdf',
    'STATUS:NEEDS-ACTION',
    'END:VTODO',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// Multiple ATTACH properties on the same to-do
test('to-do with multiple ATTACHes', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VTODO',
    'DTSTAMP:20130101T000000Z',
    'UID:multi-attach-todo@example.com',
    'SUMMARY:Review meeting materials',
    'ATTACH;FMTTYPE=application/pdf:http://example.com/docs/agenda.pdf',
    'ATTACH;FMTTYPE=application/vnd.ms-excel:http://example.com/docs/b',
    ' udget.xls',
    'STATUS:NEEDS-ACTION',
    'END:VTODO',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// VALARM nested inside VTODO
test('to-do with VALARM', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VTODO',
    'DTSTAMP:19980130T134500Z',
    'UID:alarm-todo@example.com',
    'SUMMARY:Submit Income Taxes',
    'DUE:19980415T000000',
    'STATUS:NEEDS-ACTION',
    'BEGIN:VALARM',
    'ACTION:AUDIO',
    'TRIGGER:19980403T120000Z',
    'REPEAT:4',
    'DURATION:PT1H',
    'END:VALARM',
    'END:VTODO',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// COMPLETED and PERCENT-COMPLETE for a finished to-do
test('to-do marked completed', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VTODO',
    'DTSTAMP:20130101T000000Z',
    'UID:completed-todo@example.com',
    'SUMMARY:Write unit tests',
    'STATUS:COMPLETED',
    'COMPLETED:20130115T120000Z',
    'PERCENT-COMPLETE:100',
    'END:VTODO',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// Multiple VTODO components in a single VCALENDAR
test('multiple to-dos', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VTODO',
    'DTSTAMP:20130101T000000Z',
    'UID:todo-1@example.com',
    'SUMMARY:Buy groceries',
    'DUE:20130110T180000Z',
    'STATUS:NEEDS-ACTION',
    'END:VTODO',
    'BEGIN:VTODO',
    'DTSTAMP:20130101T000000Z',
    'UID:todo-2@example.com',
    'SUMMARY:Write unit tests',
    'DUE:20130115T120000Z',
    'STATUS:IN-PROCESS',
    'PERCENT-COMPLETE:50',
    'END:VTODO',
    'BEGIN:VTODO',
    'DTSTAMP:20130101T000000Z',
    'UID:todo-3@example.com',
    'SUMMARY:Deploy to production',
    'STATUS:COMPLETED',
    'COMPLETED:20130120T090000Z',
    'PERCENT-COMPLETE:100',
    'END:VTODO',
    'END:VCALENDAR',
  ].join('\n');

  t.snapshot(convert(ical));
});

// Round-trip: convert → revert → convert should produce identical output
test('to-do round-trip', (t) => {
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VTODO',
    'DTSTAMP:19980130T134500Z',
    'UID:roundtrip-todo@example.com',
    'SUMMARY:Submit Income Taxes',
    'DUE;TZID=America/New_York:19980415T000000',
    'STATUS:NEEDS-ACTION',
    'ATTACH;FMTTYPE=application/pdf:http://example.com/docs/form.pdf',
    'END:VTODO',
    'END:VCALENDAR',
  ].join('\n');

  t.deepEqual(convert(revert(convert(ical))), convert(ical));
});
