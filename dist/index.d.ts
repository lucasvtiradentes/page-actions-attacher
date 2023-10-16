import { default as BrowserUtils } from './classes/BrowserUtils';
import { default as DataUtils } from './classes/DataUtils';
import { TFloatingButtonConfigs, TColorScheme, THeaderOptionItem, TListOptionItem, TRunConfigs } from './types/types';
export default class FormFillerAssistant {
    private colorScheme;
    private buttonConfigs;
    private runConfigs;
    constructor(configs?: {
        colorScheme?: TColorScheme;
        buttonConfigs?: TFloatingButtonConfigs;
        runConfigs?: TRunConfigs;
    });
    VERSION: string;
    BUILD_DATETIME: string;
    help: () => void;
    atach(options: TListOptionItem[], headerOptions?: THeaderOptionItem[]): void;
    browserUtils(): BrowserUtils;
    dataUtils(): DataUtils;
}
