#!/usr/bin/env node

'use strict';

/*
 * Open a config.json full of <pkg>@<ver>
 * Run the given op across all of them
 */

// Imports

var _ = require('lodash');
var debug = require('debug')('dist-tagger');
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
  'add',
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
  case 'add':
    var tag = process.argv[4];
    if (!tag) {
      return printUsage();
    }
    return operations.add(conf.packages, tag);
  case 'rm':
    var tag = process.argv[4];
    if (!tag) {
      return printUsage();
    }
    return operations.rm(conf.packages, tag);
  case 'view':
  default:
    return operations.view(conf.packages, tag);
}

function printUsage() {
  console.log('Usage: dist-tagger <op> <configFile> [tag]');
  console.log('Requires a JSON file that gives the package list in');
  console.log('this format:');
  console.log('{');
  console.log('  packages: [');
  console.log('    sample@1.2.3,');
  console.log('    otherSample@2.4.6,');
  console.log('  ]');
  console.log('}');
  console.log('Operations:');
  console.log('add    add a dist-tag to all of the packages in <configFile>');
  console.log('rm     rm a dist-tag from all of the packages in <configFile>');
  console.log('view   view all of the dist-tags for packages in <configFile>');
}
