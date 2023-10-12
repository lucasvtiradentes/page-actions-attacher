type TOptionItem = {
  name: string;
  action: () => void;
};

export default class FormFiller {
  constructor() {}

  detectNumbersPress(event: KeyboardEvent) {
    const optionsContainerEl = document.querySelector('.options_container') as HTMLElement;
    if (!optionsContainerEl || optionsContainerEl.style.display !== 'block') {
      return;
    }

    const isNumeric = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(event.key);
    if (!isNumeric) {
      return;
    }

    const optionEl = document.querySelector(`[data="key_${event.key}"]`) as HTMLElement;

    if (optionEl) {
      console.log(`executei o key_${event.key}`);
      optionEl.click();
    }
  }

  getOptionsEl(optArr: TOptionItem[]) {
    const optionsContainer = document.createElement('div');
    optionsContainer.setAttribute('style', 'display: none; position: absolute; bottom: 70px; right: 0; background-color: #fff; border-radius: 5px; border: 1px solid #ccc; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); white-space: nowrap;');
    optionsContainer.setAttribute('class', 'options_container');

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

  atachFloatingToHTML(optionsContainer: HTMLElement) {
    const container = document.createElement('div');
    container.setAttribute('style', 'position: fixed; bottom: 70px; right: 30px; z-index: 9999;');
    container.setAttribute('class', 'floating_container');

    const button = document.createElement('button');
    button.setAttribute('style', 'border-radius: 50%; width: 50px; height: 50px; background-color: #0074D9; color: #fff; border: none; cursor: pointer; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;');

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
}
