import { CONFIGS } from '../configs';
import { TColorScheme, TOptionItem, TButtonConfigs, TRunConfigs } from '../types/types';

export default class FormFiller {
  private colorScheme: TColorScheme;
  private buttonConfigs: TButtonConfigs;
  private runConfigs: TRunConfigs;

  constructor(configs?: { colorScheme?: TColorScheme; buttonConfigs?: TButtonConfigs; runConfigs?: TRunConfigs }) {
    this.colorScheme = { ...CONFIGS.colorScheme, ...(configs?.colorScheme ? configs?.colorScheme : {}) };
    this.buttonConfigs = { ...CONFIGS.buttonConfigs, ...(configs?.buttonConfigs ? configs?.buttonConfigs : {}) };
    this.runConfigs = { ...CONFIGS.runConfigs, ...(configs?.runConfigs ? configs?.runConfigs : {}) };
  }

  // PUBLIC METHODS ============================================================

  atach(optionsArr: TOptionItem[], checkForUpdatesAction?: () => void) {
    const optionsEl = this.getOptionsEl(optionsArr, checkForUpdatesAction);
    this.atachFloatingToHTML(optionsEl);

    document.addEventListener('click', (e: Event) => {
      const floatingContainer = document.querySelector(`.${CONFIGS.classes.floatingButton}`) as HTMLElement;
      const optionsContainer = document.querySelector(`.${CONFIGS.classes.optionsContainer}`) as HTMLElement;

      if (optionsContainer.style.display === 'block' && !floatingContainer.contains(e.target as Node)) {
        optionsContainer.style.display = 'none';
      }
    });
  }

  // PRIVATE METHODS ===========================================================

  private logger(message: string, type: 'error' | 'info' = 'info') {
    if (!this.runConfigs.debug) {
      return;
    }

    if (type === 'error') console.error(message);
    if (type === 'info') console.log(message);
  }

  private getOptionsEl(optionsArr: TOptionItem[], checkForUpdatesAction?: () => void) {
    const optionsContainer = document.createElement('div');
    optionsContainer.setAttribute(
      'style',
      `display: none; position: absolute; bottom: 70px; right: 0; color: ${this.colorScheme.secondary.text}; background-color: ${this.colorScheme.secondary.background}; border-radius: 5px; border: 1px solid ${this.colorScheme.secondary.border}; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); white-space: nowrap;`
    );
    optionsContainer.setAttribute('class', CONFIGS.classes.optionsContainer);

    // add header to options menu ==============================================

    const headerDiv = document.createElement('div');
    headerDiv.setAttribute('style', `width: 100%; display: grid; grid-template-columns: 1fr 1fr; padding: 3px`);

    const versionDiv = document.createElement('div');
    versionDiv.textContent = `V${CONFIGS.libInfo.version}`;
    versionDiv.setAttribute('style', `display: flex; align-items: center; justify-content: center; font-size: 14px; color: ${this.colorScheme.primary.background}`);
    headerDiv.appendChild(versionDiv);

    const actionsDiv = document.createElement('div');
    actionsDiv.setAttribute('style', `display: flex; align-items: center; justify-content: center; gap: 10px;`);

    const githubIcon = document.createElement('img');
    githubIcon.src = 'https://www.svgrepo.com/show/512317/github-142.svg';
    githubIcon.setAttribute('style', `width: 18px; height: 18px; cursor: pointer;`);
    githubIcon.addEventListener('click', () => {
      optionsContainer.style.display = 'none';
      window.open(CONFIGS.libInfo.link, '_blank');
    });
    actionsDiv.appendChild(githubIcon);

    if (checkForUpdatesAction) {
      const updateIcon = document.createElement('img');
      updateIcon.src = 'https://www.svgrepo.com/show/460136/update-alt.svg';
      updateIcon.setAttribute('style', `width: 20px; height: 20px; cursor: pointer;`);
      updateIcon.addEventListener('click', () => {
        optionsContainer.style.display = 'none';
        checkForUpdatesAction();
      });
      actionsDiv.appendChild(updateIcon);
    }

    headerDiv.appendChild(actionsDiv);
    optionsContainer.appendChild(headerDiv);

    // divider div =============================================================

    const dividerDiv = document.createElement('div');
    dividerDiv.setAttribute('style', `border-top: 1px solid #ccc; margin-top: 5px; margin-bottom: 5px;`);
    optionsContainer.appendChild(dividerDiv);

    // add options =============================================================

    optionsArr.forEach((option, index: number) => {
      const optionButton = document.createElement('button');
      optionButton.textContent = `${index + 1} - ${option.name}`;
      optionButton.setAttribute('data', `key_${index + 1}`);
      optionButton.setAttribute('style', 'display: block; width: 100%; padding: 10px; border: none; background-color: transparent; text-align: left;');
      optionButton.setAttribute('onmouseover', `this.style.backgroundColor = '${this.colorScheme.primary.background}'; this.style.color = '${this.colorScheme.primary.text}'; this.style.cursor = 'pointer';`);
      optionButton.setAttribute('onmouseout', `this.style.backgroundColor = '${this.colorScheme.secondary.background}'; this.style.color = '${this.colorScheme.secondary.text}'; this.style.cursor = 'default';`);
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
    container.setAttribute('style', `position: fixed; bottom: ${this.buttonConfigs.bottom}; right: ${this.buttonConfigs.right}; z-index: 9999;`);
    container.setAttribute('class', CONFIGS.classes.floatingButton);

    const button = document.createElement('button');
    button.setAttribute(
      'style',
      `border-radius: 50%; width: 50px; height: 50px; background-color: ${this.colorScheme.primary.background}; color: ${this.colorScheme.primary.text}; border: none; cursor: pointer; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;`
    );

    const svgIcon = document.createElement('img');
    svgIcon.src = this.buttonConfigs.iconImage;
    svgIcon.setAttribute('style', `width: 24px; height: 24px; ${this.buttonConfigs.iconColorCss}`);

    button.appendChild(svgIcon);
    container.appendChild(button);

    container.appendChild(optionsContainer);
    document.body.appendChild(container);

    const toogleFloating = () => {
      if (optionsContainer.style.display === 'none' || optionsContainer.style.display === '') {
        optionsContainer.style.display = 'block';
        document.addEventListener('keydown', (event) => this.detectNumbersPress(event));
        this.logger('show floating button');
      } else {
        optionsContainer.style.display = 'none';
        document.removeEventListener('keydown', (event) => this.detectNumbersPress(event));
        this.logger('hide floating button');
      }
    };

    button.addEventListener('click', toogleFloating);

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if ((event.ctrlKey && event.code === 'Space') || (event.altKey && event.code === 'Space')) {
        this.logger('detected ctrl+space or alt+space, toggling floating button');
        toogleFloating();
      }
    });
  }

  private detectNumbersPress(event: KeyboardEvent) {
    const optionsContainerEl = document.querySelector(`.${CONFIGS.classes.optionsContainer}`) as HTMLElement;
    if (!optionsContainerEl || optionsContainerEl.style.display !== 'block') {
      return;
    }

    const isNumeric = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(event.key);
    if (!isNumeric) {
      return;
    }

    const optionEl = document.querySelector(`[data="key_${event.key}"]`) as HTMLElement;

    if (optionEl) {
      this.logger(`detected ${event.key} keypress, exec corresponding action`);
      optionEl.click();
    }
  }
}
