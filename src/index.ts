import { default as BrowserUtils } from './classes/BrowserUtils';
import { default as DataUtils } from './classes/DataUtils';
import { default as FormFiller } from './classes/FormFiller';
import { CONFIGS } from './configs';
import { TButtonConfigs, TColorScheme, TOptionItem, TRunConfigs } from './types/types';
import { help as helpFn } from './utils/utils';

class FormFillerAssistant {
  private colorScheme: TColorScheme;
  private buttonConfigs: TButtonConfigs;
  private runConfigs: TRunConfigs;

  constructor(configs?: { colorScheme?: TColorScheme; buttonConfigs?: TButtonConfigs; runConfigs?: TRunConfigs }) {
    this.colorScheme = { ...CONFIGS.colorScheme, ...(configs?.colorScheme ? configs?.colorScheme : {}) };
    this.buttonConfigs = { ...CONFIGS.buttonConfigs, ...(configs?.buttonConfigs ? configs?.buttonConfigs : {}) };
    this.runConfigs = { ...CONFIGS.runConfigs, ...(configs?.runConfigs ? configs?.runConfigs : {}) };
  }

  VERSION = CONFIGS.libInfo.version;
  BUILD_DATETIME = CONFIGS.libInfo.buildTime;
  help = helpFn;

  atach(options: TOptionItem[], checkForUpdatesAction?: () => void) {
    new FormFiller({ colorScheme: this.colorScheme, runConfigs: this.runConfigs, buttonConfigs: this.buttonConfigs }).atach(options, checkForUpdatesAction);
  }

  browserUtils() {
    return new BrowserUtils({ colorScheme: this.colorScheme, runConfigs: this.runConfigs });
  }

  dataUtils() {
    return new DataUtils();
  }
}

export default FormFillerAssistant;
