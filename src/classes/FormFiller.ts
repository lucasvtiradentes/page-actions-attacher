import { CONSTS, CONFIGS } from '../configs';
import { THeaderOptionItem, TListOptionItem } from '../types/types';
import { TConfigs } from '../types/types';

export type TFloatingOptions = {
  bodyOptions: TListOptionItem[];
  headerOptions?: THeaderOptionItem[];
};

export default class FormFiller {
  private configs: TConfigs;
  private floatingEl: HTMLElement | null;
  private optionsEl: HTMLElement | null;
  private unbindEventsFn = () => {}; // eslint-disable-line

  constructor(configs?: TConfigs) {
    this.configs = { ...CONFIGS, ...configs };
    this.floatingEl = null;
    this.optionsEl = null;
  }

  // PUBLIC METHODS ============================================================

  updateOptions(floatingOptions: TFloatingOptions) {
    if (this.optionsEl) {
      this.optionsEl.remove();
      this.optionsEl = null;
    }

    if (!this.floatingEl) {
      this.logger('first use attach in order to update options!');
      return;
    }

    const optionsEl = this.getOptionsEl(floatingOptions);
    const unbindEventsFn = this.atachFloatingToHTML(this.floatingEl, optionsEl);

    this.optionsEl = optionsEl;
    this.unbindEventsFn = unbindEventsFn;
  }

  detach() {
    if (!this.floatingEl) {
      this.logger('did not find floating button element');
      return;
    }

    this.logger('removed floating button element');
    this.unbindEventsFn();
    this.floatingEl.remove();

    this.unbindEventsFn = () => {}; // eslint-disable-line
    this.floatingEl = null;
    this.optionsEl = null;
  }

  attach(floatingOptions: TFloatingOptions) {
    const optionsEl = this.getOptionsEl(floatingOptions);
    const floatingEl = this.createFloatingHTML();
    const unbindEventsFn = this.atachFloatingToHTML(floatingEl, optionsEl);

    this.detectUrlChangesOnSpa(this.configs.onSpaRouteChange);

    this.floatingEl = floatingEl;
    this.optionsEl = optionsEl;
    this.unbindEventsFn = unbindEventsFn;
  }

  // PRIVATE METHODS ===========================================================

  private detectUrlChangesOnSpa(cb: (newUrl: string) => void) {
    let previousUrl = location.href;

    const observer = new MutationObserver(() => {
      if (previousUrl !== location.href) {
        previousUrl = location.href;
        cb(location.href);
      }
    });

    observer.observe(document, { subtree: true, childList: true });
  }

  private logger(message: string, type: 'error' | 'info' = 'info') {
    if (!this.configs.debug) {
      return;
    }

    if (type === 'error') console.error(message);
    if (type === 'info') console.log(message);
  }

  private getOptionsEl({ bodyOptions, headerOptions }: TFloatingOptions) {
    const hasHeaderOptions = headerOptions && headerOptions.length > 0;

    const optionsContainer = document.createElement('div');
    optionsContainer.setAttribute(
      'style',
      `display: none; position: absolute; bottom: 70px; right: 0; color: ${this.configs.colorScheme.secondary.text}; background-color: ${this.configs.colorScheme.secondary.background}; border-radius: 5px; border: 1px solid ${this.configs.colorScheme.secondary.border}; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); white-space: nowrap;`
    );
    optionsContainer.setAttribute('class', CONSTS.classes.optionsContainer);

    // add header to options menu ==============================================

    const headerDiv = document.createElement('div');
    headerDiv.setAttribute('style', `width: 100%; display: grid; padding-top: 5px; grid-template-columns: ${hasHeaderOptions ? '1fr 2fr' : '1fr 1fr'};`);

    const versionDiv = document.createElement('div');
    versionDiv.textContent = `V${CONSTS.libInfo.version}`;
    versionDiv.setAttribute('style', `display: flex; align-items: center; justify-content: center; font-size: 12px; color: ${this.configs.colorScheme.primary.background}; cursor: pointer;`);
    versionDiv.addEventListener('click', () => {
      optionsContainer.style.display = 'none';
      window.open(`${CONSTS.libInfo.link}/releases/tag/v${CONSTS.libInfo.version}`, '_blank');
    });
    headerDiv.appendChild(versionDiv);

    const actionsDiv = document.createElement('div');
    actionsDiv.setAttribute('style', `display: flex; align-items: center; justify-content: space-around;`);

    const githubIcon = document.createElement('img');
    githubIcon.src = 'https://www.svgrepo.com/show/512317/github-142.svg';
    githubIcon.setAttribute('style', `width: 18px; height: 18px; cursor: pointer;`);
    githubIcon.addEventListener('click', () => {
      optionsContainer.style.display = 'none';
      window.open(CONSTS.libInfo.link, '_blank');
    });
    this.addTooltipToElement(githubIcon, 'visit the project github page');
    actionsDiv.appendChild(githubIcon);

    if (hasHeaderOptions) {
      headerOptions.forEach((item) => {
        const updateIcon = document.createElement('img');
        updateIcon.src = item.icon;
        updateIcon.setAttribute('style', `position: relative; width: 20px; height: 20px; cursor: pointer; ${item.cssStyle ?? ''}`);
        updateIcon.addEventListener('click', () => {
          optionsContainer.style.display = 'none';
          item.action();
        });

        this.addTooltipToElement(updateIcon, item.description);
        actionsDiv.appendChild(updateIcon);
      });
    }

    headerDiv.appendChild(actionsDiv);
    optionsContainer.appendChild(headerDiv);

    // divider div =============================================================

    const dividerDiv = document.createElement('div');
    dividerDiv.setAttribute('style', `border-top: 1px solid ${this.configs.colorScheme.secondary.border}; margin-top: 8px;`);
    optionsContainer.appendChild(dividerDiv);

    // add options =============================================================

    if (bodyOptions) {
      bodyOptions.forEach((option, index: number) => {
        const optionButton = document.createElement('button');
        optionButton.textContent = `${index + 1} - ${option.name}`;
        optionButton.setAttribute('data', `key_${index + 1}`);
        optionButton.setAttribute('style', 'display: block; width: 100%; padding: 10px; border: none; background-color: transparent; text-align: left;');
        optionButton.setAttribute('onmouseover', `this.style.backgroundColor = '${this.configs.colorScheme.primary.background}'; this.style.color = '${this.configs.colorScheme.primary.text}'; this.style.cursor = 'pointer';`);
        optionButton.setAttribute('onmouseout', `this.style.backgroundColor = '${this.configs.colorScheme.secondary.background}'; this.style.color = '${this.configs.colorScheme.secondary.text}'; this.style.cursor = 'default';`);
        optionButton.addEventListener('click', () => {
          optionsContainer.style.display = 'none';
          document.removeEventListener('keydown', this.detectNumbersPress);
          option.action();
        });
        optionsContainer.appendChild(optionButton);
      });
    }

    return optionsContainer;
  }

  private addTooltipToElement(element: HTMLElement, description: string) {
    element.setAttribute('title', description);

    element.addEventListener('mouseenter', () => {
      const tooltip = document.createElement('div');
      tooltip.setAttribute('style', `content: attr(title); position: absolute; background: #333; color: #fff; border-radius: 4px; padding: 4px; top: -30px; left: 50%; transform: translateX(-50%); opacity: 0; transition: opacity 0.3s; z-index: 1;`);

      element.style.position = 'relative';
      element.appendChild(tooltip);

      setTimeout(() => {
        tooltip.style.opacity = '1';
      }, 10);
    });

    element.addEventListener('mouseleave', () => {
      const tooltip = element.querySelector('div');
      if (tooltip) {
        tooltip.style.opacity = '0';
      }
    });
  }

  private createFloatingHTML() {
    const floatingEl = document.createElement('div');
    floatingEl.setAttribute('style', `position: fixed; bottom: ${this.configs.floatingButton.bottom}; right: ${this.configs.floatingButton.right}; z-index: 9999;`);
    floatingEl.setAttribute('class', CONSTS.classes.floatingContainer);

    const button = document.createElement('button');
    button.setAttribute('class', CONSTS.classes.floatingButton);
    button.setAttribute(
      'style',
      `border-radius: 50%; width: 50px; height: 50px; background-color: ${this.configs.colorScheme.primary.background}; color: ${this.configs.colorScheme.primary.text}; border: none; cursor: pointer; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;`
    );

    const svgIcon = document.createElement('img');
    svgIcon.src = this.configs.floatingButton.iconImage;
    svgIcon.setAttribute('style', `width: 24px; height: 24px; ${this.configs.floatingButton.iconColorCss}`);

    button.appendChild(svgIcon);
    floatingEl.appendChild(button);
    document.body.appendChild(floatingEl);

    return floatingEl;
  }

  private atachFloatingToHTML(floatingEl: HTMLElement, optionsContainer: HTMLElement) {
    const toogleFloating = () => {
      if (optionsContainer.style.display === 'none' || optionsContainer.style.display === '') {
        optionsContainer.style.display = 'block';
        document.addEventListener('keydown', (event) => this.detectNumbersPress(event));
      } else {
        optionsContainer.style.display = 'none';
        document.removeEventListener('keydown', (event) => this.detectNumbersPress(event));
      }
    };

    const detectFloatingShortcut = (event: KeyboardEvent) => {
      const isToogleFloatingShortcut = this.configs.floatingButton.shortcutFn(event);
      if (isToogleFloatingShortcut) {
        this.logger('detected shortcut combination, toggling floating button');
        toogleFloating();
      }
    };

    const detectClickOutside = (event: Event) => {
      const floatingContainer = document.querySelector(`.${CONSTS.classes.floatingContainer}`) as HTMLElement;
      const optionsContainer = document.querySelector(`.${CONSTS.classes.optionsContainer}`) as HTMLElement;

      if (optionsContainer.style.display === 'block' && !floatingContainer.contains(event.target as Node)) {
        optionsContainer.style.display = 'none';
      }
    };

    // =========================================================================

    floatingEl.appendChild(optionsContainer);

    const button = document.querySelector(`.${CONSTS.classes.floatingButton}`) as HTMLElement;
    if (!button) {
      this.logger('did not find button element', 'error');
      return () => {}; // eslint-disable-line
    }

    button.addEventListener('click', toogleFloating);
    document.addEventListener('keydown', detectFloatingShortcut);
    document.addEventListener('click', detectClickOutside);

    const unbindEventsFn = () => {
      button.removeEventListener('click', toogleFloating);
      document.removeEventListener('keydown', detectFloatingShortcut);
      document.removeEventListener('click', detectClickOutside);
    };

    return unbindEventsFn;
  }

  private detectNumbersPress(event: KeyboardEvent) {
    const optionsContainerEl = document.querySelector(`.${CONSTS.classes.optionsContainer}`) as HTMLElement;
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
