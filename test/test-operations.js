'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var fmt = require('util').format;
var operations = require('../lib/operations');
var tap = require('tap');

tap.test('operations', function(t) {

  var pkgs = [
    'foo@1.2.3',
    'bar@2.3.4',
    'baz@3.4.5',
  ];
  var tag = 'snazzy';
  return Promise.resolve().then(function() {
    t.test('view', function(t) {
      return operations.view(pkgs, tag, {
        handler: fakeExecHandler,
      }).then(function(results) {
        t.ok(results, 'received command array');
        t.equal(results.length, pkgs.length,
          'correct number of commands received');
          _.each(results, function(cmd) {
            var cmdArray = cmd.split(' ');
            t.comment('command: "' + cmd + '"');
            var expected = [
              'npm',
              'view',
              'dist-tags',
            ];
            checkCommand(t, cmdArray, expected);
          });
          t.end();
        });

    });
  }).then(function() {
    t.test('tag', function(t) {
      return operations.tag(pkgs, tag, {
        handler: fakeExecHandler,
      }).then(function(results) {
        t.ok(results, 'received command array');
        t.equal(results.length, pkgs.length,
          'correct number of commands received');
          _.each(results, function(cmd) {
            var cmdArray = cmd.split(' ');
            t.comment('command: "' + cmd + '"');
            var expected = [
              'npm',
              'dist-tag',
              'add',
              tag,
            ];
            checkCommand(t, cmdArray, expected);
          });
          t.end();
        });
      });
    }).then(function() {
      t.test('rm', function(t) {
        return operations.tag(pkgs, tag, {
          handler: fakeExecHandler,
        }).then(function(results) {
          t.ok(results, 'received command array');
          t.equal(results.length, pkgs.length,
            'correct number of commands received');
          _.each(results, function(cmd) {
            var cmdArray = cmd.split(' ');
            t.comment('command: "' + cmd + '"');
            var expected = [
              'npm',
              'dist-tag',
              'add',
              tag,
            ];
            checkCommand(t, cmdArray, expected);
          });
          t.end();
        });
      });
    });
});

function checkCommand(t, cmdArray, expected) {
  _.each(expected, function(item) {
    t.ok(_.includes(cmdArray, item), fmt('%s was found', item));
  });
}

function fakeExecHandler(command) {
  return Promise.resolve(command);
};
