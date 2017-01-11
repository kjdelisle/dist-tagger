'use strict';

var Promise = require('bluebird');
var debug = require('debug')('dist-tagger');
var execSync = require('child_process').execSync;

exports.view = function(pkgs, tag, options) {
  var opts = options || {};
  var handler = opts.handler || execHandler;
  return Promise.map(pkgs, function(pkg) {
    var command = [
      'npm view',
      pkg,
      'dist-tags',
    ].join(' ');
    console.log('%s:', pkg);
    return handler(command);
  });
};

exports.tag = function(pkgs, tag, options) {
  var opts = options || {};
  var handler = opts.handler || execHandler;
  return Promise.map(pkgs, function(pkg) {
    var amp = pkg.indexOf('@');
    if (amp < 0) {
      console.log('Not tagging "%s" - no version specified!', pkg);
      return Promise.resolve();
    }
    var command = [
      'npm dist-tag add',
      pkg,
      tag,
    ].join(' ');
    return handler(command);
  });
};

exports.rm = function(pkgs, tag, options) {
  var opts = options || {};
  var handler = opts.handler || execHandler;
  return Promise.map(pkgs, function(pkg) {
    var amp = pkg.indexOf('@');
    // Get substring without version
    var pkgWithoutVer = (amp < 0) ? pkg : pkg.slice(0, amp);
    var command = [
      'npm dist-tag rm',
      pkgWithoutVer,
      tag,
    ].join(' ');
    return handler(command);
  });
};

function execHandler(command) {
  return Promise.try(function() {
    if (process.env.DRY_RUN) {
      console.log('Simulated command run: %s', command);
      return;
    } else {
      debug('Running command: "%s"', command);
      execSync(command, {
        encoding: 'utf-8',
        stdio: 'inherit',
      });
    }
    return debug('Command complete.');
  }).catch(function(err) {
    console.log('Command failed: %s', err);
  });
}
