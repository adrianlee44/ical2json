#!/usr/bin/env node

/**
 * ical2json
 * https://github.com/adrianlee44/ical2json
 *
 * Copyright (c) 2017 Adrian Lee
 * Licensed under the MIT license.
 */

import commander from 'commander';
import fs from 'node:fs/promises';
import cli from '../build/cli.js';

const pkg = JSON.parse(await fs.readFile('package.json'));

commander
  .version(pkg.version)
  .option('-r, --revert', 'Revert JSON to ical')
  .usage('[options] [FILES...]')
  .parse(process.argv);

if (commander.args.length) {
  cli(commander);
} else {
  // eslint-disable-next-line no-console
  console.log(commander.helpInformation());
}
