"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeKCDWorkshopApp = makeKCDWorkshopApp;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _history = require("history");

var _server = require("./server");

var _reactApp = require("./react-app");

const styleTag = document.createElement('style');
const requiredStyles = ["/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}main{display:block}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}[hidden],template{display:none}", "body{font-family:Century Gothic,Futura,sans-serif}*,:after,:before{box-sizing:border-box}hr{opacity:.5;border:none;height:1px;max-width:100%;margin-top:30px;margin-bottom:30px}", // this will happen when running the regular app and embedding the example
// in an iframe.
window.frameElement ? `#root{display:grid;place-items:center;height:100vh;}` : ''].join('\n');
styleTag.appendChild(document.createTextNode(requiredStyles));
document.head.prepend(styleTag);
const fillScreenCenter = `padding:30px;min-height:100vh;display:grid;align-items:center;justify-content:center;`;
const originalDocumentElement = document.documentElement;

function makeKCDWorkshopApp({
  imports,
  filesInfo,
  projectTitle,
  backend,
  options = {},
  ...otherWorkshopOptions
}) {
  // if I we don't do this then HMR can sometimes call this function again
  // which would result in the app getting mounted multiple times.
  const rootEl = document.getElementById('root');
  if (rootEl) rootEl.innerHTML = '';
  const lazyComponents = {};
  const componentExtensions = ['.js', '.md', '.mdx', '.tsx', '.ts'];

  for (const {
    ext,
    filePath
  } of filesInfo) {
    if (componentExtensions.includes(ext)) {
      lazyComponents[filePath] = /*#__PURE__*/_react.default.lazy(imports[filePath]);
    }
  }

  if (backend) {
    const {
      handlers,
      quiet = true,
      serviceWorker = {
        url: '/mockServiceWorker.js'
      },
      ...rest
    } = backend;
    const server = (0, _server.setup)({
      handlers
    });
    server.start({
      quiet,
      serviceWorker,
      ...rest
    });
  }

  const history = (0, _history.createBrowserHistory)();
  let previousLocation = history.location;
  let previousIsIsolated = null;

  function render(ui, el) {
    if (options.concurrentMode) {
      const root = (_reactDom.default.unstable_createRoot || _reactDom.default.createRoot)(el);

      root.render(ui);
      return function () {
        root.unmount();
      };
    } else {
      _reactDom.default.render(ui, el);

      return function () {
        _reactDom.default.unmountComponentAtNode(el);
      };
    }
  }

  function escapeForClassList(name) {
    // classList methods don't allow space or `/` characters
    return encodeURIComponent(name.replace(/\//g, '_'));
  }

  function handleLocationChange(location = history.location) {
    const {
      pathname
    } = location; // add location pathname to classList of the body

    document.body.classList.remove(escapeForClassList(previousLocation.pathname));
    document.body.classList.add(escapeForClassList(pathname)); // set the title to have info for the exercise

    const isIsolated = pathname.startsWith('/isolated');
    let info;

    if (isIsolated) {
      const filePath = pathname.replace('/isolated', 'src');
      info = filesInfo.find(i => i.filePath === filePath);
    } else {
      const number = Number(pathname.split('/').slice(-1)[0]);
      info = filesInfo.find(i => i.type === 'instruction' && i.number === number);
    }

    if (isIsolated && !info) {
      document.body.innerHTML = `
        <div style="${fillScreenCenter}">
          <div>
            Sorry... nothing here. To open one of the exercises, go to
            <code>\`/exerciseNumber\`</code>, for example:
            <a href="/1"><code>/1</code></a>
          </div>
        </div>
      `;
      return;
    } // I honestly have no clue why, but there appears to be some kind of
    // race condition here with the title. It seems to get reset to the
    // title that's defined in the index.html after we set it :shrugs:


    setTimeout(() => {
      document.title = [info ? [info.number ? `${info.number}. ` : '', info.title || info.filename].join('') : null, projectTitle].filter(Boolean).join(' | ');
    }, 20);

    if (isIsolated) {
      renderIsolated(imports[info.filePath]);
    } else if (previousIsIsolated !== isIsolated) {
      // if we aren't going from isolated to the app, then we don't need
      // to bother rendering react anew. The app will handle that.
      renderReact();
    }

    previousLocation = location;
    previousIsIsolated = isIsolated;
  }

  let unmount;

  function renderIsolated(isolatedModuleImport) {
    unmount == null ? void 0 : unmount(document.getElementById('root'));
    isolatedModuleImport().then(async ({
      default: defaultExport
    }) => {
      if (history.location !== previousLocation) {
        // locaiton has changed while we were getting the module
        // so don't bother doing anything... Let the next event handler
        // deal with it
        return;
      }

      if (typeof defaultExport === 'function') {
        // regular react component.
        unmount = render( /*#__PURE__*/_react.default.createElement(defaultExport), document.getElementById('root'));
      } else if (typeof defaultExport === 'string') {
        // HTML file
        const domParser = new DOMParser();
        const newDocument = domParser.parseFromString(defaultExport, 'text/html');
        document.documentElement.replaceWith(newDocument.documentElement); // to get all the scripts to actually run, you have to create new script
        // elements, and no, cloneElement doesn't work unfortunately.
        // Apparently, scripts will only get loaded/run if you use createElement.

        const scripts = Array.from(document.querySelectorAll('script'));
        const loadingScriptsQueue = [];

        for (const script of scripts) {
          // if we're dealing with an inline script, we need to wait for all other
          // scripts to finish loading before we run it
          if (!script.hasAttribute('src')) {
            // eslint-disable-next-line no-await-in-loop
            await Promise.all(loadingScriptsQueue);
          } // replace the script


          const newScript = document.createElement('script');

          for (const attrName of script.getAttributeNames()) {
            newScript.setAttribute(attrName, script.getAttribute(attrName));
          }

          newScript.innerHTML = script.innerHTML;
          script.parentNode.insertBefore(newScript, script);
          script.parentNode.removeChild(script); // if the new script has a src, add it to the queue

          if (script.hasAttribute('src')) {
            loadingScriptsQueue.push(new Promise(resolve => {
              newScript.onload = resolve;
            }));
          }
        } // now make sure all src scripts are loaded before continuing


        await Promise.all(loadingScriptsQueue); // Babel will call this when the DOMContentLoaded event fires
        // but because the content has already loaded, that event will never
        // fire, so we'll run it ourselves

        if (window.Babel) {
          window.Babel.transformScriptTags();
        }
      } // otherwise we'll just expect that the file ran the thing it was supposed
      // to run and doesn't need any help.

    });
  }

  function renderReact() {
    if (document.documentElement !== originalDocumentElement) {
      document.documentElement.replaceWith(originalDocumentElement);
    }

    unmount = (0, _reactApp.renderReactApp)({
      history,
      projectTitle,
      filesInfo,
      lazyComponents,
      imports,
      options,
      render,
      ...otherWorkshopOptions
    });
  }

  history.listen(handleLocationChange); // kick it off to get us started

  handleLocationChange();
}
/*
eslint
  react/prop-types: "off",
  babel/no-unused-expressions: "off",
*/