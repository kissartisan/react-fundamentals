"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alfredTip = alfredTip;

var _chalk = _interopRequireDefault(require("chalk"));

function alfredTip(shouldThrow, tip) {
  if (typeof shouldThrow === 'function') {
    try {
      shouldThrow = shouldThrow();
    } catch {
      shouldThrow = true;
    }
  }

  if (!shouldThrow) return;
  const error = new Error(_chalk.default.red(`🚨 ${tip}`)); // get rid of the stack to avoid the noisy codeframe

  error.stack = '';
  throw error;
}