(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FormFillerAssistant = factory());
})(this, (function () { 'use strict';

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
  const buttonConfigs = {
      iconImage: 'https://www.svgrepo.com/show/532994/plus.svg',
      iconColorCss: 'filter: invert(100%);',
      right: '30px',
      bottom: '30px'
  };
  const classes = {
      floatingButton: 'ffa_floating_container',
      optionsContainer: 'ffa_options_container',
      modalContainer: 'ffa_modal_container'
  };
  const libInfo = {
      name: 'FORM_FILLER_ASSISTANT',
      version: '1.6.2',
      buildTime: '15/10/2023 - 08:09:14',
      link: 'https://github.com/lucasvtiradentes/form_filler_assistant',
      temperMonkeyLink: 'https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo',
      initialScript: 'https://github.com/lucasvtiradentes/form_filler_assistant/dist/initial_temper_monkey_script.js'
  };
  const runConfigs = {
      debug: false,
      typeDelay: 0
  };
  const CONFIGS = {
      colorScheme,
      buttonConfigs,
      classes,
      libInfo,
      runConfigs
  };

  class DomUtils {
      colorScheme;
      runConfigs;
      constructor(configs) {
          this.colorScheme = { ...CONFIGS.colorScheme, ...(configs?.colorScheme ? configs?.colorScheme : {}) };
          this.runConfigs = { ...CONFIGS.runConfigs, ...(configs?.runConfigs ? configs?.runConfigs : {}) };
      }
      // JS UTILS ==================================================================
      async delay(milliseconds, ignoreLog) {
          if (!ignoreLog) {
              this.logger(`waiting: ${milliseconds}`);
          }
          return new Promise((resolve) => setTimeout(resolve, milliseconds));
      }
      getStorageItem(key) {
          return sessionStorage.getItem(key);
      }
      setStorageItem(key, value) {
          sessionStorage.setItem(key, value);
      }
      // GET ELEMENT FUNCTIONS =====================================================
      getElementByTagText(tag, textToFind, itemIndex) {
          const finalIndex = 0 ;
          const allElements = Array.from(document.querySelectorAll(tag));
          const tagItems = allElements.filter((itemEl) => itemEl.innerText.search(textToFind) > -1);
          const elTag = tagItems.length === 0 ? null : tagItems[finalIndex];
          if (!elTag) {
              this.logger(`not found element: [${tag} | ${textToFind} | ${finalIndex}]`, 'error');
          }
          return elTag;
      }
      getElementByAttributeValue(tag, attribute, valueAttribute, itemIndex) {
          const finalIndex = 0 ;
          const allElements = Array.from(document.querySelectorAll(tag));
          const tagItems = allElements.filter((itemEl) => itemEl.getAttribute(attribute) === valueAttribute);
          const elTag = tagItems.length === 0 ? null : tagItems[finalIndex];
          if (!elTag) {
              this.logger(`not found element: [${tag} | ${attribute} | ${valueAttribute} | ${finalIndex}]`, 'error');
          }
          return elTag;
      }
      getElementBySelector(selector) {
          const inputElement = document.querySelector(selector);
          if (!inputElement) {
              this.logger(`not found element by selector: [${selector}]`, 'error');
          }
          return inputElement;
      }
      // TYPE FUNCTIONS ============================================================
      async typeOnInput(inputElement, text) {
          this.logger(`typing: ${text}`);
          for (const char of text) {
              const inputEvent = new Event('input', { bubbles: true });
              const inputPropertyDescriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
              if (inputPropertyDescriptor) {
                  const inputSetValue = inputPropertyDescriptor.set;
                  inputSetValue && inputSetValue.call(inputElement, inputElement.value + char);
                  inputElement.dispatchEvent(inputEvent);
                  const keyboardEvent = new KeyboardEvent('keydown', {
                      key: char,
                      code: `Key${char.toUpperCase()}`,
                      bubbles: true,
                      cancelable: true
                  });
                  await this.delay(this.runConfigs.typeDelay, true);
                  inputElement.dispatchEvent(keyboardEvent);
              }
          }
      }
      async typeOnInputByElement(inputElement, text) {
          if (!inputElement) {
              this.logger(`not found element to type : ${text}`, 'error');
              return;
          }
          this.logger(`type on element [${inputElement}]`);
          await this.typeOnInput(inputElement, text);
      }
      async typeOnInputBySelector(selector, text) {
          const inputElement = document.querySelector(selector);
          if (!inputElement) {
              return;
          }
          this.logger(`type on element by selector [${selector}]`);
          await this.typeOnInput(inputElement, text);
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
      clickBySelector(selector) {
          const inputElement = this.getElementBySelector(selector);
          if (!inputElement) {
              return;
          }
          this.logger(`clicked element by selector: [${selector}]`);
          this.click(inputElement);
      }
      clickTagByText(tag, textToFind, itemIndex) {
          const finalIndex = 0 ;
          const elTag = this.getElementByTagText(tag, textToFind, finalIndex);
          if (!elTag) {
              return;
          }
          this.logger(`clicked element by tag text: [${tag} | ${textToFind} | ${finalIndex}]`);
          elTag.click();
      }
      clickTagByAttributeValue(tag, attribute, valueAttribute, itemIndex) {
          const finalIndex = 0 ;
          const elTag = this.getElementByAttributeValue(tag, attribute, valueAttribute, finalIndex);
          if (!elTag) {
              return;
          }
          this.logger(`clicked element by attribute value: [${tag} | ${attribute} | ${valueAttribute} | ${finalIndex}]`);
          elTag.click();
      }
      // HTML UTILS ================================================================
      generateFormRow(name, value, onAfterClickAction) {
          const onClickAction = `navigator.clipboard.writeText('${value}'); ${onAfterClickAction ? `(${onAfterClickAction})()` : ''}`;
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
      getModal(title) {
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
          const updateModalContent = (htmlContent, buttonsArr) => {
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
                  modalSelector = `.${CONFIGS.classes.modalContainer}`;
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
      // PRIVATE METHODS ===========================================================
      logger(message, type = 'info') {
          if (!this.runConfigs.debug) {
              return;
          }
          if (type === 'error')
              console.error(message);
          if (type === 'info')
              console.log(message);
      }
  }

  class DataUtils {
      name = '';
      constructor() {
          this.name = this.generatePersonName();
      }
      // NUMBER FUNCTIONS ==========================================================
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
      generateNRandomNumbers(length) {
          const number = Math.floor(Math.random() * Math.pow(10, length)).toString();
          return number.padStart(length, '0');
      }
      // NAME FUNCTIONS ============================================================
      generateCompanyName() {
          const firstWords = ['Tecnologia', 'Global', 'Inovador', 'Digital', 'Criativo', 'Avançado', 'Ecológico', 'Futuro', 'Dinâmico', 'Estratégico', 'Inovação', 'Sustentável', 'Inteligente', 'Modernidade', 'Progresso', 'Transformação', 'Qualidade', 'Comunicação', 'Conectado', 'Energia'];
          const secondWords = ['Soluções', 'Sistemas', 'Empresas', 'Grupo', 'Serviços', 'Corp', 'Indústrias', 'Tecnologias', 'Inovações', 'Ventures', 'Parcerias', 'Produtos', 'Consultoria', 'Desenvolvimento', 'Logística', 'Comércio', 'Marketing', 'Pesquisa', 'Engenharia', 'Educação'];
          const randomFirstWord = firstWords[Math.floor(Math.random() * firstWords.length)];
          const randomSecondWord = secondWords[Math.floor(Math.random() * secondWords.length)];
          const randomNumber = Math.floor(Math.random() * 1000);
          const companyName = `${randomFirstWord} ${randomSecondWord} ${randomNumber}`;
          return companyName;
      }
      generatePersonName() {
          const firstNames = ['Miguel', 'Sofia', 'Davi', 'Alice', 'Arthur', 'Julia', 'Pedro', 'Manuela', 'Gabriel', 'Laura', 'Bernardo', 'Luiza', 'Lucas', 'Valentina', 'Matheus', 'Giovanna', 'Rafael', 'Beatriz', 'Enzo', 'Maria Eduarda'];
          const lastNames = ['Silva', 'Santos', 'Oliveira', 'Pereira', 'Almeida', 'Fernandes', 'Ribeiro', 'Costa', 'Carvalho', 'Martins', 'Rodrigues', 'Nascimento', 'Lima', 'Araújo', 'Monteiro', 'Gomes', 'Barbosa', 'Cardoso', 'Correia', 'Dias'];
          const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          const uniqueName = `${randomFirstName} ${randomLastName}`;
          this.name = uniqueName;
          return uniqueName;
      }
      generatePersonEmail() {
          const randomNum = Math.floor(Math.random() * 900) + 100;
          const email = this.name.replace(/\s/g, '.').toLowerCase();
          const uniqueEmail = `${email}${randomNum}@example.com`;
          return uniqueEmail;
      }
      generatePersonUsername() {
          const initials = this.name
              .split(' ')
              .map((part) => part.charAt(0))
              .join('')
              .toLowerCase();
          const randomNum = Math.floor(Math.random() * 9000) + 1000;
          const uniqueUsername = `${initials}${randomNum}`;
          return uniqueUsername;
      }
  }

  class FormFiller {
      colorScheme;
      buttonConfigs;
      runConfigs;
      constructor(configs) {
          this.colorScheme = { ...CONFIGS.colorScheme, ...(configs?.colorScheme ? configs?.colorScheme : {}) };
          this.buttonConfigs = { ...CONFIGS.buttonConfigs, ...(configs?.buttonConfigs ? configs?.buttonConfigs : {}) };
          this.runConfigs = { ...CONFIGS.runConfigs, ...(configs?.runConfigs ? configs?.runConfigs : {}) };
      }
      // PUBLIC METHODS ============================================================
      atach(optionsArr, headerOptions) {
          const optionsEl = this.getOptionsEl(optionsArr, headerOptions);
          this.atachFloatingToHTML(optionsEl);
          document.addEventListener('click', (e) => {
              const floatingContainer = document.querySelector(`.${CONFIGS.classes.floatingButton}`);
              const optionsContainer = document.querySelector(`.${CONFIGS.classes.optionsContainer}`);
              if (optionsContainer.style.display === 'block' && !floatingContainer.contains(e.target)) {
                  optionsContainer.style.display = 'none';
              }
          });
      }
      // PRIVATE METHODS ===========================================================
      logger(message, type = 'info') {
          if (!this.runConfigs.debug) {
              return;
          }
          if (type === 'error')
              console.error(message);
          if (type === 'info')
              console.log(message);
      }
      getOptionsEl(optionsArr, headerOptions) {
          const hasHeaderOptions = headerOptions && headerOptions.length > 0;
          const optionsContainer = document.createElement('div');
          optionsContainer.setAttribute('style', `display: none; position: absolute; bottom: 70px; right: 0; color: ${this.colorScheme.secondary.text}; background-color: ${this.colorScheme.secondary.background}; border-radius: 5px; border: 1px solid ${this.colorScheme.secondary.border}; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); white-space: nowrap;`);
          optionsContainer.setAttribute('class', CONFIGS.classes.optionsContainer);
          // add header to options menu ==============================================
          const headerDiv = document.createElement('div');
          headerDiv.setAttribute('style', `width: 100%; display: grid; padding-top: 5px; grid-template-columns: ${hasHeaderOptions ? '1fr 2fr' : '1fr 1fr'};`);
          const versionDiv = document.createElement('div');
          versionDiv.textContent = `V${CONFIGS.libInfo.version}`;
          versionDiv.setAttribute('style', `display: flex; align-items: center; justify-content: center; font-size: 12px; color: ${this.colorScheme.primary.background}; cursor: pointer;`);
          versionDiv.addEventListener('click', () => {
              optionsContainer.style.display = 'none';
              window.open(`${CONFIGS.libInfo.link}/releases/tag/v${CONFIGS.libInfo.version}`, '_blank');
          });
          headerDiv.appendChild(versionDiv);
          const actionsDiv = document.createElement('div');
          actionsDiv.setAttribute('style', `display: flex; align-items: center; justify-content: space-around;`);
          const githubIcon = document.createElement('img');
          githubIcon.src = 'https://www.svgrepo.com/show/512317/github-142.svg';
          githubIcon.setAttribute('style', `width: 18px; height: 18px; cursor: pointer;`);
          githubIcon.addEventListener('click', () => {
              optionsContainer.style.display = 'none';
              window.open(CONFIGS.libInfo.link, '_blank');
          });
          actionsDiv.appendChild(githubIcon);
          if (hasHeaderOptions) {
              headerOptions.forEach((item) => {
                  const updateIcon = document.createElement('img');
                  updateIcon.src = item.icon;
                  updateIcon.setAttribute('style', `width: 20px; height: 20px; cursor: pointer; ${item.cssStyle ?? ''}`);
                  updateIcon.addEventListener('click', () => {
                      optionsContainer.style.display = 'none';
                      item.action();
                  });
                  actionsDiv.appendChild(updateIcon);
              });
          }
          headerDiv.appendChild(actionsDiv);
          optionsContainer.appendChild(headerDiv);
          // divider div =============================================================
          const dividerDiv = document.createElement('div');
          dividerDiv.setAttribute('style', `border-top: 1px solid ${this.colorScheme.secondary.border}; margin-top: 8px;`);
          optionsContainer.appendChild(dividerDiv);
          // add options =============================================================
          optionsArr.forEach((option, index) => {
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
      atachFloatingToHTML(optionsContainer) {
          const container = document.createElement('div');
          container.setAttribute('style', `position: fixed; bottom: ${this.buttonConfigs.bottom}; right: ${this.buttonConfigs.right}; z-index: 9999;`);
          container.setAttribute('class', CONFIGS.classes.floatingButton);
          const button = document.createElement('button');
          button.setAttribute('style', `border-radius: 50%; width: 50px; height: 50px; background-color: ${this.colorScheme.primary.background}; color: ${this.colorScheme.primary.text}; border: none; cursor: pointer; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;`);
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
              }
              else {
                  optionsContainer.style.display = 'none';
                  document.removeEventListener('keydown', (event) => this.detectNumbersPress(event));
              }
          };
          button.addEventListener('click', toogleFloating);
          document.addEventListener('keydown', (event) => {
              if ((event.ctrlKey && event.code === 'Space') || (event.altKey && event.code === 'Space')) {
                  this.logger('detected ctrl+space or alt+space, toggling floating button');
                  toogleFloating();
              }
          });
      }
      detectNumbersPress(event) {
          const optionsContainerEl = document.querySelector(`.${CONFIGS.classes.optionsContainer}`);
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
          .filter((item) => ['constructor', 'logger'].includes(item.name) === false);
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
      console.table({ 'formFiller.atach': { parameters: 'optionsArr' }, 'formFiller.help': { parameters: '' } });
      console.log('\nformFiller.dataUtils\n');
      console.table(getClassDetailedMethods(new DataUtils()));
      console.log('\nformFiller.browserUtils\n');
      console.table(getClassDetailedMethods(new DomUtils()));
      console.log(`\n# PACKAGE INFO ==================================================\n\n`);
      console.log(`name        : ${CONFIGS.libInfo.name}`);
      console.log(`version     : ${CONFIGS.libInfo.version}`);
      console.log(`build_time  : ${CONFIGS.libInfo.buildTime}`);
      console.log(`package link: ${CONFIGS.libInfo.link}`);
  };

  class FormFillerAssistant {
      colorScheme;
      buttonConfigs;
      runConfigs;
      constructor(configs) {
          this.colorScheme = { ...CONFIGS.colorScheme, ...(configs?.colorScheme ? configs?.colorScheme : {}) };
          this.buttonConfigs = { ...CONFIGS.buttonConfigs, ...(configs?.buttonConfigs ? configs?.buttonConfigs : {}) };
          this.runConfigs = { ...CONFIGS.runConfigs, ...(configs?.runConfigs ? configs?.runConfigs : {}) };
      }
      VERSION = CONFIGS.libInfo.version;
      BUILD_DATETIME = CONFIGS.libInfo.buildTime;
      help = help;
      atach(options, headerOptions) {
          new FormFiller({ colorScheme: this.colorScheme, runConfigs: this.runConfigs, buttonConfigs: this.buttonConfigs }).atach(options, headerOptions);
      }
      browserUtils() {
          return new DomUtils({ colorScheme: this.colorScheme, runConfigs: this.runConfigs });
      }
      dataUtils() {
          return new DataUtils();
      }
  }

  return FormFillerAssistant;

}));
