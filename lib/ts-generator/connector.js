'use strict';

const utils = require('egg-ts-helper/dist/utils');
const d = require('debug');
const path = require('path');

const debug = d('egg-ts-helper#generators_extend');
module.exports = (config, baseConfig) => {
  const fileList = utils.loadFiles(config.dir, config.pattern);
  const dist = path.resolve(baseConfig.typings, 'app/extend/context.d.ts');

  debug('file list : %o', fileList);
  if (!fileList.length) {
    return { dist };
  }

  // using to compose import code
  let importStr = '';
  // using to create interface mapping
  const interfaceMap = {};

  fileList.forEach(f => {
    f = f.substring(0, f.lastIndexOf('.'));
    const obj = utils.getModuleObjByPath(f);
    const tsPath = path
      .relative(config.dtsDir, path.join(config.dir, f))
      .replace(/\/|\\/g, '/');
    debug('import %s from %s', obj.moduleName, tsPath);
    importStr += `import ${obj.moduleName} from '${tsPath}';\n`;

    // create mapping
    const collector = interfaceMap;
    if (obj.props.length) {
      const name = utils.camelProp(
        obj.props.shift(),
        config.caseStyle || baseConfig.caseStyle
      );
      collector[name] = obj.moduleName;
    }
  });

  // composing all the interface
  const composeInterface = (obj, indent = '') => {
    let str = '';

    Object.keys(obj).forEach(key => {
      const val = obj[key];
      if (typeof val === 'string') {
        str += `${indent + key}: ${
          config.interfaceHandle ? config.interfaceHandle(val) : val
        };\n`;
      } else {
        const newVal = composeInterface(val, indent + '  ');
        if (newVal) {
          str += `${indent + key}: {\n${newVal + indent}};\n`;
        }
      }
    });

    return str;
  };

  return {
    dist,
    content:
      `${importStr}\n` +
      `declare module '${config.framework || baseConfig.framework}' {\n` +
      `  interface ${config.interface} {\n` +
      '     connector: {\n' +
      composeInterface(interfaceMap, '        ') +
      '     }\n' +
      '  }\n' +
      '}\n',
  };
};
