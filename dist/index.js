(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.FormFillerAssistant = {}));
})(this, (function (exports) { 'use strict';

  class DataUtils {
      constructor() {
          this.name = '';
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

  class DomUtils {
      delay(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
      }
      typeOnInputByElement(inputElement, text) {
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
                  inputElement.dispatchEvent(keyboardEvent);
              }
          }
      }
      typeOnInputBySelector(selector, text) {
          const inputElement = document.querySelector(selector);
          if (!inputElement) {
              return;
          }
          this.typeOnInputByElement(inputElement, text);
      }
      clickButtonByText(buttonText) {
          const allButtons = Array.from(document.querySelectorAll('button'));
          const elButton = allButtons.find((itemEl) => itemEl.innerText.search(buttonText) > -1);
          if (elButton) {
              console.log('Clickei no botao', buttonText);
              elButton.click();
          }
          else {
              console.log('Nao achou o botao: ', buttonText);
          }
      }
  }

  class FormFiller {
      constructor() {
          this.colorScheme = {
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
          this.classes = {
              floatingButton: 'floating_container',
              optionsContainer: 'options_container',
              modalContainer: 'modal_container'
          };
      }
      // PUBLIC METHODS ============================================================
      init(optArr) {
          const optionsEl = this.getOptionsEl(optArr);
          this.atachFloatingToHTML(optionsEl);
          document.addEventListener('click', (e) => {
              const floatingContainer = document.querySelector(`.${this.classes.floatingButton}`);
              const optionsContainer = document.querySelector(`.${this.classes.optionsContainer}`);
              if (optionsContainer.style.display === 'block' && !floatingContainer.contains(e.target)) {
                  optionsContainer.style.display = 'none';
              }
          });
      }
      showModal(title, htmlContent) {
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
          const closeModal = () => {
              const modalEl = document.querySelector(`.${this.classes.modalContainer}`);
              if (modalEl) {
                  document.body.removeChild(modalContainer);
                  document.removeEventListener('keydown', detectEskKeypress);
              }
          };
          modalContainer.addEventListener('click', (event) => {
              if (event.target === modalContainer) {
                  closeModal();
              }
          });
          confirmButton.addEventListener('click', closeModal);
          const detectEskKeypress = function (event) {
              if (event.key === 'Escape' || event.key === 'Esc' || event.key === "'") {
                  closeModal();
              }
          };
          document.addEventListener('keydown', detectEskKeypress);
          return modalContainer;
      }
      // PRIVATE METHODS ===========================================================
      getOptionsEl(optArr) {
          const optionsContainer = document.createElement('div');
          optionsContainer.setAttribute('style', `display: none; position: absolute; bottom: 70px; right: 0; color: ${this.colorScheme.secondary.text}; background-color: ${this.colorScheme.secondary.background}; border-radius: 5px; border: 1px solid ${this.colorScheme.secondary.border}; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); white-space: nowrap;`);
          optionsContainer.setAttribute('class', this.classes.optionsContainer);
          optArr.forEach((option, index) => {
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
      atachFloatingToHTML(optionsContainer) {
          const container = document.createElement('div');
          container.setAttribute('style', 'position: fixed; bottom: 70px; right: 30px; z-index: 9999;');
          container.setAttribute('class', this.classes.floatingButton);
          const button = document.createElement('button');
          button.setAttribute('style', `border-radius: 50%; width: 50px; height: 50px; background-color: ${this.colorScheme.primary.background}; color: ${this.colorScheme.primary.text}; border: none; cursor: pointer; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;`);
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
              }
              else {
                  optionsContainer.style.display = 'none';
                  document.removeEventListener('keydown', this.detectNumbersPress);
              }
          };
          button.addEventListener('click', toogleFloating);
          const detectCtrlSpace = function (event) {
              if (event.ctrlKey && event.code === 'Space') {
                  toogleFloating();
              }
          };
          document.addEventListener('keydown', detectCtrlSpace);
      }
      detectNumbersPress(event) {
          const optionsContainerEl = document.querySelector(`.${this.classes.optionsContainer}`);
          if (!optionsContainerEl || optionsContainerEl.style.display !== 'block') {
              return;
          }
          const isNumeric = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].includes(event.key);
          if (!isNumeric) {
              return;
          }
          const optionEl = document.querySelector(`[data="key_${event.key}"]`);
          if (optionEl) {
              optionEl.click();
          }
      }
  }

  exports.DataUtils = DataUtils;
  exports.DomUtils = DomUtils;
  exports.FormFiller = FormFiller;

}));
