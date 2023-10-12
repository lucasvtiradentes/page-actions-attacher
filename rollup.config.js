const typescript = require('rollup-plugin-typescript2');
const terser = require('@rollup/plugin-terser');

module.exports = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'FormFiller'
  },
  plugins: [typescript(), terser()]
};
