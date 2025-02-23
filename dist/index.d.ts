import { default as BrowserUtils } from './classes/browser-utils';
import { default as DataUtils } from './classes/data-utils';
import { TFloatingOptions } from './classes/atacher-utils';
import { TConfigs } from './types/types';
export default class PageActionsAttacher {
    private configs;
    private attacherUtils;
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
