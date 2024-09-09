const { defineConfig } = require('@vue/cli-service')
module.exports = {
  pages: {
    plateauAttaque: {
      entry: 'src/main-plateauAttaque.js',
      template: 'public/plateauAttaque.html',
      filename: 'plateauAttaque.html',
    },
    plateauDefense: {
      entry: 'src/main-plateauDefense.js',
      template: 'public/plateauDefense.html',
      filename: 'plateauDefense.html',
    },
  },
};

