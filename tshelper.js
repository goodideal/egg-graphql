'use strict';

const generator = require('./lib/ts-generator/connector');

module.exports = {
  watchDirs: {
    connector: {
      path: 'app/graphql',
      interface: 'Context',
      pattern: '**/connector*.(ts|js)',
      generator,
      caseStyle: 'lower',
      trigger: ['add', 'change', 'unlink'],
      enabled: true,
    },
  },
};
