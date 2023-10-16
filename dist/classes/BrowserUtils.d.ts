import { TModalButton, TColorScheme, TRunConfigs } from '../types/types';
export default class DomUtils {
    private colorScheme;
    private runConfigs;
    constructor(configs?: {
        colorScheme?: TColorScheme;
        runConfigs?: TRunConfigs;
    });
    delay(milliseconds: number, ignoreLog?: boolean): Promise<unknown>;
    getElementByTagText(tag: string, textToFind: string, itemIndex?: number): HTMLElement | null;
    getElementByAttributeValue(tag: string, attribute: string, attributeValue: string, itemIndex?: number): HTMLElement | null;
    getElementBySelector(selector: string): HTMLElement;
    private typeOnInput;
    typeOnInputByElement(htmlElement: Element, text: string): Promise<void>;
    typeOnInputBySelector(selector: string, text: string): Promise<void>;
    click(htmlElement: HTMLElement): void;
    clickElement(htmlElement: HTMLElement): void;
    clickElementBySelector(selector: string): void;
    clickElementByTagText(tag: string, textToFind: string, itemIndex?: number): void;
    clickElementByTagAttributeValue(tag: string, attribute: string, attributeValue: string, itemIndex?: number): void;
    generateFormRow(name: string, value: string, onAfterClickAction?: () => void): string;
    getModal(title: string): {
        updateModalContent: (htmlContent: string, buttonsArr?: TModalButton[]) => void;
        closeModal: () => void;
    };
    showToast(message: string, seconds?: number): void;
    private logger;
}
