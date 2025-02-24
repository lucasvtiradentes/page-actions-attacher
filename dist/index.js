(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PageActionsAttacher = factory());
})(this, (function () { 'use strict';

  const classes = {
      floatingContainer: 'ffa_floating_container',
      floatingButton: 'ffa_floating_button',
      optionsContainer: 'ffa_options_container',
      modalContainer: 'ffa_modal_container'
  };
  const libInfo = {
      name: 'webpage-customizer',
      version: '1.12.5',
      buildTime: '23/02/2025 21:17:12',
      link: 'https://github.com/lucasvtiradentes/webpage-customizer',
      temperMonkeyLink: 'https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo',
      initialScript: 'https://github.com/lucasvtiradentes/webpage-customizer/dist/initial_temper_monkey_script.js'
  };
  const CONSTS = {
      classes,
      libInfo
  };
  // =============================================================================
  const colorScheme = {
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
  const floatingButton = {
      iconImage: 'https://www.svgrepo.com/show/532994/plus.svg',
      iconColorCss: 'filter: invert(100%);',
      right: '30px',
      bottom: '30px',
      shortcutFn: (event) => event.ctrlKey && event.code === 'Space'
  };
  const CONFIGS = {
      debug: false,
      typeDelay: 0,
      onSpaRouteChange: (newUrl) => console.log(`change route to: ${newUrl}`),
      colorScheme,
      floatingButton
  };

  class BrowserUtils {
      configs;
      constructor(configs) {
          this.configs = { ...CONFIGS, ...configs };
      }
      // JS UTILS ==================================================================
      async delay(milliseconds, ignoreLog) {
          if (!ignoreLog) {
              this.logger(`waiting: ${milliseconds}`);
          }
          return new Promise((resolve) => setTimeout(resolve, milliseconds));
      }
      // GET ELEMENT FUNCTIONS =====================================================
      getElementByTagText(tag, textToFind, itemIndex) {
          const finalIndex = itemIndex ?? 0;
          const allElements = Array.from(document.querySelectorAll(tag));
          const tagItems = allElements.filter((itemEl) => itemEl.innerText.search(textToFind) > -1);
          const elTag = tagItems.length === 0 ? null : tagItems[finalIndex];
          if (!elTag) {
              this.logger(`not found element: [${tag} | ${textToFind} | ${finalIndex}]`, 'error');
          }
          return elTag;
      }
      getElementByAttributeValue(tag, attribute, attributeValue, itemIndex) {
          const finalIndex = itemIndex ?? 0;
          const allElements = Array.from(document.querySelectorAll(tag));
          const tagItems = allElements.filter((itemEl) => itemEl.getAttribute(attribute) === attributeValue);
          const elTag = tagItems.length === 0 ? null : tagItems[finalIndex];
          if (!elTag) {
              this.logger(`not found element: [${tag} | ${attribute} | ${attributeValue} | ${finalIndex}]`, 'error');
          }
          return elTag;
      }
      getElementBySelector(selector) {
          const htmlElement = document.querySelector(selector);
          if (!htmlElement) {
              this.logger(`not found element by selector: [${selector}]`, 'error');
          }
          return htmlElement;
      }
      getElementByInputName(inputName) {
          const htmlElement = document.querySelector(`input[name="${inputName}"]`);
          if (!htmlElement) {
              this.logger(`not found element by inputName: [${inputName}]`, 'error');
          }
          return htmlElement;
      }
      // TYPE FUNCTIONS ============================================================
      async typeOnInput(htmlElement, text) {
          this.logger(`typing: ${text}`);
          for (const char of text) {
              const inputEvent = new Event('input', { bubbles: true });
              const inputPropertyDescriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
              if (inputPropertyDescriptor) {
                  const inputSetValue = inputPropertyDescriptor.set;
                  inputSetValue && inputSetValue.call(htmlElement, htmlElement.value + char);
                  htmlElement.dispatchEvent(inputEvent);
                  const keyboardEvent = new KeyboardEvent('keydown', {
                      key: char,
                      code: `Key${char.toUpperCase()}`,
                      bubbles: true,
                      cancelable: true
                  });
                  await this.delay(this.configs.typeDelay, true);
                  htmlElement.dispatchEvent(keyboardEvent);
              }
          }
      }
      async typeOnInputByElement(htmlElement, text) {
          if (!htmlElement) {
              this.logger(`not found element to type : ${text}`, 'error');
              return;
          }
          this.logger(`type on element [${htmlElement}]`);
          await this.typeOnInput(htmlElement, text);
      }
      async typeOnInputBySelector(selector, text) {
          const htmlElement = this.getElementBySelector(selector);
          if (!htmlElement) {
              return;
          }
          this.logger(`type on element by selector [${selector}]`);
          await this.typeOnInput(htmlElement, text);
      }
      async typeOnInputByInputName(inputName, text) {
          const htmlElement = this.getElementByInputName(inputName);
          if (!htmlElement) {
              return;
          }
          this.logger(`type on element by inputName [${inputName}]`);
          await this.typeOnInput(htmlElement, text);
      }
      // CLICK FUNCTIONS ===========================================================
      click(htmlElement) {
          if (!htmlElement) {
              return;
          }
          htmlElement.click();
      }
      clickElement(htmlElement) {
          if (!htmlElement) {
              return;
          }
          this.logger(`clicked element: [${htmlElement}]`);
          this.click(htmlElement);
      }
      clickElementBySelector(selector) {
          const htmlElement = this.getElementBySelector(selector);
          if (!htmlElement) {
              return;
          }
          this.logger(`clicked element by selector: [${selector}]`);
          this.click(htmlElement);
      }
      clickElementByTagText(tag, textToFind, itemIndex) {
          const finalIndex = itemIndex ?? 0;
          const htmlElement = this.getElementByTagText(tag, textToFind, finalIndex);
          if (!htmlElement) {
              return;
          }
          this.logger(`clicked element by tag text: [${tag} | ${textToFind} | ${finalIndex}]`);
          this.click(htmlElement);
      }
      clickElementByTagAttributeValue(tag, attribute, attributeValue, itemIndex) {
          const finalIndex = itemIndex ?? 0;
          const htmlElement = this.getElementByAttributeValue(tag, attribute, attributeValue, finalIndex);
          if (!htmlElement) {
              return;
          }
          this.logger(`clicked element by attribute value: [${tag} | ${attribute} | ${attributeValue} | ${finalIndex}]`);
          this.click(htmlElement);
      }
      // HTML UTILS ================================================================
      generateFormRow(name, value, onAfterClickAction) {
          const onClickAction = `navigator.clipboard.writeText('${value}'); ${onAfterClickAction ? `(${String(onAfterClickAction).replace(/"/g, "'")})()` : ''};`;
          return `
      <div style="display: grid; grid-template-columns: 1fr 2fr;">
        <div style="flex: 1; padding: 3px 10px; font-weight: 600;">${name}</div>
        <div style="flex: 1; padding: 3px 10px; background-color: ${this.configs.colorScheme.secondary.background}; this.style.color = '${this.configs.colorScheme.secondary.text}'; cursor: pointer;"
          onmouseover="this.style.backgroundColor = '${this.configs.colorScheme.primary.background}'; this.style.color = '${this.configs.colorScheme.primary.text}'; this.style.cursor = 'pointer';"
          onmouseout="this.style.backgroundColor = '${this.configs.colorScheme.secondary.background}'; this.style.color = '${this.configs.colorScheme.secondary.text}'; this.style.cursor = 'default';"
          onclick="${onClickAction}"
        >${value}</div>
      </div>`;
      }
      getModal(title) {
          const modalContainerEl = document.createElement('div');
          modalContainerEl.setAttribute('class', CONSTS.classes.modalContainer);
          modalContainerEl.setAttribute('style', `display: flex; align-items: center; justify-content: center; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: ${this.configs.colorScheme.overlay}; z-index: 1000;`);
          const modalDialog = document.createElement('div');
          modalDialog.setAttribute('style', `background-color: ${this.configs.colorScheme.secondary.background}; color: ${this.configs.colorScheme.secondary.text}; border-radius: 5px; padding: 10px; box-shadow: 0px 4px 6px ${this.configs.colorScheme.boxShadown}; max-width: 80%;`);
          modalContainerEl.appendChild(modalDialog);
          const modalContent = document.createElement('div');
          modalDialog.appendChild(modalContent);
          const modalTitle = document.createElement('h2');
          modalTitle.textContent = title;
          modalTitle.setAttribute('style', `padding: 10px; margin: 0; font-weight: bold; text-align: center;`);
          modalContent.appendChild(modalTitle);
          document.body.appendChild(modalContainerEl);
          const updateModalContent = (htmlContent, buttonsArr) => {
              const divContent = document.createElement('div');
              divContent.innerHTML = htmlContent;
              modalContent.innerHTML = modalTitle.outerHTML + divContent.outerHTML;
              if (buttonsArr && buttonsArr.length > 0) {
                  buttonsArr.forEach((item) => {
                      const confirmButton = document.createElement('button');
                      confirmButton.textContent = item.title;
                      confirmButton.setAttribute('style', `display: block; width: 100%; margin-top: 10px; text-align: center; padding: 10px; border: none; background-color: ${this.configs.colorScheme.primary.background}; color: ${this.configs.colorScheme.primary.text}; border-radius: 5px; cursor: pointer;`);
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
          const detectEscKeypress = (event) => {
              if (event.key === 'Escape' || event.key === 'Esc' || event.key === "'") {
                  this.logger(`detected Escape press, closing modal`);
                  closeModal();
              }
          };
          const closeModal = () => {
              let modalSelector = '';
              let escAction = null;
              try {
                  modalSelector = `.${CONSTS.classes.modalContainer}`;
                  escAction = detectEscKeypress;
              }
              catch (e) {
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
      showToast(message, seconds) {
          const initialCounter = seconds ?? 3;
          let counter = initialCounter;
          const showCountdown = (msg) => {
              const toastId = '_ffa_toast';
              const toastDiv = document.createElement('div');
              toastDiv.id = toastId;
              toastDiv.setAttribute('style', `position: fixed; padding: 10px; top: 20px; right: 20px; background-color: ${this.configs.colorScheme.secondary.background}; color: ${this.configs.colorScheme.secondary.text}; z-index: 1002; border-radius: 10px; box-shadow: 0 0 10px ${this.configs.colorScheme.primary.background}; font-size: 16px;`);
              const message = document.createElement('span');
              message.innerHTML = msg.replace(/\n/g, '<br>');
              message.setAttribute('style', 'display: flex; justify-content: center; align-items: center; height: 100%;');
              toastDiv.appendChild(message);
              const progressBar = document.createElement('div');
              progressBar.setAttribute('style', `width: 100%; background-color: ${this.configs.colorScheme.secondary.background}; height: 5px; margin-top: 5px; border-radius: 3px; transition: width 1s linear;`);
              toastDiv.appendChild(progressBar);
              const progress = document.createElement('div');
              progress.setAttribute('style', `width: 100%; background-color: ${this.configs.colorScheme.primary.background}; height: 100%; border-radius: 3px;`);
              progressBar.appendChild(progress);
              document.body.appendChild(toastDiv);
              // set responsive width ==================================================
              const messageWidth = message.getBoundingClientRect().width + 50;
              toastDiv.style.width = `${Math.min(messageWidth, 600)}px`;
              // add progress animation ================================================
              const timer = setInterval(() => {
                  counter--;
                  const progressEl = progress;
                  const progressWidth = (counter / initialCounter) * 100;
                  progressEl.style.width = `${progressWidth}%`;
                  if (counter < 0) {
                      clearInterval(timer);
                      const toastEl = document.getElementById(toastId);
                      if (toastEl) {
                          toastEl.remove();
                      }
                  }
              }, 1000);
          };
          showCountdown(message);
      }
      // PRIVATE METHODS ===========================================================
      logger(message, type = 'info') {
          if (!this.configs.debug) {
              return;
          }
          if (type === 'error')
              console.error(message);
          if (type === 'info')
              console.log(message);
      }
  }

  class DataUtils {
      personName = this.generatePersonName();
      companyName = this.generateCompanyName();
      // BRAZILIAN SPECIAL FUNCTIONS ===============================================
      generateCNPJ() {
          const randomDigit = () => {
              return Math.floor(Math.random() * 10);
          };
          const generateCNPJBase = () => {
              const cnpjBase = [];
              for (let i = 0; i < 12; i++) {
                  cnpjBase.push(randomDigit());
              }
              return cnpjBase;
          };
          const calculateFirstVerifier = (cnpjBase) => {
              const weight = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
              let sum = 0;
              for (let i = 0; i < 12; i++) {
                  sum += cnpjBase[i] * weight[i];
              }
              const remainder = sum % 11;
              return remainder < 2 ? 0 : 11 - remainder;
          };
          const calculateSecondVerifier = (cnpjBase, firstVerifier) => {
              const weight = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
              let sum = 0;
              for (let i = 0; i < 12; i++) {
                  sum += cnpjBase[i] * weight[i];
              }
              sum += firstVerifier * weight[12];
              const remainder = sum % 11;
              return remainder < 2 ? 0 : 11 - remainder;
          };
          const cnpjBase = generateCNPJBase();
          const firstVerifier = calculateFirstVerifier(cnpjBase);
          const secondVerifier = calculateSecondVerifier(cnpjBase.concat(firstVerifier), firstVerifier);
          return `${cnpjBase.join('')}${firstVerifier}${secondVerifier}`;
      }
      generateCPF() {
          const cpfStored = [];
          for (let generator = 0; generator < 11; generator++) {
              const randomNumber0to9 = (Math.random() * 9).toFixed(0);
              cpfStored.push(randomNumber0to9);
          }
          const cpfStoredString = cpfStored.join('');
          let numberoBase = 10;
          let numberoBase2 = 11;
          let somaTotal = 0;
          let somaTotal2 = 0;
          let primeiroVerificador = 0;
          let segundoVerificador = 0;
          for (let repetidor = 0; repetidor < 11; repetidor++) {
              for (const contador of cpfStoredString[repetidor]) {
                  const multiplicador = Number(contador) * numberoBase;
                  numberoBase--;
                  somaTotal += multiplicador;
              }
              for (const contador2 of cpfStoredString[repetidor]) {
                  const multiplicador2 = Number(contador2) * numberoBase2;
                  numberoBase2--;
                  somaTotal2 += multiplicador2;
              }
              const valorDeVerificacao = somaTotal - Number(cpfStoredString[9]);
              const valorDeVerificacao2 = somaTotal2 - Number(cpfStoredString[10]);
              primeiroVerificador = 11 - (valorDeVerificacao % 11);
              segundoVerificador = 11 - (valorDeVerificacao2 % 11);
          }
          if (primeiroVerificador > 9) {
              primeiroVerificador = 0;
          }
          if (segundoVerificador > 9) {
              segundoVerificador = 0;
          }
          if (primeiroVerificador === Number(cpfStoredString[9]) && segundoVerificador === Number(cpfStoredString[10]) && cpfStoredString.charAt(0).repeat(11) !== cpfStoredString) {
              return cpfStoredString;
          }
          else {
              return this.generateCPF();
          }
      }
      // COMPANY FUNCTIONS =========================================================
      generateCompanyName() {
          const firstWords = ['Tecnologia', 'Global', 'Inovador', 'Digital', 'Criativo', 'Avançado', 'Ecológico', 'Futuro', 'Dinâmico', 'Estratégico', 'Inovação', 'Sustentável', 'Inteligente', 'Modernidade', 'Progresso', 'Transformação', 'Qualidade', 'Comunicação', 'Conectado', 'Energia'];
          const secondWords = ['Soluções', 'Sistemas', 'Empresas', 'Grupo', 'Serviços', 'Corp', 'Indústrias', 'Tecnologias', 'Inovações', 'Ventures', 'Parcerias', 'Produtos', 'Consultoria', 'Desenvolvimento', 'Logística', 'Comércio', 'Marketing', 'Pesquisa', 'Engenharia', 'Educação'];
          const randomFirstWord = firstWords[Math.floor(Math.random() * firstWords.length)];
          const randomSecondWord = secondWords[Math.floor(Math.random() * secondWords.length)];
          const randomNumber = Math.floor(Math.random() * 1000);
          const companyName = `${randomFirstWord} ${randomSecondWord} ${randomNumber}`;
          this.companyName = companyName;
          return companyName;
      }
      generateCompanyEmail(companyName) {
          const randomNum = Math.floor(Math.random() * 900) + 100;
          const email = (companyName ?? this.companyName).replace(/\s/g, '.').toLowerCase();
          const uniqueEmail = `${email}${randomNum}@gmail.com`;
          return uniqueEmail;
      }
      // PERSON FUNCTIONS ==========================================================
      generatePersonName() {
          const firstNames = ['Miguel', 'Sofia', 'Davi', 'Alice', 'Arthur', 'Julia', 'Pedro', 'Manuela', 'Gabriel', 'Laura', 'Bernardo', 'Luiza', 'Lucas', 'Valentina', 'Matheus', 'Giovanna', 'Rafael', 'Beatriz', 'Enzo', 'Maria Eduarda'];
          const lastNames = ['Silva', 'Santos', 'Oliveira', 'Pereira', 'Almeida', 'Fernandes', 'Ribeiro', 'Costa', 'Carvalho', 'Martins', 'Rodrigues', 'Nascimento', 'Lima', 'Araujo', 'Monteiro', 'Gomes', 'Barbosa', 'Cardoso', 'Correia', 'Dias'];
          const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const uniqueName = `${randomFirstName} ${randomLastName}`;
          this.personName = uniqueName;
          return uniqueName;
      }
      generatePersonEmail(name) {
          const randomNum = Math.floor(Math.random() * 900) + 100;
          const email = (name ?? this.personName).replace(/\s/g, '.').toLowerCase();
          const uniqueEmail = `${email}${randomNum}@gmail.com`;
          return uniqueEmail;
      }
      generatePersonUsername(name) {
          // prettier-ignore
          const initials = (name ?? this.personName).split(' ').map((part) => part.charAt(0)).join('').toLowerCase();
          const randomNum = Math.floor(Math.random() * 9000) + 1000;
          const uniqueUsername = `${initials}${randomNum}`;
          return uniqueUsername;
      }
      // GENERAL FUNCTIONS =========================================================
      removeNumbersFromString(str) {
          return str.replace(/[0-9]/g, '');
      }
      getOnlyNumbersFromString(str) {
          return str.replace(/\D+/g, '');
      }
      generateRandomNumberBetweenInterval(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      generateNRandomNumber(length) {
          const number = Math.floor(Math.random() * Math.pow(10, length)).toString();
          return number.padStart(length, '0');
      }
  }

  class AttacherUtils {
      configs;
      floatingEl;
      optionsEl;
      unbindEventsFn = () => { }; // eslint-disable-line
      constructor(configs) {
          this.configs = { ...CONFIGS, ...configs };
          this.floatingEl = null;
          this.optionsEl = null;
      }
      // PUBLIC METHODS ============================================================
      updateOptions(floatingOptions) {
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
          this.unbindEventsFn = () => { }; // eslint-disable-line
          this.floatingEl = null;
          this.optionsEl = null;
      }
      attach(floatingOptions) {
          const optionsEl = this.getOptionsEl(floatingOptions);
          const floatingEl = this.createFloatingHTML();
          const unbindEventsFn = this.atachFloatingToHTML(floatingEl, optionsEl);
          this.detectUrlChangesOnSpa(this.configs.onSpaRouteChange);
          this.floatingEl = floatingEl;
          this.optionsEl = optionsEl;
          this.unbindEventsFn = unbindEventsFn;
      }
      // PRIVATE METHODS ===========================================================
      detectUrlChangesOnSpa(cb) {
          let previousUrl = location.href;
          const observer = new MutationObserver(() => {
              if (previousUrl !== location.href) {
                  previousUrl = location.href;
                  cb(location.href);
              }
          });
          observer.observe(document, { subtree: true, childList: true });
      }
      logger(message, type = 'info') {
          if (!this.configs.debug) {
              return;
          }
          if (type === 'error')
              console.error(message);
          if (type === 'info')
              console.log(message);
      }
      getOptionsEl({ bodyOptions, headerOptions }) {
          const hasHeaderOptions = headerOptions && headerOptions.length > 0;
          const optionsContainer = document.createElement('div');
          optionsContainer.setAttribute('style', `display: none; position: absolute; bottom: 70px; right: 0; color: ${this.configs.colorScheme.secondary.text}; background-color: ${this.configs.colorScheme.secondary.background}; border-radius: 5px; border: 1px solid ${this.configs.colorScheme.secondary.border}; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); white-space: nowrap;`);
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
              bodyOptions.forEach((option, index) => {
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
      addTooltipToElement(element, description) {
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
      createFloatingHTML() {
          const floatingEl = document.createElement('div');
          floatingEl.setAttribute('style', `position: fixed; bottom: ${this.configs.floatingButton.bottom}; right: ${this.configs.floatingButton.right}; z-index: 9999;`);
          floatingEl.setAttribute('class', CONSTS.classes.floatingContainer);
          const button = document.createElement('button');
          button.setAttribute('class', CONSTS.classes.floatingButton);
          button.setAttribute('style', `border-radius: 50%; width: 50px; height: 50px; background-color: ${this.configs.colorScheme.primary.background}; color: ${this.configs.colorScheme.primary.text}; border: none; cursor: pointer; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;`);
          const svgIcon = document.createElement('img');
          svgIcon.src = this.configs.floatingButton.iconImage;
          svgIcon.setAttribute('style', `width: 24px; height: 24px; ${this.configs.floatingButton.iconColorCss}`);
          button.appendChild(svgIcon);
          floatingEl.appendChild(button);
          document.body.appendChild(floatingEl);
          return floatingEl;
      }
      atachFloatingToHTML(floatingEl, optionsContainer) {
          const toogleFloating = () => {
              if (optionsContainer.style.display === 'none' || optionsContainer.style.display === '') {
                  optionsContainer.style.display = 'block';
                  document.addEventListener('keydown', (event) => this.detectNumbersPress(event));
              }
              else {
                  optionsContainer.style.display = 'none';
                  document.removeEventListener('keydown', (event) => this.detectNumbersPress(event));
              }
          };
          const detectFloatingShortcut = (event) => {
              const isToogleFloatingShortcut = this.configs.floatingButton.shortcutFn(event);
              if (isToogleFloatingShortcut) {
                  this.logger('detected shortcut combination, toggling floating button');
                  toogleFloating();
              }
          };
          const detectClickOutside = (event) => {
              const floatingContainer = document.querySelector(`.${CONSTS.classes.floatingContainer}`);
              const optionsContainer = document.querySelector(`.${CONSTS.classes.optionsContainer}`);
              if (optionsContainer.style.display === 'block' && !floatingContainer.contains(event.target)) {
                  optionsContainer.style.display = 'none';
              }
          };
          // =========================================================================
          floatingEl.appendChild(optionsContainer);
          const button = document.querySelector(`.${CONSTS.classes.floatingButton}`);
          if (!button) {
              this.logger('did not find button element', 'error');
              return () => { }; // eslint-disable-line
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
      detectNumbersPress(event) {
          const optionsContainerEl = document.querySelector(`.${CONSTS.classes.optionsContainer}`);
          if (!optionsContainerEl || optionsContainerEl.style.display !== 'block') {
              return;
          }
          const isNumeric = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(event.key);
          if (!isNumeric) {
              return;
          }
          const optionEl = document.querySelector(`[data="key_${event.key}"]`);
          if (optionEl) {
              this.logger(`detected ${event.key} keypress, exec corresponding action`);
              optionEl.click();
          }
      }
  }

  function getClassMethods(instance) {
      const prototype = Object.getPrototypeOf(instance);
      const methodNames = Object.getOwnPropertyNames(prototype);
      const ignoredMethods = ['constructor', 'logger', 'click', 'typeOnInput', 'addTooltipToElement'];
      const mappedValues = methodNames
          .map((methodName) => {
          const method = Reflect.get(prototype, methodName);
          const parameterNames = method
              .toString()
              .match(/\(([^)]*)\)/)?.[1]
              .split(',')
              .map((param) => param.trim())
              .filter(Boolean) || [];
          return {
              name: methodName,
              parameters: parameterNames.join(', ')
          };
      })
          .filter((item) => ignoredMethods.includes(item.name) === false);
      return mappedValues;
  }
  function convertObjectArrayToObject(arr, key) {
      return arr.reduce((result, item) => {
          const { [key]: _omittedKey, ...rest } = item; // eslint-disable-line
          const keyValue = item[key];
          result[keyValue] = rest;
          return result;
      }, {});
  }
  function getClassDetailedMethods(instance) {
      const detailedMethods = getClassMethods(instance);
      const parsedClassMethods = convertObjectArrayToObject(detailedMethods, 'name');
      return parsedClassMethods;
  }
  const help = () => {
      console.log(`# METHODS =======================================================\n`);
      console.log('\nOther methods\n');
      console.table({ 'pageActionsAttacher.atach': { parameters: 'optionsArr' }, 'pageActionsAttacher.help': { parameters: '' } });
      console.log('\npageActionsAttacher.dataUtils\n');
      console.table(getClassDetailedMethods(new DataUtils()));
      console.log('\npageActionsAttacher.browserUtils\n');
      console.table(getClassDetailedMethods(new BrowserUtils()));
      console.log(`\n# PACKAGE INFO ==================================================\n\n`);
      console.log(`name        : ${CONSTS.libInfo.name}`);
      console.log(`version     : ${CONSTS.libInfo.version}`);
      console.log(`build_time  : ${CONSTS.libInfo.buildTime}`);
      console.log(`package link: ${CONSTS.libInfo.link}`);
      console.log('\n# CURRENT PAGE INPUT NAMES ======================================');
      Array.from(document.querySelectorAll('input')).forEach((el) => console.log(el.getAttribute('name')));
  };

  class PageActionsAttacher {
      configs;
      attacherUtils;
      VERSION = CONSTS.libInfo.version;
      BUILD_DATETIME = CONSTS.libInfo.buildTime;
      constructor(configs) {
          const finalConfigs = {
              ...CONFIGS,
              ...(configs ? configs : {}),
              colorScheme: {
                  ...CONFIGS.colorScheme,
                  ...(configs?.colorScheme ?? {})
              },
              floatingButton: {
                  ...CONFIGS.floatingButton,
                  ...(configs?.floatingButton ?? {})
              }
          };
          this.configs = finalConfigs;
          this.attacherUtils = new AttacherUtils(finalConfigs);
      }
      help() {
          help();
      }
      logger(message, type) {
          const finalType = type ?? 'info';
          if (!this.configs.debug) {
              return;
          }
          if (finalType === 'info')
              console.log(message);
          if (finalType === 'error')
              console.error(message);
      }
      attach(floatingOptions) {
          return this.attacherUtils.attach(floatingOptions);
      }
      updateOptions(floatingOptions) {
          return this.attacherUtils.updateOptions(floatingOptions);
      }
      detach() {
          return this.attacherUtils.detach();
      }
      dataUtils() {
          return new DataUtils();
      }
      browserUtils() {
          return new BrowserUtils(this.configs);
      }
  }

  return PageActionsAttacher;

}));
