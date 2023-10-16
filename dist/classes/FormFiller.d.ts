import { TColorScheme, TListOptionItem, TFloatingButtonConfigs, TRunConfigs, THeaderOptionItem } from '../types/types';
export default class FormFiller {
    private colorScheme;
    private buttonConfigs;
    private runConfigs;
    constructor(configs?: {
        colorScheme?: TColorScheme;
        buttonConfigs?: TFloatingButtonConfigs;
        runConfigs?: TRunConfigs;
    });
    atach(optionsArr: TListOptionItem[], headerOptions?: THeaderOptionItem[]): void;
    private logger;
    private getOptionsEl;
    private addTooltipToElement;
    private atachFloatingToHTML;
    private detectNumbersPress;
}
