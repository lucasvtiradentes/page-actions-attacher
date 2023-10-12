const typescript = require('rollup-plugin-typescript2');
const terser = require('@rollup/plugin-terser');

module.exports = [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'FormFillerAssistant'
    },
    plugins: [typescript()]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.min.js',
      format: 'umd',
      name: 'FormFillerAssistant'
    },
    plugins: [typescript(), terser()]
  }
];
