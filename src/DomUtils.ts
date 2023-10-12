export default class DomUtils {
  constructor() {}

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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

  createCenteredModal(title: string, htmlContent: string) {
    const modalContainer = document.createElement('div');
    modalContainer.setAttribute('class', 'modalContainer');
    modalContainer.setAttribute('style', `display: flex; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 1000;`);

    const modalDialog = document.createElement('div');
    modalDialog.setAttribute('style', `background-color: #fff; border-radius: 5px; padding: 10px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); max-width: 80%;`);
    modalContainer.appendChild(modalDialog);

    const modalContent = document.createElement('div');
    modalDialog.appendChild(modalContent);

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = title;
    modalTitle.setAttribute('style', `padding: 10px; margin: 0; font-weight: bold; text-align: center;`);
    modalContent.appendChild(modalTitle);

    const divContent = document.createElement('div');
    divContent.innerHTML = htmlContent;
    modalContent.appendChild(divContent);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
    confirmButton.setAttribute('style', `display: block; width: 100%; margin-top: 10px; padding: 10px; border: none; background-color: #0074D9; color: #fff; border-radius: 5px; cursor: pointer;`);
    modalContent.appendChild(confirmButton);

    document.body.appendChild(modalContainer);

    function closeModal() {
      const modalEl = document.querySelector('.modalContainer');
      if (modalEl) {
        document.body.removeChild(modalContainer);
        document.removeEventListener('keydown', detectEskKeypress);
      }
    }

    modalContainer.addEventListener('click', (event) => {
      if (event.target === modalContainer) {
        closeModal();
      }
    });
    confirmButton.addEventListener('click', closeModal);

    const detectEskKeypress = function (event: KeyboardEvent) {
      if (event.key === 'Escape' || event.key === 'Esc' || event.key === "'") {
        closeModal();
      }
    };

    document.addEventListener('keydown', detectEskKeypress);

    return modalContainer;
  }
}
