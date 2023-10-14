export default class DataUtils {
  private name = '';

  constructor() {
    this.name = this.generatePersonName();
  }

  // NUMBER FUNCTIONS ==========================================================

  generateCNPJ(): string {
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

    const calculateFirstVerifier = (cnpjBase: number[]) => {
      const weight = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += cnpjBase[i] * weight[i];
      }
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const calculateSecondVerifier = (cnpjBase: number[], firstVerifier: number) => {
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

  generateCPF(): string {
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
    } else {
      return this.generateCPF();
    }
  }

  generateNRandomNumbers(length: number) {
    const number = Math.floor(Math.random() * Math.pow(10, length)).toString();
    return number.padStart(length, '0');
  }

  // NAME FUNCTIONS ============================================================

  generateCompanyName(): string {
    const firstWords = ['Tecnologia', 'Global', 'Inovador', 'Digital', 'Criativo', 'Avançado', 'Ecológico', 'Futuro', 'Dinâmico', 'Estratégico', 'Inovação', 'Sustentável', 'Inteligente', 'Modernidade', 'Progresso', 'Transformação', 'Qualidade', 'Comunicação', 'Conectado', 'Energia'];
    const secondWords = ['Soluções', 'Sistemas', 'Empresas', 'Grupo', 'Serviços', 'Corp', 'Indústrias', 'Tecnologias', 'Inovações', 'Ventures', 'Parcerias', 'Produtos', 'Consultoria', 'Desenvolvimento', 'Logística', 'Comércio', 'Marketing', 'Pesquisa', 'Engenharia', 'Educação'];

    const randomFirstWord = firstWords[Math.floor(Math.random() * firstWords.length)];
    const randomSecondWord = secondWords[Math.floor(Math.random() * secondWords.length)];
    const randomNumber = Math.floor(Math.random() * 1000);

    const companyName = `${randomFirstWord} ${randomSecondWord} ${randomNumber}`;

    return companyName;
  }

  generatePersonName(): string {
    const firstNames = ['Miguel', 'Sofia', 'Davi', 'Alice', 'Arthur', 'Julia', 'Pedro', 'Manuela', 'Gabriel', 'Laura', 'Bernardo', 'Luiza', 'Lucas', 'Valentina', 'Matheus', 'Giovanna', 'Rafael', 'Beatriz', 'Enzo', 'Maria Eduarda'];

    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Pereira', 'Almeida', 'Fernandes', 'Ribeiro', 'Costa', 'Carvalho', 'Martins', 'Rodrigues', 'Nascimento', 'Lima', 'Araújo', 'Monteiro', 'Gomes', 'Barbosa', 'Cardoso', 'Correia', 'Dias'];

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const uniqueName = `${randomFirstName} ${randomLastName}`;

    this.name = uniqueName;

    return uniqueName;
  }

  generatePersonEmail(): string {
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const email = this.name.replace(/\s/g, '.').toLowerCase();
    const uniqueEmail = `${email}${randomNum}@example.com`;
    return uniqueEmail;
  }

  generatePersonUsername(): string {
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
