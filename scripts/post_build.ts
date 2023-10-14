import { readFileSync, writeFileSync, existsSync } from 'fs';
import packageJson from '../package.json';

function updateFormFillerAssistantVersion(filePath: string, newVersion: string): void {
  if (existsSync(filePath)) {
    let fileContent = readFileSync(filePath, 'utf8');
    const versionRegex = /formFillerAssistantVersion:\s*'([\d.]+)'/;
    fileContent = fileContent.replace(versionRegex, `formFillerAssistantVersion: '${newVersion}'`);
    writeFileSync(filePath, fileContent, 'utf8');
    console.log(`updated ${filePath} to ${newVersion}`);
  }
}

updateFormFillerAssistantVersion('./examples/1_basic.js', packageJson.version);
updateFormFillerAssistantVersion('./examples/2_normal.js', packageJson.version);
updateFormFillerAssistantVersion('./examples/3_advanced.js', packageJson.version);
