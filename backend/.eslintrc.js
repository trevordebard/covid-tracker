module.exports = {
  extends: ['wesbos'],
  rules: {
    'no-console': 0,
    'no-use-before-define': 0,
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 120,
        tabWidth: 2,
      },
    ],
  },
};
