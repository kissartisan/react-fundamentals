"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

require("@testing-library/jest-dom/extend-expect");

var _react = require("@testing-library/react");

var _server = require("./server");

// for slower computers
(0, _react.configure)({
  asyncUtilTimeout: 4000
});
beforeAll(() => {
  jest.spyOn(console, 'info');
  console.info.mockImplementation(() => {});
});
afterAll(() => console.info.mockRestore());
beforeEach(() => console.info.mockClear()); // enable API mocking in test runs using the same request handlers
// as for the client-side mocking.

const backendFilePath = _path.default.join(process.cwd(), 'src/backend.js');

const hasBackend = _fs.default.existsSync(backendFilePath);

const backend = {
  handlers: [],
  onUnhandledRequest: 'error'
};

if (hasBackend) {
  // we do things this way to trick webpack into not realizing this is
  // a dynamic require (because we don't run this file with webpack, so who cares)
  // but we get warnings if we do a regular require here...
  // eslint-disable-next-line
  Object.assign(backend, module.require.call(module, backendFilePath));
}

const server = (0, _server.setup)(backend);
beforeAll(() => server.listen(backend));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());