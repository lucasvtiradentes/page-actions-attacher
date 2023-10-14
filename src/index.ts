import { default as BrowserUtils } from './classes/BrowserUtils';
import { default as DataUtils } from './classes/DataUtils';
import { default as FormFiller } from './classes/FormFiller';
import { CONFIGS } from './configs';
import { TButtonConfigs, TColorScheme, TOptionItem } from './types/types';
import { help as helpFn } from './utils/utils';

class FormFillerAssistant {
  private colorScheme: TColorScheme;
  private buttonConfigs: TButtonConfigs;

  constructor(configs?: { colorScheme: TColorScheme; buttonConfigs: TButtonConfigs }) {
    this.colorScheme = { ...CONFIGS.colorScheme, ...(configs?.colorScheme ? configs?.colorScheme : {}) };
    this.buttonConfigs = { ...CONFIGS.buttonConfigs, ...(configs?.buttonConfigs ? configs?.buttonConfigs : {}) };
  }

  VERSION = CONFIGS.libInfo.version;
  BUILD_DATETIME = CONFIGS.libInfo.buildTime;
  help = helpFn;

  atach(options: TOptionItem[]) {
    new FormFiller({ colorScheme: this.colorScheme, buttonConfigs: this.buttonConfigs }).init(options);
  }

  dataUtils() {
    return new DataUtils();
  }

  browserUtils() {
    return new BrowserUtils({ colorScheme: this.colorScheme });
  }
}

export default FormFillerAssistant;
