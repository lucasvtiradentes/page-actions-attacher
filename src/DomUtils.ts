export default class DomUtils {
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
}
