export default class DataUtils {
    private personName;
    private companyName;
    generateCNPJ(): string;
    generateCPF(): string;
    generateCompanyName(): string;
    generateCompanyEmail(companyName?: string): string;
    generatePersonName(): string;
    generatePersonEmail(name?: string): string;
    generatePersonUsername(name?: string): string;
    removeNumbersFromString(str: string): string;
    getOnlyNumbersFromString(str: string): string;
    generateRandomNumberBetweenInterval(min: number, max: number): number;
    generateNRandomNumber(length: number): string;
}
