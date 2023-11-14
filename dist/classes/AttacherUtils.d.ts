import { THeaderOptionItem, TListOptionItem } from '../types/types';
import { TConfigs } from '../types/types';
export type TFloatingOptions = {
    bodyOptions: TListOptionItem[];
    headerOptions?: THeaderOptionItem[];
};
export default class AttacherUtils {
    private configs;
    private floatingEl;
    private optionsEl;
    private unbindEventsFn;
    constructor(configs?: TConfigs);
    updateOptions(floatingOptions: TFloatingOptions): void;
    detach(): void;
    attach(floatingOptions: TFloatingOptions): void;
    private detectUrlChangesOnSpa;
    private logger;
    private getOptionsEl;
    private addTooltipToElement;
    private createFloatingHTML;
    private atachFloatingToHTML;
    private detectNumbersPress;
}
