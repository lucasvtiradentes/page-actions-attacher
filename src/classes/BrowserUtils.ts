import { CONFIGS } from '../configs';
import { TModalButton, TColorScheme, TRunConfigs } from '../types/types';

export default class DomUtils {
  private colorScheme: TColorScheme;
  private runConfigs: TRunConfigs;

  constructor(configs?: { colorScheme?: TColorScheme; runConfigs?: TRunConfigs }) {
    this.colorScheme = { ...CONFIGS.colorScheme, ...(configs?.colorScheme ? configs?.colorScheme : {}) };
    this.runConfigs = { ...CONFIGS.runConfigs, ...(configs?.runConfigs ? configs?.runConfigs : {}) };
  }

  // JS UTILS ==================================================================

  async delay(milliseconds: number, ignoreLog?: boolean) {
    if (!ignoreLog) {
      this.logger(`waiting: ${milliseconds}`);
    }

    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  // GET ELEMENT FUNCTIONS =====================================================

  getElementByTagText(tag: string, textToFind: string, itemIndex?: number) {
    const finalIndex = 0 ?? itemIndex;
    const allElements = Array.from(document.querySelectorAll(tag)) as HTMLElement[];
    const tagItems = allElements.filter((itemEl) => itemEl.innerText.search(textToFind) > -1);
    const elTag = tagItems.length === 0 ? null : tagItems[finalIndex];
    if (!elTag) {
      this.logger(`not found element: [${tag} | ${textToFind} | ${finalIndex}]`, 'error');
    }
    return elTag;
  }

  getElementByAttributeValue(tag: string, attribute: string, attributeValue: string, itemIndex?: number) {
    const finalIndex = 0 ?? itemIndex;
    const allElements = Array.from(document.querySelectorAll(tag)) as HTMLElement[];
    const tagItems = allElements.filter((itemEl) => itemEl.getAttribute(attribute) === attributeValue);
    const elTag = tagItems.length === 0 ? null : tagItems[finalIndex];
    if (!elTag) {
      this.logger(`not found element: [${tag} | ${attribute} | ${attributeValue} | ${finalIndex}]`, 'error');
    }
    return elTag;
  }

  getElementBySelector(selector: string) {
    const htmlElement = document.querySelector(selector) as HTMLElement;
    if (!htmlElement) {
      this.logger(`not found element by selector: [${selector}]`, 'error');
    }
    return htmlElement;
  }

  // TYPE FUNCTIONS ============================================================

  private async typeOnInput(htmlElement: Element, text: string) {
    this.logger(`typing: ${text}`);
    for (const char of text) {
      const inputEvent = new Event('input', { bubbles: true });
      const inputPropertyDescriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
      if (inputPropertyDescriptor) {
        const inputSetValue = inputPropertyDescriptor.set;
        inputSetValue && inputSetValue.call(htmlElement, (htmlElement as HTMLInputElement).value + char);
        htmlElement.dispatchEvent(inputEvent);

        const keyboardEvent = new KeyboardEvent('keydown', {
          key: char,
          code: `Key${char.toUpperCase()}`,
          bubbles: true,
          cancelable: true
        });

        await this.delay(this.runConfigs.typeDelay, true);

        htmlElement.dispatchEvent(keyboardEvent);
      }
    }
  }

  async typeOnInputByElement(htmlElement: Element, text: string) {
    if (!htmlElement) {
      this.logger(`not found element to type : ${text}`, 'error');
      return;
    }

    this.logger(`type on element [${htmlElement}]`);
    await this.typeOnInput(htmlElement, text);
  }

  async typeOnInputBySelector(selector: string, text: string) {
    const htmlElement = document.querySelector(selector);
    if (!htmlElement) {
      return;
    }

    this.logger(`type on element by selector [${selector}]`);
    await this.typeOnInput(htmlElement, text);
  }

  // CLICK FUNCTIONS ===========================================================

  click(htmlElement: HTMLElement) {
    if (!htmlElement) {
      return;
    }

    htmlElement.click();
  }

  clickElement(htmlElement: HTMLElement) {
    if (!htmlElement) {
      return;
    }

    this.logger(`clicked element: [${htmlElement}]`);
    this.click(htmlElement);
  }

  clickElementBySelector(selector: string) {
    const htmlElement = this.getElementBySelector(selector);
    if (!htmlElement) {
      return;
    }

    this.logger(`clicked element by selector: [${selector}]`);
    this.click(htmlElement);
  }

  clickElementByTagText(tag: string, textToFind: string, itemIndex?: number) {
    const finalIndex = 0 ?? itemIndex;
    const elTag = this.getElementByTagText(tag, textToFind, finalIndex);
    if (!elTag) {
      return;
    }

    this.logger(`clicked element by tag text: [${tag} | ${textToFind} | ${finalIndex}]`);
    elTag.click();
  }

  clickElementByTagAttributeValue(tag: string, attribute: string, attributeValue: string, itemIndex?: number) {
    const finalIndex = 0 ?? itemIndex;
    const elTag = this.getElementByAttributeValue(tag, attribute, attributeValue, finalIndex);
    if (!elTag) {
      return;
    }

    this.logger(`clicked element by attribute value: [${tag} | ${attribute} | ${attributeValue} | ${finalIndex}]`);
    elTag.click();
  }

  // HTML UTILS ================================================================

  generateFormRow(name: string, value: string, onAfterClickAction?: () => void) {
    const onClickAction = `navigator.clipboard.writeText('${value}'); ${onAfterClickAction ? `(${String(onAfterClickAction).replace(/"/g, "'")})()` : ''};`;
    return `
      <div style="display: grid; grid-template-columns: 1fr 2fr;">
        <div style="flex: 1; padding: 3px 10px; font-weight: 600;">${name}</div>
        <div style="flex: 1; padding: 3px 10px; background-color: ${this.colorScheme.secondary.background}; this.style.color = '${this.colorScheme.secondary.text}'; cursor: pointer;"
          onmouseover="this.style.backgroundColor = '${this.colorScheme.primary.background}'; this.style.color = '${this.colorScheme.primary.text}'; this.style.cursor = 'pointer';"
          onmouseout="this.style.backgroundColor = '${this.colorScheme.secondary.background}'; this.style.color = '${this.colorScheme.secondary.text}'; this.style.cursor = 'default';"
          onclick="${onClickAction}"
        >${value}</div>
      </div>`;
  }

  getModal(title: string) {
    const modalContainerEl = document.createElement('div');
    modalContainerEl.setAttribute('class', CONFIGS.classes.modalContainer);
    modalContainerEl.setAttribute('style', `display: flex; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: ${this.colorScheme.overlay}; z-index: 1000;`);

    const modalDialog = document.createElement('div');
    modalDialog.setAttribute('style', `background-color: ${this.colorScheme.secondary.background}; color: ${this.colorScheme.secondary.text}; border-radius: 5px; padding: 10px; box-shadow: 0px 4px 6px ${this.colorScheme.boxShadown}; max-width: 80%;`);
    modalContainerEl.appendChild(modalDialog);

    const modalContent = document.createElement('div');
    modalDialog.appendChild(modalContent);

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = title;
    modalTitle.setAttribute('style', `padding: 10px; margin: 0; font-weight: bold; text-align: center;`);
    modalContent.appendChild(modalTitle);

    document.body.appendChild(modalContainerEl);

    const updateModalContent = (htmlContent: string, buttonsArr?: TModalButton[]) => {
      const divContent = document.createElement('div');
      divContent.innerHTML = htmlContent;
      modalContent.innerHTML = modalTitle.outerHTML + divContent.outerHTML;

      if (buttonsArr && buttonsArr.length > 0) {
        buttonsArr.forEach((item) => {
          const confirmButton = document.createElement('button');
          confirmButton.textContent = item.title;
          confirmButton.setAttribute('style', `display: block; width: 100%; margin-top: 10px; text-align: center; padding: 10px; border: none; background-color: ${this.colorScheme.primary.background}; color: ${this.colorScheme.primary.text}; border-radius: 5px; cursor: pointer;`);
          confirmButton.addEventListener('click', () => {
            item.action();
            if (item.exitAfterAction !== false) {
              closeModal();
            }
          });
          modalContent.appendChild(confirmButton);
        });
      }
    };

    const detectEscKeypress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc' || event.key === "'") {
        this.logger(`detected Escape press, closing modal`);
        closeModal();
      }
    };

    const closeModal = () => {
      let modalSelector = '';
      let escAction = null;

      try {
        modalSelector = `.${CONFIGS.classes.modalContainer}`;
        escAction = detectEscKeypress;
      } catch (e) {
        modalSelector = `.${'ffa_modal_container'}`;
      }

      const modalEl = document.querySelector(modalSelector);

      if (modalEl) {
        document.body.removeChild(modalEl);
      }
      if (escAction) {
        document.removeEventListener('keydown', detectEscKeypress);
      }
    };

    modalContainerEl.addEventListener('click', (event) => {
      if (event.target === modalContainerEl) {
        closeModal();
      }
    });

    document.addEventListener('keydown', detectEscKeypress);

    return {
      updateModalContent,
      closeModal
    };
  }

  // PRIVATE METHODS ===========================================================

  private logger(message: string, type: 'error' | 'info' = 'info') {
    if (!this.runConfigs.debug) {
      return;
    }

    if (type === 'error') console.error(message);
    if (type === 'info') console.log(message);
  }
}
