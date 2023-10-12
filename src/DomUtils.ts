type TButton = {
  title: string;
  action: () => void;
  exitAfterAction: boolean;
};

export default class DomUtils {
  private colorScheme = {
    primary: {
      background: '#0074D9',
      text: '#fff'
    },
    secondary: {
      background: '#fff',
      hoverBackground: '#ccc',
      text: '#000000',
      border: '#ccc'
    },
    overlay: 'rgba(0, 0, 0, 0.7)',
    boxShadown: 'rgba(0, 0, 0, 0.1)'
  };

  private classes = {
    modalContainer: 'modal_container'
  };

  // JS UTILS ==================================================================

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // STORAGE UTILS =============================================================

  getStorageItem(key: string) {
    return sessionStorage.getItem(key);
  }

  setStorageItem(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  // ACTION UTILS ==============================================================

  typeOnInputByElement(inputElement: Element, text: string) {
    for (const char of text) {
      const inputEvent = new Event('input', { bubbles: true });
      const inputPropertyDescriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
      if (inputPropertyDescriptor) {
        const inputSetValue = inputPropertyDescriptor.set;
        inputSetValue && inputSetValue.call(inputElement, (inputElement as any).value + char);
        inputElement.dispatchEvent(inputEvent);

        const keyboardEvent = new KeyboardEvent('keydown', {
          key: char,
          code: `Key${char.toUpperCase()}`,
          bubbles: true,
          cancelable: true
        });

        inputElement.dispatchEvent(keyboardEvent);
      }
    }
  }

  typeOnInputBySelector(selector: string, text: string) {
    const inputElement = document.querySelector(selector);
    if (!inputElement) {
      return;
    }

    this.typeOnInputByElement(inputElement, text);
  }

  clickButtonByText(buttonText: string) {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const elButton = allButtons.find((itemEl) => itemEl.innerText.search(buttonText) > -1);
    if (elButton) {
      console.log('Clickei no botao', buttonText);
      elButton.click();
    } else {
      console.log('Nao achou o botao: ', buttonText);
    }
  }

  // HTML UTILS ================================================================

  generateFormRow(name, value, onAfterClickAction) {
    const onClickAction = `navigator.clipboard.writeText('${value}');${onAfterClickAction ? `(${onAfterClickAction})()` : ''}`;

    return `
      <div style="display: grid; grid-template-columns: 1fr 2fr;">
        <div style="flex: 1; padding: 3px 10px; font-weight: 600;">${name}</div>
        <div style="flex: 1; padding: 3px 10px; background-color: ${this.colorScheme.secondary.background}; cursor: pointer;"
          onmouseover="this.style.backgroundColor = '${this.colorScheme.secondary.hoverBackground}'; this.style.cursor = 'pointer';"
          onmouseout="this.style.backgroundColor = '${this.colorScheme.secondary.background}'; this.style.cursor = 'default';"
          onclick="${onClickAction}"
        >${value}</div>
      </div>`;
  }

  getModal(title: string) {
    const modalContainerEl = document.createElement('div');
    modalContainerEl.setAttribute('class', this.classes.modalContainer);
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

    const updateModalContent = (htmlContent: string, buttonsArr?: TButton[]) => {
      const divContent = document.createElement('div');
      divContent.innerHTML = htmlContent;
      modalContent.innerHTML = divContent.outerHTML;

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
        closeModal();
      }
    };

    const closeModal = () => {
      const modalEl = document.querySelector(`.${this.classes.modalContainer}`);
      if (modalEl) {
        document.body.removeChild(modalContainerEl);
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
}
