'use strict';

var Promise = require('bluebird');
var debug = require('debug')('dist-tagger');
var execSync = require('child_process').execSync;

exports.view = function(pkgs, tag) {
  return Promise.each(pkgs, function(pkg) {
    var command = [
      'npm view',
      pkg,
      'dist-tags',
    ].join(' ');
    console.log('%s:', pkg);
    return execHandler(command);
  });
};

exports.add = function(pkgs, tag) {
  return addRm('add', pkgs, tag);
};

exports.rm = function(pkgs, tag) {
  return addRm('rm', pkgs, tag);
};

function addRm(op, pkgs, tag) {
  return Promise.each(pkgs, function(pkg) {
    var command = [
      'npm dist-tag',
      op,
      pkg,
      tag,
    ].join(' ');
    if (process.env.DRY_RUN) {
      return debug('Command complete (sim mode).');
    } else {
      return execHandler(command);
    }
  });
};

function execHandler(command) {
  return Promise.try(function() {
    debug('Running command: "%s"', command);
    execSync(command, {
      encoding: 'utf-8',
      stdio: 'inherit',
    });
    debug('Command complete.');
  }).catch(function(err) {
    console.log('Command failed: %s', err);
  });
}
