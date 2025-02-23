import { TConfigs, TModalButton } from '../types/types';
export default class BrowserUtils {
    private configs;
    constructor(configs?: TConfigs);
    delay(milliseconds: number, ignoreLog?: boolean): Promise<unknown>;
    getElementByTagText(tag: string, textToFind: string, itemIndex?: number): HTMLElement | null;
    getElementByAttributeValue(tag: string, attribute: string, attributeValue: string, itemIndex?: number): HTMLElement | null;
    getElementBySelector(selector: string): HTMLElement;
    getElementByInputName(inputName: string): HTMLElement;
    private typeOnInput;
    typeOnInputByElement(htmlElement: Element, text: string): Promise<void>;
    typeOnInputBySelector(selector: string, text: string): Promise<void>;
    typeOnInputByInputName(inputName: string, text: string): Promise<void>;
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
