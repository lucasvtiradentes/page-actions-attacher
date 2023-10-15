import { default as BrowserUtils } from './classes/BrowserUtils';
import { default as DataUtils } from './classes/DataUtils';
import { default as FormFiller } from './classes/FormFiller';
import { CONFIGS } from './configs';
import { TFloatingButtonConfigs, TColorScheme, THeaderOptionItem, TListOptionItem, TRunConfigs } from './types/types';
import { help as helpFn } from './utils/utils';

export default class FormFillerAssistant {
  private colorScheme: TColorScheme;
  private buttonConfigs: TFloatingButtonConfigs;
  private runConfigs: TRunConfigs;

  constructor(configs?: { colorScheme?: TColorScheme; buttonConfigs?: TFloatingButtonConfigs; runConfigs?: TRunConfigs }) {
    this.colorScheme = { ...CONFIGS.colorScheme, ...(configs?.colorScheme ? configs?.colorScheme : {}) };
    this.buttonConfigs = { ...CONFIGS.buttonConfigs, ...(configs?.buttonConfigs ? configs?.buttonConfigs : {}) };
    this.runConfigs = { ...CONFIGS.runConfigs, ...(configs?.runConfigs ? configs?.runConfigs : {}) };
  }

  VERSION = CONFIGS.libInfo.version;
  BUILD_DATETIME = CONFIGS.libInfo.buildTime;
  help = helpFn;

  atach(options: TListOptionItem[], headerOptions?: THeaderOptionItem[]) {
    new FormFiller({ colorScheme: this.colorScheme, runConfigs: this.runConfigs, buttonConfigs: this.buttonConfigs }).atach(options, headerOptions);
  }

  browserUtils() {
    return new BrowserUtils({ colorScheme: this.colorScheme, runConfigs: this.runConfigs });
  }

  dataUtils() {
    return new DataUtils();
  }
}
