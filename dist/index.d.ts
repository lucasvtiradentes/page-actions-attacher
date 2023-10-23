import { default as BrowserUtils } from './classes/BrowserUtils';
import { default as DataUtils } from './classes/DataUtils';
import { TFloatingOptions } from './classes/FormFiller';
import { TConfigs } from './types/types';
export default class FormFillerAssistant {
    private configs;
    private formFiller;
    private VERSION;
    private BUILD_DATETIME;
    constructor(configs?: TConfigs);
    help(): void;
    logger(message: string, type?: 'info' | 'error'): void;
    attach(floatingOptions: TFloatingOptions): void;
    updateOptions(floatingOptions: TFloatingOptions): void;
    detach(): void;
    dataUtils(): DataUtils;
    browserUtils(): BrowserUtils;
}
