"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;

var _core = require("@emotion/core");

require("@reach/tabs/styles.css");

require("@reach/tooltip/styles.css");

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _fa = require("react-icons/fa");

var _tooltip = require("@reach/tooltip");

var _tabs = require("@reach/tabs");

var colors = _interopRequireWildcard(require("../styles/colors"));

/** @jsx jsx */
const isLsKey = name => name.startsWith(`__react_workshop_app`);

const getKey = name => `__react_workshop_app_${name}__`;

function install() {
  const requireDevToolsLocal = require.context('./', false, /dev-tools\.local\.js/);

  const local = requireDevToolsLocal.keys()[0];

  if (local) {
    requireDevToolsLocal(local);
  }

  function DevTools() {
    const rootRef = _react.default.useRef();

    const [hovering, setHovering] = _react.default.useState(false);

    const [persist, setPersist] = useLocalStorageState(getKey('devtools_persist'), false);
    const [tabIndex, setTabIndex] = useLocalStorageState(getKey('devtools_tab_index'), 0);
    const show = persist || hovering;

    _react.default.useEffect(() => {
      function updateHoverState(event) {
        var _rootRef$current$cont, _rootRef$current;

        setHovering((_rootRef$current$cont = (_rootRef$current = rootRef.current) == null ? void 0 : _rootRef$current.contains(event.target)) != null ? _rootRef$current$cont : false);
      }

      document.addEventListener('mousemove', updateHoverState);
      return () => {
        document.removeEventListener('mousemove', updateHoverState);
      };
    }, []); // eslint-disable-next-line consistent-return


    _react.default.useEffect(() => {
      if (hovering) {
        const iframes = document.querySelectorAll('iframe');

        for (const iframe of iframes) {
          iframe.style.pointerEvents = 'none';
        }

        return () => {
          for (const iframe of iframes) {
            iframe.style.pointerEvents = '';
          }
        };
      }
    }, [hovering]);

    return (0, _core.jsx)("div", {
      css: {
        position: 'fixed',
        zIndex: 20,
        bottom: -15,
        left: 0,
        right: 0,
        width: show ? '100%' : 0,
        transition: 'all 0.3s',
        label: {
          margin: 0,
          color: 'rgb(216, 221, 227)'
        },
        'input, select': {
          background: 'rgb(20, 36, 55)',
          border: '2px solid rgb(28, 46, 68)',
          borderRadius: 5,
          color: 'white',
          fontWeight: '600',
          padding: '5px',
          '::placeholder': {
            color: 'rgba(255,255,255,0.3)'
          },
          ':focus': {
            outlineColor: colors.indigo,
            borderColor: colors.indigo,
            outline: '1px'
          }
        },
        button: {
          cursor: 'pointer'
        },
        'button:not([data-reach-tab])': {
          borderRadius: 5,
          background: colors.indigo,
          ':hover': {
            background: colors.indigoDarken10
          },
          border: 0,
          color: colors.gray
        },
        '[data-reach-tab]': {
          border: 0,
          ':focus': {
            outline: 'none'
          }
        },
        '[data-reach-tab][data-selected]': {
          background: 'rgb(11, 21, 33)',
          borderBottom: '3px solid white',
          marginBottom: -3
        }
      }
    }, (0, _core.jsx)("div", {
      ref: rootRef,
      css: [{
        background: 'rgb(11, 21, 33)',
        opacity: '0.6',
        color: 'white',
        boxSizing: 'content-box',
        height: '60px',
        width: '68px',
        transition: 'all 0.3s',
        overflow: 'auto'
      }, show ? {
        height: '50vh',
        width: '100%',
        opacity: '1'
      } : null]
    }, (0, _core.jsx)(_tooltip.Tooltip, {
      label: "Toggle Persist DevTools"
    }, (0, _core.jsx)("button", {
      css: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.2rem',
        border: 'none',
        padding: '10px 20px',
        background: 'none',
        marginTop: show ? -40 : 0,
        marginLeft: show ? 20 : 0,
        position: 'absolute',
        backgroundColor: 'rgb(11,21,33) !important',
        overflow: 'hidden',
        svg: {
          width: 20,
          marginRight: 8,
          color: persist ? 'white' : 'rgba(255,255,255,0.7)'
        },
        '::before': {
          content: '""',
          position: 'absolute',
          height: 4,
          width: '100%',
          left: 0,
          top: 0,
          background: persist ? colors.yellow : 'transparent'
        }
      },
      onClick: () => setPersist(v => !v)
    }, (0, _core.jsx)(_fa.FaTools, null), show ? 'Workshop DevTools' : null)), show ? (0, _core.jsx)(_tabs.Tabs, {
      css: {
        padding: 20
      },
      index: tabIndex,
      onChange: i => setTabIndex(i)
    }, (0, _core.jsx)(_tabs.TabList, {
      css: {
        marginBottom: 20
      }
    }, (0, _core.jsx)(_tabs.Tab, null, "Controls"), (0, _core.jsx)(_tabs.Tab, null, "Request Failures")), (0, _core.jsx)("div", {
      css: {
        border: '1px solid rgb(28,46,68)',
        margin: '0px -20px 20px -20px'
      }
    }), (0, _core.jsx)(_tabs.TabPanels, {
      css: {
        height: '100%'
      }
    }, (0, _core.jsx)(_tabs.TabPanel, null, (0, _core.jsx)(ControlsPanel, null)), (0, _core.jsx)(_tabs.TabPanel, null, (0, _core.jsx)(RequestFailUI, null)))) : null), show ? (0, _core.jsx)(_core.Global, {
      styles: {
        '#root': {
          marginBottom: '50vh'
        }
      }
    }) : null);
  }

  DevTools.displayName = 'DevTools'; // add dev tools UI to the page

  let devToolsRoot = document.getElementById('dev-tools');

  if (devToolsRoot) {
    _reactDom.default.unmountComponentAtNode(devToolsRoot); // right

  }

  if (!devToolsRoot) {
    devToolsRoot = document.createElement('div');
    devToolsRoot.id = 'dev-tools';
    document.body.appendChild(devToolsRoot);
  }

  _reactDom.default.render((0, _core.jsx)(DevTools, null), devToolsRoot);
}

function ControlsPanel() {
  return (0, _core.jsx)("div", {
    css: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'repeat(auto-fill, minmax(40px, 40px) )',
      gridGap: '0.5rem',
      marginRight: '1.5rem'
    }
  }, (0, _core.jsx)(EnableDevTools, null), (0, _core.jsx)(FailureRate, null), (0, _core.jsx)(RequestMinTime, null), (0, _core.jsx)(RequestVarTime, null), (0, _core.jsx)(ClearLocalStorage, null));
}

ControlsPanel.displayName = 'ControlsPanel';

function ClearLocalStorage() {
  return (0, _core.jsx)("button", {
    onClick: function () {
      const keysToRemove = [];

      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (isLsKey(key)) keysToRemove.push(key);
      }

      for (const lsKey of keysToRemove) {
        window.localStorage.removeItem(lsKey);
      } // refresh


      window.location.assign(window.location);
    }
  }, "Purge Database");
}

ClearLocalStorage.displayName = 'ClearLocalStorage';

function FailureRate() {
  const [failureRate, setFailureRate] = useLocalStorageState(getKey('failure_rate'), 0);
  return (0, _core.jsx)("div", {
    css: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, (0, _core.jsx)("label", {
    htmlFor: "failureRate"
  }, "Request Failure Percentage: "), (0, _core.jsx)("input", {
    css: {
      marginLeft: 6
    },
    value: failureRate * 100,
    type: "number",
    min: "0",
    max: "100",
    step: "10",
    onChange: event => setFailureRate(Number(event.target.value) / 100),
    id: "failureRate"
  }));
}

FailureRate.displayName = 'FailureRate';

function EnableDevTools() {
  const [enableDevTools, setEnableDevTools] = useLocalStorageState(getKey('dev-tools'), process.env.NODE_ENV === 'development');
  return (0, _core.jsx)("div", {
    css: {
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  }, (0, _core.jsx)("input", {
    css: {
      marginRight: 6
    },
    checked: enableDevTools,
    type: "checkbox",
    onChange: event => setEnableDevTools(event.target.checked),
    id: "enableDevTools"
  }), (0, _core.jsx)("label", {
    htmlFor: "enableDevTools"
  }, "Enable DevTools by default"));
}

EnableDevTools.displayName = 'EnableDevTools';

function RequestMinTime() {
  const [minTime, setMinTime] = useLocalStorageState(getKey('min_request_time'), 400);
  return (0, _core.jsx)("div", {
    css: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, (0, _core.jsx)("label", {
    htmlFor: "minTime"
  }, "Request min time (ms): "), (0, _core.jsx)("input", {
    css: {
      marginLeft: 6
    },
    value: minTime,
    type: "number",
    step: "100",
    min: "0",
    max: 1000 * 60,
    onChange: event => setMinTime(Number(event.target.value)),
    id: "minTime"
  }));
}

RequestMinTime.displayName = 'RequestMinTime';

function RequestVarTime() {
  const [varTime, setVarTime] = useLocalStorageState(getKey('variable_request_time'), 400);
  return (0, _core.jsx)("div", {
    css: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, (0, _core.jsx)("label", {
    htmlFor: "varTime"
  }, "Request variable time (ms): "), (0, _core.jsx)("input", {
    css: {
      marginLeft: 6
    },
    value: varTime,
    type: "number",
    step: "100",
    min: "0",
    max: 1000 * 60,
    onChange: event => setVarTime(Number(event.target.value)),
    id: "varTime"
  }));
}

RequestVarTime.displayName = 'RequestVarTime';

function RequestFailUI() {
  const [failConfig, setFailConfig] = useLocalStorageState(getKey('request_fail_config'), []);

  function handleRemoveClick(index) {
    setFailConfig(c => [...c.slice(0, index), ...c.slice(index + 1)]);
  }

  return (0, _core.jsx)("div", {
    css: {
      display: 'flex',
      width: '100%'
    }
  }, (0, _core.jsx)("form", {
    onSubmit: function (event) {
      event.preventDefault();
      const {
        requestMethod,
        urlMatch
      } = event.target.elements;
      setFailConfig(c => [...c, {
        requestMethod: requestMethod.value,
        urlMatch: urlMatch.value
      }]);
      requestMethod.value = '';
      urlMatch.value = '';
    },
    css: {
      display: 'grid',
      gridTemplateRows: 'repeat(auto-fill, minmax(50px, 60px) )',
      maxWidth: 300,
      width: '100%',
      marginRight: '1rem',
      gridGap: 10
    }
  }, (0, _core.jsx)("div", {
    css: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, (0, _core.jsx)("label", {
    htmlFor: "requestMethod"
  }, "Method:"), (0, _core.jsx)("select", {
    id: "requestMethod",
    required: true
  }, (0, _core.jsx)("option", {
    value: ""
  }, "Select"), (0, _core.jsx)("option", {
    value: "ALL"
  }, "ALL"), (0, _core.jsx)("option", {
    value: "GET"
  }, "GET"), (0, _core.jsx)("option", {
    value: "POST"
  }, "POST"), (0, _core.jsx)("option", {
    value: "PUT"
  }, "PUT"), (0, _core.jsx)("option", {
    value: "DELETE"
  }, "DELETE"))), (0, _core.jsx)("div", {
    css: {
      width: '100%'
    }
  }, (0, _core.jsx)("label", {
    css: {
      display: 'block'
    },
    htmlFor: "urlMatch"
  }, "URL Match:"), (0, _core.jsx)("input", {
    autoComplete: "off",
    css: {
      width: '100%',
      marginTop: 4
    },
    id: "urlMatch",
    required: true,
    placeholder: "/api/list-items/:listItemId"
  })), (0, _core.jsx)("div", null, (0, _core.jsx)("button", {
    css: {
      padding: '6px 16px'
    },
    type: "submit"
  }, "+ Add"))), (0, _core.jsx)("ul", {
    css: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      width: '100%',
      paddingBottom: '2rem'
    }
  }, failConfig.map(({
    requestMethod,
    urlMatch
  }, index) => (0, _core.jsx)("li", {
    key: index,
    css: {
      padding: '6px 10px',
      borderRadius: 5,
      margin: '5px 0',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgb(20,36,55)'
    }
  }, (0, _core.jsx)("div", {
    css: {
      display: 'flex',
      flexWrap: 'wrap'
    }
  }, (0, _core.jsx)("strong", {
    css: {
      minWidth: 70
    }
  }, requestMethod, ":"), (0, _core.jsx)("span", {
    css: {
      marginLeft: 10,
      whiteSpace: 'pre'
    }
  }, urlMatch)), (0, _core.jsx)("button", {
    css: {
      opacity: 0.6,
      ':hover': {
        opacity: 1
      },
      fontSize: 13,
      background: 'rgb(11, 20, 33) !important'
    },
    onClick: () => handleRemoveClick(index)
  }, "Remove")))));
}

RequestFailUI.displayName = 'RequestFailUI';

const getLSDebugValue = ({
  key,
  state,
  serialize
}) => `${key}: ${serialize(state)}`;
/**
 *
 * @param {String} key The key to set in localStorage for this value
 * @param {Object} defaultValue The value to use if it is not already in localStorage
 * @param {{serialize: Function, deserialize: Function}} options The serialize and deserialize functions to use (defaults to JSON.stringify and JSON.parse respectively)
 */


function useLocalStorageState(key, defaultValue = '', {
  serialize = JSON.stringify,
  deserialize = JSON.parse
} = {}) {
  const [state, setState] = _react.default.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);

    if (valueInLocalStorage) {
      try {
        return deserialize(valueInLocalStorage);
      } catch {// something went wrong reading the value in local storage
        // so we'll go with the default value
      }
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });

  _react.default.useDebugValue({
    key,
    state,
    serialize
  }, getLSDebugValue);

  const prevKeyRef = _react.default.useRef(key);

  _react.default.useEffect(() => {
    const prevKey = prevKeyRef.current;

    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }

    prevKeyRef.current = key;
  }, [key]);

  _react.default.useEffect(() => {
    window.localStorage.setItem(key, serialize(state));
  }, [key, state, serialize]);

  return [state, setState];
}
/*
eslint
  no-unused-expressions: "off",
*/