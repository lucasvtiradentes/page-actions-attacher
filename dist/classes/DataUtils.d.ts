export default class DataUtils {
    private name;
    constructor();
    generateCNPJ(): string;
    generateCPF(): string;
    generateCompanyName(): string;
    generatePersonName(): string;
    generatePersonEmail(): string;
    generatePersonUsername(): string;
    removeNumbersFromString(str: string): string;
    getOnlyNumbersFromString(str: string): string;
    generateRandomNumberBetweenInterval(min: number, max: number): number;
    generateNRandomNumber(length: number): string;
}
