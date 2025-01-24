// stylelint.config.js
const sortOrderSmacss = require('stylelint-config-property-sort-order-smacss/generate');

module.exports = {
  plugins: ['stylelint-order'],
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-scss'
  ],
  rules: {
    'prettier/prettier': true,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'include',
          'mixin',
          'at-root',
          'extend',
          'if',
          'else',
          'for',
          'each',
          'use',
          'forward',
          'function',
          'return'
        ]
      }
    ],
    'no-descending-specificity': null,
    'comment-empty-line-before': null,
    'selector-list-comma-newline-after': 'always-multi-line',
    indentation: 2,
    'declaration-block-no-duplicate-properties': [
      true,
      {
        ignore: ['consecutive-duplicates']
      }
    ],
    'max-nesting-depth': [
      5,
      {
        ignore: ['pseudo-classes'],
        ignoreAtRules: ['media']
      }
    ],
    'value-keyword-case': [
      'lower',
      {
        ignoreKeywords: ['BlinkMacSystemFont']
      },
      {
        ignoreProperties: ['animation', 'font-family']
      }
    ],
    'selector-class-pattern': null,
    'rule-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'declaration-empty-line-before': null,
    'order/properties-order': [sortOrderSmacss({ order: 'flexible' })]
  }
};
