import BrowserUtils from '../classes/BrowserUtils';
import DataUtils from '../classes/DataUtils';
import { CONSTS } from '../configs';

function getClassMethods<T>(instance: T) {
  const prototype = Object.getPrototypeOf(instance);
  const methodNames = Object.getOwnPropertyNames(prototype);
  const ignoredMethods = ['constructor', 'logger', 'click', 'typeOnInput', 'addTooltipToElement'];

  const mappedValues = methodNames
    .map((methodName) => {
      const method = Reflect.get(prototype, methodName) as (...args: unknown[]) => unknown;

      const parameterNames =
        method
          .toString()
          .match(/\(([^)]*)\)/)?.[1]
          .split(',')
          .map((param) => param.trim())
          .filter(Boolean) || [];

      return {
        name: methodName,
        parameters: parameterNames.join(', ')
      };
    })
    .filter((item) => ignoredMethods.includes(item.name) === false);

  return mappedValues;
}

function convertObjectArrayToObject<T extends Record<string, unknown>, K extends keyof T>(arr: T[], key: K): Omit<T, K> {
  return arr.reduce((result, item) => {
    const { [key]: _omittedKey, ...rest } = item; // eslint-disable-line
    const keyValue = item[key];
    (result as any)[keyValue] = rest;
    return result;
  }, {} as Omit<T, K>);
}

function getClassDetailedMethods<T>(instance: T) {
  const detailedMethods = getClassMethods(instance);
  const parsedClassMethods = convertObjectArrayToObject(detailedMethods, 'name');
  return parsedClassMethods;
}

export const help = () => {
  console.log(`# METHODS =======================================================\n`);
  console.log('\nOther methods\n');
  console.table({ 'formFiller.atach': { parameters: 'optionsArr' }, 'formFiller.help': { parameters: '' } });
  console.log('\nformFiller.dataUtils\n');
  console.table(getClassDetailedMethods(new DataUtils()));
  console.log('\nformFiller.browserUtils\n');
  console.table(getClassDetailedMethods(new BrowserUtils()));

  console.log(`\n# PACKAGE INFO ==================================================\n\n`);
  console.log(`name        : ${CONSTS.libInfo.name}`);
  console.log(`version     : ${CONSTS.libInfo.version}`);
  console.log(`build_time  : ${CONSTS.libInfo.buildTime}`);
  console.log(`package link: ${CONSTS.libInfo.link}`);

  console.log('\n# CURRENT PAGE INPUT NAMES ======================================');
  Array.from(document.querySelectorAll('input')).forEach((el) => console.log(el.getAttribute('name')));
};
