import { readFileSync, writeFileSync, existsSync } from 'fs';
import packageJson from '../package.json';

function updateFormFillerAssistantVersion(filePath: string, newVersion: string): void {
  if (existsSync(filePath)) {
    let fileContent = readFileSync(filePath, 'utf8');
    const versionRegex = /formFillerAssistantVersion:\s*'([\d.]+)'/;
    fileContent = fileContent.replace(versionRegex, `formFillerAssistantVersion: '${newVersion}'`);
    writeFileSync(filePath, fileContent, 'utf8');
    console.log(`updated version to ${newVersion} [${filePath}]`);
  }
}

const filesToUpdate = ['./examples/1_basic.js', './examples/2_normal.js', './examples/3_advanced.js'];

filesToUpdate.forEach((item) => updateFormFillerAssistantVersion(item, packageJson.version));
