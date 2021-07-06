/* eslint-disable no-global-assign, import/no-unassigned-import */
require('dotenv').config()
require('babel-polyfill')
require = require('esm')(module)

module.exports = require('./main')
