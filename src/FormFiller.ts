type TOptionItem = {
  name: string;
  action: () => void;
};

export default class FormFiller {
  private colorScheme = {
    primary: {
      background: '#0074D9',
      text: '#fff'
    },
    secondary: {
      background: '#fff',
      text: '#000000',
      border: '#ccc'
    },
    overlay: 'rgba(0, 0, 0, 0.7)',
    boxShadown: 'rgba(0, 0, 0, 0.1)'
  };

  private classes = {
    floatingButton: 'floating_container',
    optionsContainer: 'options_container',
    modalContainer: 'modal_container'
  };

  init(optArr: TOptionItem[]) {
    const optionsEl = this.getOptionsEl(optArr);
    this.atachFloatingToHTML(optionsEl);

    document.addEventListener('click', (e: Event) => {
      const floatingContainer = document.querySelector(`.${this.classes.floatingButton}`) as HTMLElement;
      const optionsContainer = document.querySelector(`.${this.classes.optionsContainer}`) as HTMLElement;

      if (optionsContainer.style.display === 'block' && !floatingContainer.contains(e.target as Node)) {
        optionsContainer.style.display = 'none';
      }
    });
  }

  private getOptionsEl(optArr: TOptionItem[]) {
    const optionsContainer = document.createElement('div');
    optionsContainer.setAttribute(
      'style',
      `display: none; position: absolute; bottom: 70px; right: 0; color: ${this.colorScheme.secondary.text}; background-color: ${this.colorScheme.secondary.background}; border-radius: 5px; border: 1px solid ${this.colorScheme.secondary.border}; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); white-space: nowrap;`
    );
    optionsContainer.setAttribute('class', this.classes.optionsContainer);

    optArr.forEach((option, index: number) => {
      const optionButton = document.createElement('button');
      optionButton.textContent = `${index + 1} - ${option.name}`;
      optionButton.setAttribute('data', `key_${index + 1}`);
      optionButton.setAttribute('style', 'display: block; width: 100%; padding: 10px; border: none; background-color: transparent; text-align: left; cursor: pointer;');
      optionButton.addEventListener('click', () => {
        optionsContainer.style.display = 'none';
        document.removeEventListener('keydown', this.detectNumbersPress);
        option.action();
      });
      optionsContainer.appendChild(optionButton);
    });

    return optionsContainer;
  }

  private atachFloatingToHTML(optionsContainer: HTMLElement) {
    const container = document.createElement('div');
    container.setAttribute('style', 'position: fixed; bottom: 70px; right: 30px; z-index: 9999;');
    container.setAttribute('class', this.classes.floatingButton);

    const button = document.createElement('button');
    button.setAttribute(
      'style',
      `border-radius: 50%; width: 50px; height: 50px; background-color: ${this.colorScheme.primary.background}; color: ${this.colorScheme.primary.text}; border: none; cursor: pointer; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;`
    );

    const svgIcon = document.createElement('img');
    svgIcon.src = 'https://www.svgrepo.com/show/532994/plus.svg';
    svgIcon.setAttribute('style', 'width: 24px; height: 24px;');

    button.appendChild(svgIcon);
    container.appendChild(button);

    container.appendChild(optionsContainer);
    document.body.appendChild(container);

    const toogleFloating = () => {
      if (optionsContainer.style.display === 'none' || optionsContainer.style.display === '') {
        optionsContainer.style.display = 'block';
        document.addEventListener('keydown', this.detectNumbersPress);
      } else {
        optionsContainer.style.display = 'none';
        document.removeEventListener('keydown', this.detectNumbersPress);
      }
    };

    button.addEventListener('click', toogleFloating);

    const detectCtrlSpace = function (event: KeyboardEvent) {
      if (event.ctrlKey && event.code === 'Space') {
        toogleFloating();
      }
    };

    document.addEventListener('keydown', detectCtrlSpace);
  }

  private detectNumbersPress(event: KeyboardEvent) {
    const optionsContainerEl = document.querySelector(`.${this.classes.optionsContainer}`) as HTMLElement;
    if (!optionsContainerEl || optionsContainerEl.style.display !== 'block') {
      return;
    }

    const isNumeric = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(event.key);
    if (!isNumeric) {
      return;
    }

    const optionEl = document.querySelector(`[data="key_${event.key}"]`) as HTMLElement;

    if (optionEl) {
      optionEl.click();
    }
  }

  createCenteredModal(title: string, htmlContent: string) {
    const modalContainer = document.createElement('div');
    modalContainer.setAttribute('class', this.classes.modalContainer);
    modalContainer.setAttribute('style', `display: flex; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: ${this.colorScheme.overlay}; z-index: 1000;`);

    const modalDialog = document.createElement('div');
    modalDialog.setAttribute('style', `background-color: ${this.colorScheme.secondary.background}; color: ${this.colorScheme.secondary.text}; border-radius: 5px; padding: 10px; box-shadow: 0px 4px 6px ${this.colorScheme.boxShadown}; max-width: 80%;`);
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
    confirmButton.setAttribute('style', `display: block; width: 100%; margin-top: 10px; text-align: center; padding: 10px; border: none; background-color: ${this.colorScheme.primary.background}; color: ${this.colorScheme.primary.text}; border-radius: 5px; cursor: pointer;`);
    modalContent.appendChild(confirmButton);

    document.body.appendChild(modalContainer);

    function closeModal() {
      const modalEl = document.querySelector(`.${this.classes.modalContainer}`);
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
