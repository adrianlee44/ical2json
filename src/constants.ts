// Make sure lines are splited correctly
// http://stackoverflow.com/questions/1155678/javascript-string-newline-character
export const NEW_LINE = /\r\n|\n|\r/;
export const COLON = ':';
// const COMMA = ",";
// const DQUOTE = "\"";
export const SEMICOLON = ';';
export const SPACE = ' ';

// RFC 5545 §3.1 recommends folding content lines at 75 octets.
// https://datatracker.ietf.org/doc/html/rfc5545#section-3.1
export const CONTENT_LINE_LENGTH_FOLDED = 75;
