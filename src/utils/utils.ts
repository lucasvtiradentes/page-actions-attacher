import { CONFIGS } from '../configs';
import BrowserUtils from '../classes/BrowserUtils';
import DataUtils from '../classes/DataUtils';

function getClassMethods<T>(instance: T) {
  const prototype = Object.getPrototypeOf(instance);
  const methodNames = Object.getOwnPropertyNames(prototype);

  const mappedValues = methodNames
    .map((methodName) => {
      const method = Reflect.get(prototype, methodName) as (...args: any[]) => any;

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
    .filter((item) => item.name !== 'constructor');

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
  console.log(`# HOW TO USE IT =================================================\n\n`);
  console.log(`1 - install the temper monkey extension [${CONFIGS.libInfo.temperMonkeyLink}]\n`);
  console.log('2 - click on "temper moneky icon" and after on "Create a new script..."\n');
  console.log(`3 - paste the initial form filler script [${CONFIGS.libInfo.initialScript}]\n`);
  console.log(`4 - adjust it according to your needs\n`);
  console.log(`5 - for more detailed usage, go to the project github repository! [${CONFIGS.libInfo.link}\n\n`);

  console.log(`# METHODS =======================================================\n`);
  console.log('\nOther methods\n');
  console.table({ 'formFiller.atach': { parameters: 'optionsArr' }, 'formFiller.help': { parameters: '' } });
  console.log('\nformFiller.dataUtils\n');
  console.table(getClassDetailedMethods(new DataUtils()));
  console.log('\nformFiller.browserUtils\n');
  console.table(getClassDetailedMethods(new BrowserUtils()));

  console.log(`\n# LIB INFO ======================================================\n\n`);
  console.log(`name      : ${CONFIGS.libInfo.name}`);
  console.log(`version   : ${CONFIGS.libInfo.version}`);
  console.log(`build_time: ${CONFIGS.libInfo.buildTime}`);
};
