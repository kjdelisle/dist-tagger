#!/usr/bin/env node

'use strict';

/*
 * Open a config.json full of <pkg>@<ver>
 * Run the given op across all of them
 */

// Imports

var _ = require('lodash');
var debug = require('debug')('dist-tagger');
var fs = require('fs');
var operations = require('./lib/operations');
var path = require('path');
/*
 * Commands:
 * Add tag
 * Remove tag
 */

var op = process.argv[2];
if (!op) {
  return printUsage();
}
var configFile = process.argv[3];
if (!configFile) {
  return printUsage();
}


debug('args: %j', process.argv);
debugger;
var validOps = [
  'tag',
  'rm',
  'view',
];
if (!_.includes(validOps, op)) {
  console.log('This operation is invalid! Valid operations: %s',
    validOps.join('\n'));
    return;
}

var conf = require(path.resolve(configFile));
if (!conf) {
  console.log('Invalid config file!');
}

switch (op) {
  case 'tag':
    var tag = process.argv[4] || conf.tag;
    if (!tag) {
      console.log('No tag was specified in the config file or as an argument!');
      return printUsage();
    }
    return operations.tag(conf.packages, tag);
  case 'rm':
    var tag = process.argv[4] || conf.tag;
    if (!tag) {
      console.log('No tag was specified in the config file or as an argument!');
      return printUsage();
    }
    return operations.rm(conf.packages, tag);
  case 'view':
  default:
    return operations.view(conf.packages, tag);
}

function printUsage() {
  var appName = path.basename(process.argv[1]);
  console.log(fs.readFileSync(path.resolve(__dirname, 'lib', 'usage.txt'), 'utf-8')
    .replace(/%APP%/g, appName));
}
