import { default as BrowserUtils } from './classes/browser-utils';
import { default as DataUtils } from './classes/data-utils';
import { default as AttacherUtils, TFloatingOptions } from './classes/atacher-utils';
import { CONFIGS, CONSTS } from './configs';
import { TConfigs } from './types/types';
import { help as helpFn } from './utils/utils';

export default class PageActionsAttacher {
  private configs: TConfigs;
  private attacherUtils: AttacherUtils;
  private VERSION = CONSTS.libInfo.version;
  private BUILD_DATETIME = CONSTS.libInfo.buildTime;

  constructor(configs?: TConfigs) {
    const finalConfigs: TConfigs = {
      ...CONFIGS,
      ...(configs ? configs : {}),
      colorScheme: {
        ...CONFIGS.colorScheme,
        ...(configs?.colorScheme ?? {})
      },
      floatingButton: {
        ...CONFIGS.floatingButton,
        ...(configs?.floatingButton ?? {})
      }
    };

    this.configs = finalConfigs;
    this.attacherUtils = new AttacherUtils(finalConfigs);
  }

  help() {
    helpFn();
  }

  logger(message: string, type?: 'info' | 'error') {
    const finalType = type ?? 'info';
    if (!this.configs.debug) {
      return;
    }

    if (finalType === 'info') console.log(message);
    if (finalType === 'error') console.error(message);
  }

  attach(floatingOptions: TFloatingOptions) {
    return this.attacherUtils.attach(floatingOptions);
  }

  updateOptions(floatingOptions: TFloatingOptions) {
    return this.attacherUtils.updateOptions(floatingOptions);
  }

  detach() {
    return this.attacherUtils.detach();
  }

  dataUtils() {
    return new DataUtils();
  }

  browserUtils() {
    return new BrowserUtils(this.configs);
  }
}
