import { readFileSync, writeFileSync, existsSync } from 'fs';
import packageJson from '../package.json';

function updateFormFillerAssistantVersion(filePath: string, newVersion: string): void {
  if (existsSync(filePath)) {
    let fileContent = readFileSync(filePath, 'utf8');
    const versionRegex = /version:\s*'([\d.]+)'/;
    fileContent = fileContent.replace(versionRegex, `version: '${newVersion}'`);
    writeFileSync(filePath, fileContent, 'utf8');
    console.log(`updated version to ${newVersion} [${filePath}]`);
  }
}

// prettier-ignore
const filesToUpdate = [
  './examples/1_basic.js',
  './examples/2_basic_with_custom_configs.js',
  './examples/3_normal_with_modal.js',
  './examples/4_advanced.js'
];

filesToUpdate.forEach((item) => updateFormFillerAssistantVersion(item, packageJson.version));
