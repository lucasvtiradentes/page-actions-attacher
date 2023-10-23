import { default as BrowserUtils } from './classes/BrowserUtils';
import { default as DataUtils } from './classes/DataUtils';
import { default as FormFiller, TFloatingOptions } from './classes/FormFiller';
import { CONFIGS, CONSTS } from './configs';
import { TConfigs } from './types/types';
import { help as helpFn } from './utils/utils';

export default class FormFillerAssistant {
  private configs: TConfigs;
  private formFiller: FormFiller;
  private VERSION = CONSTS.libInfo.version;
  private BUILD_DATETIME = CONSTS.libInfo.buildTime;

  constructor(configs?: TConfigs) {
    const finalConfigs: TConfigs = {
      ...CONFIGS,
      ...(configs ? configs : {}),
      colorScheme: {
        ...CONFIGS.colorScheme,
        ...(configs?.colorScheme ? configs.colorScheme : {})
      },
      floatingButton: {
        ...CONFIGS.floatingButton,
        ...(configs?.floatingButton ? configs.floatingButton : {})
      }
    };

    this.configs = finalConfigs;
    this.formFiller = new FormFiller(finalConfigs);
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
    return this.formFiller.attach(floatingOptions);
  }

  updateOptions(floatingOptions: TFloatingOptions) {
    return this.formFiller.updateOptions(floatingOptions);
  }

  detach() {
    return this.formFiller.detach();
  }

  dataUtils() {
    return new DataUtils();
  }

  browserUtils() {
    return new BrowserUtils(this.configs);
  }
}
