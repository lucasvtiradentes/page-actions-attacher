const FormFillerLib = FormFillerAssistant;

if (!FormFillerLib) {
  console.log('FormFillerAssistant not found, make sure to build before test it!');
} else {
  main(FormFillerLib);
}

// ================================================================================================================

async function main(FormFiller) {
  const colorScheme = {
    primary: {
      background: '#4f07ad',
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
    right: '30px',
    bottom: '30px'
  };

  const runConfigs = {
    debug: true,
    typeDelay: 500
  };

  const formFiller = new FormFiller({ colorScheme, buttonConfigs, runConfigs });

  // ===========================================================================

  const options = [
    { name: 'show lib helper', action: () => formFiller.help() },
    { name: 'show advanced modal', action: toogleModal },
    { name: 'show simple modal', action: toogleSimpleModal },
    { name: 'show page input fields', action: () => Array.from(document.querySelectorAll('input')).forEach((el) => console.log(el.getAttribute('name'))) }
  ];

  const headerOption = [
    { icon: 'https://www.svgrepo.com/show/460136/update-alt.svg', action: () => alert(1) },
    { icon: 'https://www.svgrepo.com/show/403847/monkey-face.svg', action: () => window.open('chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=c84b1043-636c-416b-8b31-e843e818ee49+editor', '_blank') }
  ];

  formFiller.atach(options, headerOption);

  // ===========================================================================

  function toogleSimpleModal() {
    const { updateModalContent } = formFiller.browserUtils().getModal('Dados gerados');

    const modalHtml = '<p>HTML modal content</p>';
    const modalButtons = [
      {
        title: 'Confirm',
        action: () => alert('you have confirmed!')
      }
    ];

    updateModalContent(modalHtml, modalButtons);
  }

  let modalCount = 0;

  function toogleModal() {
    const modalStorageKey = 'modalData';
    modalCount = modalCount + 1;

    const generateData = (dt) => {
      const generatedData = {
        nome: dt.generatePersonName(),
        user_name: dt.generatePersonUsername(),
        email: dt.generatePersonEmail(),
        nome_empresa: dt.generateCompanyName(),
        cpf: dt.generateCPF(),
        cnpj: dt.generateCNPJ(),
        inscricao_estadual: dt.generateNRandomNumbers(5),
        telefone: dt.generateNRandomNumbers(8)
      };

      sessionStorage.setItem(modalStorageKey, JSON.stringify(generatedData));
      return generatedData;
    };

    const storageData = sessionStorage.getItem(modalStorageKey);
    const data = modalCount > 1 && storageData ? JSON.parse(storageData) : generateData(formFiller.dataUtils());

    const { updateModalContent, closeModal } = formFiller.browserUtils().getModal('Dados gerados');

    const getFinalHtmlContent = (dt) => {
      const items = [
        ['Name', dt.nome],
        ['Username', dt.user_name],
        ['Email', dt.nome_empresa],
        ['Cpf', dt.cpf],
        ['Cnpj', dt.cnpj],
        ['Inscricao estadual', dt.inscricao_estadual],
        ['Telefone', dt.telefone]
      ];
      const finalHTML = items.map((item) => `${formFiller.browserUtils().generateFormRow(item[0], item[1], closeModal)}`).join('');
      return finalHTML;
    };

    const regeneretadHtmlContent = () => getFinalHtmlContent(generateData(new FormFiller().dataUtils()));

    const modalButtons = [
      {
        title: 'Regenerate',
        action: () => updateModalContent(regeneretadHtmlContent(), modalButtons),
        exitAfterAction: false
      }
    ];

    const initialHTML = getFinalHtmlContent(data);

    updateModalContent(initialHTML, modalButtons);
  }
}
