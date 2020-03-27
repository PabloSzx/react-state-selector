(window.webpackJsonp = window.webpackJsonp || []).push([
  [0],
  {
    113: function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.d(__webpack_exports__, "a", function () {
        return DevTools;
      });
      var connectDevTools = function (name) {
        try {
          if (
            "undefined" != typeof window &&
            void 0 !== window.__REDUX_DEVTOOLS_EXTENSION__
          )
            return window.__REDUX_DEVTOOLS_EXTENSION__.connect({
              name: "Store " + name,
              serialize: !0,
            });
        } catch (err) {}
      };
      try {
        (connectDevTools.displayName = "connectDevTools"),
          (connectDevTools.__docgenInfo = {
            description: "",
            displayName: "connectDevTools",
            props: {
              toString: {
                defaultValue: null,
                description: "Returns a string representation of a string.",
                name: "toString",
                required: !1,
                type: { name: "() => string" },
              },
              charAt: {
                defaultValue: null,
                description:
                  "Returns the character at the specified index.\n@param pos The zero-based index of the desired character.",
                name: "charAt",
                required: !0,
                type: { name: "(pos: number) => string" },
              },
              charCodeAt: {
                defaultValue: null,
                description:
                  "Returns the Unicode value of the character at the specified location.\n@param index The zero-based index of the desired character. If there is no character at the specified index, NaN is returned.",
                name: "charCodeAt",
                required: !0,
                type: { name: "(index: number) => number" },
              },
              concat: {
                defaultValue: null,
                description:
                  "Returns a string that contains the concatenation of two or more strings.\n@param strings The strings to append to the end of the string.",
                name: "concat",
                required: !0,
                type: { name: "(...strings: string[]) => string" },
              },
              indexOf: {
                defaultValue: null,
                description:
                  "Returns the position of the first occurrence of a substring.\n@param searchString The substring to search for in the string\n@param position The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.",
                name: "indexOf",
                required: !0,
                type: {
                  name: "(searchString: string, position?: number) => number",
                },
              },
              lastIndexOf: {
                defaultValue: null,
                description:
                  "Returns the last occurrence of a substring in the string.\n@param searchString The substring to search for.\n@param position The index at which to begin searching. If omitted, the search begins at the end of the string.",
                name: "lastIndexOf",
                required: !0,
                type: {
                  name: "(searchString: string, position?: number) => number",
                },
              },
              localeCompare: {
                defaultValue: null,
                description:
                  "Determines whether two strings are equivalent in the current locale.\nDetermines whether two strings are equivalent in the current or specified locale.\n@param that String to compare to target string\n@param that String to compare to target string\n@param locales A locale string or array of locale strings that contain one or more language or locale tags. If you include more than one locale string, list them in descending order of priority so that the first entry is the preferred locale. If you omit this parameter, the default locale of the JavaScript runtime is used. This parameter must conform to BCP 47 standards; see the Intl.Collator object for details.\n@param options An object that contains one or more properties that specify comparison options. see the Intl.Collator object for details.",
                name: "localeCompare",
                required: !0,
                type: {
                  name:
                    "{ (that: string): number; (that: string, locales?: string | string[], options?: CollatorOptions): number; }",
                },
              },
              match: {
                defaultValue: null,
                description:
                  "Matches a string with a regular expression, and returns an array containing the results of that search.\n@param regexp A variable name or string literal containing the regular expression pattern and flags.",
                name: "match",
                required: !0,
                type: { name: "(regexp: string | RegExp) => RegExpMatchArray" },
              },
              replace: {
                defaultValue: null,
                description:
                  "Replaces text in a string, using a regular expression or search string.\nReplaces text in a string, using a regular expression or search string.\n@param searchValue A string to search for.\n@param replaceValue A string containing the text to replace for every successful match of searchValue in this string.\n@param searchValue A string to search for.\n@param replacer A function that returns the replacement text.",
                name: "replace",
                required: !0,
                type: {
                  name:
                    "{ (searchValue: string | RegExp, replaceValue: string): string; (searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string; }",
                },
              },
              search: {
                defaultValue: null,
                description:
                  "Finds the first substring match in a regular expression search.\n@param regexp The regular expression pattern and applicable flags.",
                name: "search",
                required: !0,
                type: { name: "(regexp: string | RegExp) => number" },
              },
              slice: {
                defaultValue: null,
                description:
                  "Returns a section of a string.\n@param start The index to the beginning of the specified portion of stringObj.\n@param end The index to the end of the specified portion of stringObj. The substring includes the characters up to, but not including, the character indicated by end.\rIf this value is not specified, the substring continues to the end of stringObj.",
                name: "slice",
                required: !0,
                type: { name: "(start?: number, end?: number) => string" },
              },
              split: {
                defaultValue: null,
                description:
                  "Split a string into substrings using the specified separator and return them as an array.\n@param separator A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned.\n@param limit A value used to limit the number of elements returned in the array.",
                name: "split",
                required: !0,
                type: {
                  name:
                    "(separator: string | RegExp, limit?: number) => string[]",
                },
              },
              substring: {
                defaultValue: null,
                description:
                  "Returns the substring at the specified location within a String object.\n@param start The zero-based index number indicating the beginning of the substring.\n@param end Zero-based index number indicating the end of the substring. The substring includes the characters up to, but not including, the character indicated by end.\rIf end is omitted, the characters from start through the end of the original string are returned.",
                name: "substring",
                required: !0,
                type: { name: "(start: number, end?: number) => string" },
              },
              toLowerCase: {
                defaultValue: null,
                description:
                  "Converts all the alphabetic characters in a string to lowercase.",
                name: "toLowerCase",
                required: !0,
                type: { name: "() => string" },
              },
              toLocaleLowerCase: {
                defaultValue: null,
                description:
                  "Converts all alphabetic characters to lowercase, taking into account the host environment's current locale.",
                name: "toLocaleLowerCase",
                required: !0,
                type: { name: "(locales?: string | string[]) => string" },
              },
              toUpperCase: {
                defaultValue: null,
                description:
                  "Converts all the alphabetic characters in a string to uppercase.",
                name: "toUpperCase",
                required: !0,
                type: { name: "() => string" },
              },
              toLocaleUpperCase: {
                defaultValue: null,
                description:
                  "Returns a string where all alphabetic characters have been converted to uppercase, taking into account the host environment's current locale.",
                name: "toLocaleUpperCase",
                required: !0,
                type: { name: "(locales?: string | string[]) => string" },
              },
              trim: {
                defaultValue: null,
                description:
                  "Removes the leading and trailing white space and line terminator characters from a string.",
                name: "trim",
                required: !0,
                type: { name: "() => string" },
              },
              length: {
                defaultValue: null,
                description: "Returns the length of a String object.",
                name: "length",
                required: !0,
                type: { name: "number" },
              },
              substr: {
                defaultValue: null,
                description:
                  "Gets a substring beginning at the specified location and having the specified length.\n@param from The starting position of the desired substring. The index of the first character in the string is zero.\n@param length The number of characters to include in the returned substring.",
                name: "substr",
                required: !0,
                type: { name: "(from: number, length?: number) => string" },
              },
              valueOf: {
                defaultValue: null,
                description:
                  "Returns the primitive value of the specified object.",
                name: "valueOf",
                required: !1,
                type: { name: "() => string" },
              },
            },
          }),
          "undefined" != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES[
              "src/plugins/devTools.ts#connectDevTools"
            ] = {
              docgenInfo: connectDevTools.__docgenInfo,
              name: "connectDevTools",
              path: "src/plugins/devTools.ts#connectDevTools",
            });
      } catch (__react_docgen_typescript_loader_error) {}
      __webpack_require__(617);
      var react = __webpack_require__(0),
        react_default = __webpack_require__.n(react),
        devTools_open = !1,
        DevTools = function () {
          var isDevTools = Object(react.useMemo)(function () {
            return (
              "undefined" != typeof window &&
              void 0 !== window.__REDUX_DEVTOOLS_EXTENSION__
            );
          }, []);
          return (
            Object(react.useEffect)(function () {
              if (
                "undefined" != typeof window &&
                void 0 !== window.__REDUX_DEVTOOLS_EXTENSION__ &&
                !devTools_open
              ) {
                try {
                  window.__REDUX_DEVTOOLS_EXTENSION__.open("right");
                } catch (err) {}
                devTools_open = !0;
              }
            }, []),
            isDevTools
              ? react_default.a.createElement(
                  "div",
                  {
                    style: {
                      border: "1px solid white",
                      borderRadius: "5px",
                      width: "fit-content",
                      padding: "5px",
                    },
                  },
                  react_default.a.createElement(
                    "p",
                    { style: { color: "white" } },
                    "Check the ",
                    react_default.a.createElement("b", null, "Redux DevTools"),
                    " extension and see the current state, history and actions dispatched to the store."
                  )
                )
              : react_default.a.createElement(
                  "div",
                  {
                    style: {
                      border: "1px solid white",
                      borderRadius: "5px",
                      width: "fit-content",
                      padding: "5px",
                      color: "white",
                    },
                  },
                  "Install ",
                  react_default.a.createElement("b", null, "Redux DevTools"),
                  " in",
                  " ",
                  react_default.a.createElement(
                    "a",
                    {
                      style: { color: "white" },
                      target: "_blank",
                      rel: "noopener noreferrer",
                      href:
                        "https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en",
                    },
                    react_default.a.createElement("b", null, "Chrome")
                  ),
                  " ",
                  "or",
                  " ",
                  react_default.a.createElement(
                    "a",
                    {
                      style: { color: "white" },
                      target: "_blank",
                      rel: "noopener noreferrer",
                      href:
                        "https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/",
                    },
                    react_default.a.createElement("b", null, "Firefox")
                  )
                )
          );
        };
      try {
        (DevTools.displayName = "DevTools"),
          (DevTools.__docgenInfo = {
            description: "",
            displayName: "DevTools",
            props: {},
          }),
          "undefined" != typeof STORYBOOK_REACT_CLASSES &&
            (STORYBOOK_REACT_CLASSES["stories/utils/devTools.tsx#DevTools"] = {
              docgenInfo: DevTools.__docgenInfo,
              name: "DevTools",
              path: "stories/utils/devTools.tsx#DevTools",
            });
      } catch (__react_docgen_typescript_loader_error) {}
    },
    268: function (module, exports, __webpack_require__) {
      __webpack_require__(269),
        __webpack_require__(415),
        (module.exports = __webpack_require__(416));
    },
    333: function (module, exports) {},
    416: function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        function (module) {
          var _storybook_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
            267
          );
          Object(_storybook_react__WEBPACK_IMPORTED_MODULE_0__.configure)(
            __webpack_require__(607),
            module
          );
        }.call(this, __webpack_require__(417)(module));
    },
    607: function (module, exports, __webpack_require__) {
      var map = {
        "./createStore/asyncActions.stories.tsx": 608,
        "./createStore/basicUsage.stories.tsx": 611,
        "./createStore/createSelector.stories.tsx": 612,
        "./createStore/multipleProps.stories.tsx": 613,
        "./createStoreContext/asyncActionsContext.stories.tsx": 614,
        "./createStoreContext/basicUsageContext.stories.tsx": 615,
        "./devTools/createStore.stories.tsx": 616,
        "./devTools/createStoreContext.stories.tsx": 618,
      };
      function webpackContext(req) {
        var id = webpackContextResolve(req);
        return __webpack_require__(id);
      }
      function webpackContextResolve(req) {
        if (!__webpack_require__.o(map, req)) {
          var e = new Error("Cannot find module '" + req + "'");
          throw ((e.code = "MODULE_NOT_FOUND"), e);
        }
        return map[req];
      }
      (webpackContext.keys = function webpackContextKeys() {
        return Object.keys(map);
      }),
        (webpackContext.resolve = webpackContextResolve),
        (module.exports = webpackContext),
        (webpackContext.id = 607);
    },
    608: function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(__webpack_exports__, "AsyncActions", function () {
          return AsyncActions;
        });
      var FetchState,
        tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67),
        react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0),
        react__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_1__
        ),
        react_state_selector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          11
        ),
        addSourceDecorator =
          (__webpack_require__(15).withSource,
          __webpack_require__(15).addSource);
      !(function (FetchState) {
        (FetchState[(FetchState.loading = 0)] = "loading"),
          (FetchState[(FetchState.complete = 1)] = "complete"),
          (FetchState[(FetchState.error = 2)] = "error");
      })(FetchState || (FetchState = {}));
      var initialState = { state: FetchState.loading },
        Store = Object(react_state_selector__WEBPACK_IMPORTED_MODULE_2__.b)(
          initialState,
          {
            asyncActions: {
              getPosts: function (produce) {
                return function () {
                  return Object(tslib__WEBPACK_IMPORTED_MODULE_0__.a)(
                    void 0,
                    void 0,
                    void 0,
                    function () {
                      var data_1, err_1;
                      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__.b)(
                        this,
                        function (_a) {
                          switch (_a.label) {
                            case 0:
                              return (
                                _a.trys.push([0, 3, , 4]),
                                produce(function (draft) {
                                  draft.state = FetchState.loading;
                                }),
                                [
                                  4,
                                  fetch(
                                    "https://jsonplaceholder.typicode.com/posts"
                                  ),
                                ]
                              );
                            case 1:
                              return [4, _a.sent().json()];
                            case 2:
                              return (
                                (data_1 = _a.sent()),
                                produce(function (draft) {
                                  (draft.posts = data_1),
                                    (draft.state = FetchState.complete);
                                }),
                                [3, 4]
                              );
                            case 3:
                              return (
                                (err_1 = _a.sent()),
                                produce(function (draft) {
                                  (draft.state = FetchState.error),
                                    (draft.fetchError = JSON.stringify(err_1));
                                }),
                                console.error(err_1),
                                [3, 4]
                              );
                            case 4:
                              return [2];
                          }
                        }
                      );
                    }
                  );
                };
              },
            },
          }
        ),
        AsyncActions = addSourceDecorator(
          function () {
            var _a = Store.useStore(),
              posts = _a.posts,
              state = _a.state,
              fetchError = _a.fetchError;
            return (
              Object(react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
                Store.actions.getPosts();
              }, []),
              state === FetchState.error
                ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                    "p",
                    null,
                    "Error!",
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      "br",
                      null
                    ),
                    fetchError
                  )
                : state === FetchState.loading
                ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                    "p",
                    null,
                    "Loading..."
                  )
                : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                    "div",
                    null,
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      "button",
                      {
                        onClick: function () {
                          Store.actions.getPosts();
                        },
                      },
                      "Get Data"
                    ),
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      "ol",
                      null,
                      null == posts
                        ? void 0
                        : posts.slice(0, 10).map(function (value) {
                            return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                              "li",
                              { key: value.id },
                              react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                                "h3",
                                null,
                                value.title
                              ),
                              react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                                "p",
                                null,
                                value.body
                              )
                            );
                          })
                    )
                  )
            );
          },
          {
            __STORY__:
              'import React, { useEffect } from "react";\nimport { createStore } from "react-state-selector";\n\nenum FetchState {\n  loading,\n  complete,\n  error,\n}\n\ninterface IPosts {\n  posts?: {\n    id: number;\n    title: string;\n    body: string;\n    userId: number;\n  }[];\n  state: FetchState;\n  fetchError?: unknown;\n}\n\n/**\n * This interface is only for TypeScript usage\n * and separate definition of the initial state\n * is good practice.\n */\n\nconst initialState: IPosts = {\n  state: FetchState.loading,\n};\n\nconst Store = createStore(initialState, {\n  asyncActions: {\n    getPosts: (produce) => async () => {\n      try {\n        produce((draft) => {\n          draft.state = FetchState.loading;\n        });\n\n        const data = await (\n          await fetch("https://jsonplaceholder.typicode.com/posts")\n        ).json();\n\n        produce((draft) => {\n          draft.posts = data;\n          draft.state = FetchState.complete;\n        });\n      } catch (err) {\n        produce((draft) => {\n          draft.state = FetchState.error;\n          draft.fetchError = JSON.stringify(err);\n        });\n        console.error(err);\n      }\n    },\n  },\n});\n\nexport const AsyncActions = () => {\n  const { posts, state, fetchError } = Store.useStore();\n\n  useEffect(() => {\n    Store.actions.getPosts();\n  }, []);\n\n  if (state === FetchState.error) {\n    return (\n      <p>\n        Error!\n        <br />\n        {fetchError}\n      </p>\n    );\n  }\n\n  if (state === FetchState.loading) {\n    return <p>Loading...</p>;\n  }\n\n  return (\n    <div>\n      <button\n        onClick={() => {\n          Store.actions.getPosts();\n        }}\n      >\n        Get Data\n      </button>\n      <ol>\n        {posts?.slice(0, 10).map((value) => {\n          return (\n            <li key={value.id}>\n              <h3>{value.title}</h3>\n              <p>{value.body}</p>\n            </li>\n          );\n        })}\n      </ol>\n    </div>\n  );\n};\n\nexport default {\n  title: "createStore",\n};\n',
            __ADDS_MAP__: {
              "createstore--async-actions": {
                startLoc: { col: 28, line: 58 },
                endLoc: { col: 1, line: 100 },
                startBody: { col: 28, line: 58 },
                endBody: { col: 1, line: 100 },
              },
            },
            __MAIN_FILE_LOCATION__: "/asyncActions.stories.tsx",
            __MODULE_DEPENDENCIES__: [],
            __LOCAL_DEPENDENCIES__: {},
            __SOURCE_PREFIX__:
              "/home/pablosz/react-state-selector/stories/createStore",
            __IDS_TO_FRAMEWORKS__: {},
          }
        );
      __webpack_exports__.default = {
        parameters: {
          storySource: {
            source:
              'import React, { useEffect } from "react";\nimport { createStore } from "react-state-selector";\n\nenum FetchState {\n  loading,\n  complete,\n  error,\n}\n\ninterface IPosts {\n  posts?: {\n    id: number;\n    title: string;\n    body: string;\n    userId: number;\n  }[];\n  state: FetchState;\n  fetchError?: unknown;\n}\n\n/**\n * This interface is only for TypeScript usage\n * and separate definition of the initial state\n * is good practice.\n */\n\nconst initialState: IPosts = {\n  state: FetchState.loading,\n};\n\nconst Store = createStore(initialState, {\n  asyncActions: {\n    getPosts: (produce) => async () => {\n      try {\n        produce((draft) => {\n          draft.state = FetchState.loading;\n        });\n\n        const data = await (\n          await fetch("https://jsonplaceholder.typicode.com/posts")\n        ).json();\n\n        produce((draft) => {\n          draft.posts = data;\n          draft.state = FetchState.complete;\n        });\n      } catch (err) {\n        produce((draft) => {\n          draft.state = FetchState.error;\n          draft.fetchError = JSON.stringify(err);\n        });\n        console.error(err);\n      }\n    },\n  },\n});\n\nexport const AsyncActions = () => {\n  const { posts, state, fetchError } = Store.useStore();\n\n  useEffect(() => {\n    Store.actions.getPosts();\n  }, []);\n\n  if (state === FetchState.error) {\n    return (\n      <p>\n        Error!\n        <br />\n        {fetchError}\n      </p>\n    );\n  }\n\n  if (state === FetchState.loading) {\n    return <p>Loading...</p>;\n  }\n\n  return (\n    <div>\n      <button\n        onClick={() => {\n          Store.actions.getPosts();\n        }}\n      >\n        Get Data\n      </button>\n      <ol>\n        {posts?.slice(0, 10).map((value) => {\n          return (\n            <li key={value.id}>\n              <h3>{value.title}</h3>\n              <p>{value.body}</p>\n            </li>\n          );\n        })}\n      </ol>\n    </div>\n  );\n};\n\nexport default {\n  title: "createStore",\n};\n',
            locationsMap: {
              "createstore--async-actions": {
                startLoc: { col: 28, line: 58 },
                endLoc: { col: 1, line: 100 },
                startBody: { col: 28, line: 58 },
                endBody: { col: 1, line: 100 },
              },
            },
          },
        },
        title: "createStore",
      };
    },
    611: function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(__webpack_exports__, "basicUsage", function () {
          return basicUsage;
        });
      var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
        react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_0__
        ),
        react_state_selector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          11
        ),
        addSourceDecorator =
          (__webpack_require__(15).withSource,
          __webpack_require__(15).addSource),
        boxStyle = function (color) {
          return {
            border: "1px solid " + color,
            padding: "5px",
            borderRadius: "5px",
            width: "fit-content",
            color: "white",
          };
        },
        _a = Object(react_state_selector__WEBPACK_IMPORTED_MODULE_1__.b)(
          { a: 1, b: 2 },
          {
            hooks: {
              useA: function (_a) {
                return _a.a;
              },
              useB: function (_a) {
                return _a.b;
              },
            },
            actions: {
              incrementA: function (n) {
                return function (draft) {
                  draft.a += n;
                };
              },
              incrementB: function (n) {
                return function (draft) {
                  draft.b += n;
                };
              },
            },
          }
        ),
        _b = _a.hooks,
        useA = _b.useA,
        useB = _b.useB,
        _c = _a.actions,
        incrementA = _c.incrementA,
        incrementB = _c.incrementB,
        RandomNumberEveryRender = function (_a) {
          var _b = _a.limit,
            limit = void 0 === _b ? 100 : _b;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "p",
            { style: boxStyle("red") },
            "Random Number = ",
            Math.round(Math.random() * limit)
          );
        },
        A = function () {
          var a = useA();
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { style: boxStyle("blue") },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "p",
              null,
              a
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  return incrementA(5);
                },
              },
              "Increment A (+5)"
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              RandomNumberEveryRender,
              null
            )
          );
        },
        B = function () {
          var b = useB();
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { style: boxStyle("blue") },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "p",
              null,
              b
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  return incrementB(5);
                },
              },
              "Increment B (+5)"
            ),
            " ",
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              RandomNumberEveryRender,
              null
            )
          );
        },
        ManualIncrement = function () {
          var _a = Object(react__WEBPACK_IMPORTED_MODULE_0__.useState)(1),
            n = _a[0],
            setN = _a[1];
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { style: boxStyle("blue") },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "input",
              {
                value: n,
                type: "number",
                onChange: function (_a) {
                  var value = _a.target.value;
                  return setN(parseInt(value));
                },
              }
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  incrementA(n);
                },
              },
              "Increment A"
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  incrementB(n);
                },
              },
              "Increment B"
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              RandomNumberEveryRender,
              null
            )
          );
        },
        basicUsage = addSourceDecorator(
          function () {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "div",
              { style: boxStyle("green") },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                A,
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "br",
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                B,
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "br",
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                ManualIncrement,
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "br",
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                RandomNumberEveryRender,
                null
              )
            );
          },
          {
            __STORY__:
              'import React, { CSSProperties, FC, useState } from "react";\nimport { createStore } from "react-state-selector";\n\nconst boxStyle = (color: string): CSSProperties => {\n  return {\n    border: `1px solid ${color}`,\n    padding: "5px",\n    borderRadius: "5px",\n    width: "fit-content",\n    color: "white",\n  };\n};\n\nconst {\n  hooks: { useA, useB },\n  actions: { incrementA, incrementB },\n} = createStore(\n  {\n    a: 1,\n    b: 2,\n  },\n  {\n    hooks: {\n      useA: ({ a }) => {\n        return a;\n      },\n      useB: ({ b }) => {\n        return b;\n      },\n    },\n    actions: {\n      incrementA: (n: number) => (draft) => {\n        draft.a += n;\n      },\n      incrementB: (n: number) => (draft) => {\n        draft.b += n;\n      },\n    },\n  }\n);\n\nconst RandomNumberEveryRender: FC<{ limit?: number }> = ({ limit = 100 }) => {\n  // This component is designed to show that every component\n  // only subscribes to the data it needs, therefore, less renders needed\n\n  return (\n    <p style={boxStyle("red")}>\n      Random Number = {Math.round(Math.random() * limit)}\n    </p>\n  );\n};\n\nconst A: FC = () => {\n  const a = useA();\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{a}</p>\n      <button onClick={() => incrementA(5)}>Increment A (+5)</button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst B: FC = () => {\n  const b = useB();\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{b}</p>\n      <button onClick={() => incrementB(5)}>Increment B (+5)</button>{" "}\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst ManualIncrement: FC = () => {\n  const [n, setN] = useState(1);\n\n  return (\n    <div style={boxStyle("blue")}>\n      <input\n        value={n}\n        type="number"\n        onChange={({ target: { value } }) => setN(parseInt(value))}\n      />\n      <button\n        onClick={() => {\n          incrementA(n);\n        }}\n      >\n        Increment A\n      </button>\n      <button\n        onClick={() => {\n          incrementB(n);\n        }}\n      >\n        Increment B\n      </button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\n\nexport const basicUsage = () => {\n  return (\n    <div style={boxStyle("green")}>\n      <A />\n      <br />\n      <B />\n      <br />\n      <ManualIncrement />\n      <br />\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\n\nexport default {\n  title: "createStore",\n};\n',
            __ADDS_MAP__: {
              "createstore--basic-usage": {
                startLoc: { col: 26, line: 102 },
                endLoc: { col: 1, line: 114 },
                startBody: { col: 26, line: 102 },
                endBody: { col: 1, line: 114 },
              },
            },
            __MAIN_FILE_LOCATION__: "/basicUsage.stories.tsx",
            __MODULE_DEPENDENCIES__: [],
            __LOCAL_DEPENDENCIES__: {},
            __SOURCE_PREFIX__:
              "/home/pablosz/react-state-selector/stories/createStore",
            __IDS_TO_FRAMEWORKS__: {},
          }
        );
      __webpack_exports__.default = {
        parameters: {
          storySource: {
            source:
              'import React, { CSSProperties, FC, useState } from "react";\nimport { createStore } from "react-state-selector";\n\nconst boxStyle = (color: string): CSSProperties => {\n  return {\n    border: `1px solid ${color}`,\n    padding: "5px",\n    borderRadius: "5px",\n    width: "fit-content",\n    color: "white",\n  };\n};\n\nconst {\n  hooks: { useA, useB },\n  actions: { incrementA, incrementB },\n} = createStore(\n  {\n    a: 1,\n    b: 2,\n  },\n  {\n    hooks: {\n      useA: ({ a }) => {\n        return a;\n      },\n      useB: ({ b }) => {\n        return b;\n      },\n    },\n    actions: {\n      incrementA: (n: number) => (draft) => {\n        draft.a += n;\n      },\n      incrementB: (n: number) => (draft) => {\n        draft.b += n;\n      },\n    },\n  }\n);\n\nconst RandomNumberEveryRender: FC<{ limit?: number }> = ({ limit = 100 }) => {\n  // This component is designed to show that every component\n  // only subscribes to the data it needs, therefore, less renders needed\n\n  return (\n    <p style={boxStyle("red")}>\n      Random Number = {Math.round(Math.random() * limit)}\n    </p>\n  );\n};\n\nconst A: FC = () => {\n  const a = useA();\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{a}</p>\n      <button onClick={() => incrementA(5)}>Increment A (+5)</button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst B: FC = () => {\n  const b = useB();\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{b}</p>\n      <button onClick={() => incrementB(5)}>Increment B (+5)</button>{" "}\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst ManualIncrement: FC = () => {\n  const [n, setN] = useState(1);\n\n  return (\n    <div style={boxStyle("blue")}>\n      <input\n        value={n}\n        type="number"\n        onChange={({ target: { value } }) => setN(parseInt(value))}\n      />\n      <button\n        onClick={() => {\n          incrementA(n);\n        }}\n      >\n        Increment A\n      </button>\n      <button\n        onClick={() => {\n          incrementB(n);\n        }}\n      >\n        Increment B\n      </button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\n\nexport const basicUsage = () => {\n  return (\n    <div style={boxStyle("green")}>\n      <A />\n      <br />\n      <B />\n      <br />\n      <ManualIncrement />\n      <br />\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\n\nexport default {\n  title: "createStore",\n};\n',
            locationsMap: {
              "createstore--basic-usage": {
                startLoc: { col: 26, line: 102 },
                endLoc: { col: 1, line: 114 },
                startBody: { col: 26, line: 102 },
                endBody: { col: 1, line: 114 },
              },
            },
          },
        },
        title: "createStore",
      };
    },
    612: function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(
          __webpack_exports__,
          "createSelectorExample",
          function () {
            return createSelectorExample;
          }
        );
      var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
        react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_0__
        ),
        react_state_selector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          11
        ),
        addSourceDecorator =
          (__webpack_require__(15).withSource,
          __webpack_require__(15).addSource),
        genData = function (n) {
          return (
            void 0 === n && (n = 3),
            new Array(n).fill(0).map(function () {
              return Math.round(10 * Math.random() + 1);
            })
          );
        },
        Store =
          (genData(),
          Object(react_state_selector__WEBPACK_IMPORTED_MODULE_1__.b)(
            { data: genData(), n: 0 },
            {
              hooks: {
                useMultiply2DataWithoutSelector: function (state) {
                  return state.data.map(function (n) {
                    return 2 * n;
                  });
                },
                useMultiply2Data: Object(
                  react_state_selector__WEBPACK_IMPORTED_MODULE_1__.a
                )(
                  function (state) {
                    return state.data;
                  },
                  function (data) {
                    return data.map(function (n) {
                      return 2 * n;
                    });
                  }
                ),
                useMultiplyNData: Object(
                  react_state_selector__WEBPACK_IMPORTED_MODULE_1__.a
                )(
                  function (state, _n) {
                    return state.data;
                  },
                  function (_state, nMultiply) {
                    return nMultiply;
                  },
                  function (data, nMultiply) {
                    return data.map(function (n) {
                      return nMultiply * n;
                    });
                  }
                ),
              },
              actions: {
                newData: function () {
                  return function (draft) {
                    draft.data = genData();
                  };
                },
                newN: function () {
                  return function (draft) {
                    draft.n = Math.round(1e4 * Math.random());
                  };
                },
              },
            }
          )),
        ListWithoutSelector = function () {
          var list = Store.hooks.useMultiply2DataWithoutSelector();
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,
            null,
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "p",
              null,
              "Random Number = ",
              Math.round(100 * Math.random())
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "ul",
              null,
              list.map(function (n, key) {
                return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  "li",
                  { key: key },
                  n
                );
              })
            )
          );
        },
        ListMultiply2 = function () {
          var list = Store.hooks.useMultiply2Data();
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,
            null,
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "p",
              null,
              "Random Number = ",
              Math.round(100 * Math.random())
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "ul",
              null,
              list.map(function (n, key) {
                return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  "li",
                  { key: key },
                  n
                );
              })
            )
          );
        },
        ListMultiplyN = function () {
          var list = Store.hooks.useMultiplyNData(4);
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,
            null,
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "p",
              null,
              "Random Number = ",
              Math.round(100 * Math.random())
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "ul",
              null,
              list.map(function (n, key) {
                return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  "li",
                  { key: key },
                  n
                );
              })
            )
          );
        },
        createSelectorExample = addSourceDecorator(
          function () {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "div",
              null,
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                ListWithoutSelector,
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                ListMultiply2,
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                ListMultiplyN,
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "br",
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "button",
                {
                  onClick: function () {
                    Store.actions.newData();
                  },
                },
                "New Data"
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "br",
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "button",
                {
                  onClick: function () {
                    Store.actions.newN();
                  },
                },
                "New N"
              )
            );
          },
          {
            __STORY__:
              'import React from "react";\nimport { createSelector, createStore, Immutable } from "react-state-selector";\n\nconst genData = (n = 3) =>\n  new Array(n).fill(0).map(() => Math.round(Math.random() * 10 + 1));\n\nconst initialState = {\n  data: genData(),\n};\n\nconst Store = createStore(\n  {\n    data: genData(),\n    n: 0,\n  },\n  {\n    hooks: {\n      /**\n       * This hook is going to re-render in any change\n       * in the store due to that in every call\n       * the "map" function is giving a new array.\n       */\n      useMultiply2DataWithoutSelector: (state) => {\n        return state.data.map((n) => n * 2);\n      },\n      /**\n       * This hook is only going to be listening to changes\n       * to "data" inside the store\n       */\n      useMultiply2Data: createSelector(\n        (state) => state.data,\n        (data) => {\n          return data.map((n) => n * 2);\n        }\n      ),\n      /**\n       * This hook is only going to be listening to changes\n       * to "data" and the argument given to the hook\n       */\n      useMultiplyNData: createSelector(\n        /**\n         * This type definition is only for TypeScript usage\n         */\n        (state: Immutable<typeof initialState>, _n: number) => state.data,\n        (_state, nMultiply) => nMultiply,\n        (data, nMultiply) => {\n          return data.map((n) => nMultiply * n);\n        }\n      ),\n    },\n    actions: {\n      newData: () => (draft) => {\n        draft.data = genData();\n      },\n      newN: () => (draft) => {\n        draft.n = Math.round(Math.random() * 10000);\n      },\n    },\n  }\n);\n\nconst ListWithoutSelector = () => {\n  const list = Store.hooks.useMultiply2DataWithoutSelector();\n\n  return (\n    <>\n      <p>Random Number = {Math.round(Math.random() * 100)}</p>\n      <ul>\n        {list.map((n, key) => {\n          return <li key={key}>{n}</li>;\n        })}\n      </ul>\n    </>\n  );\n};\n\nconst ListMultiply2 = () => {\n  const list = Store.hooks.useMultiply2Data();\n\n  return (\n    <>\n      <p>Random Number = {Math.round(Math.random() * 100)}</p>\n      <ul>\n        {list.map((n, key) => {\n          return <li key={key}>{n}</li>;\n        })}\n      </ul>\n    </>\n  );\n};\n\nconst ListMultiplyN = () => {\n  const list = Store.hooks.useMultiplyNData(4);\n\n  return (\n    <>\n      <p>Random Number = {Math.round(Math.random() * 100)}</p>\n      <ul>\n        {list.map((n, key) => {\n          return <li key={key}>{n}</li>;\n        })}\n      </ul>\n    </>\n  );\n};\n\nexport const createSelectorExample = () => {\n  return (\n    <div>\n      <ListWithoutSelector />\n      <ListMultiply2 />\n      <ListMultiplyN />\n      <br />\n      <button\n        onClick={() => {\n          Store.actions.newData();\n        }}\n      >\n        New Data\n      </button>\n      <br />\n      <button\n        onClick={() => {\n          Store.actions.newN();\n        }}\n      >\n        New N\n      </button>\n    </div>\n  );\n};\n\nexport default {\n  title: "createStore",\n};\n',
            __ADDS_MAP__: {
              "createstore--create-selector-example": {
                startLoc: { col: 37, line: 107 },
                endLoc: { col: 1, line: 131 },
                startBody: { col: 37, line: 107 },
                endBody: { col: 1, line: 131 },
              },
            },
            __MAIN_FILE_LOCATION__: "/createSelector.stories.tsx",
            __MODULE_DEPENDENCIES__: [],
            __LOCAL_DEPENDENCIES__: {},
            __SOURCE_PREFIX__:
              "/home/pablosz/react-state-selector/stories/createStore",
            __IDS_TO_FRAMEWORKS__: {},
          }
        );
      __webpack_exports__.default = {
        parameters: {
          storySource: {
            source:
              'import React from "react";\nimport { createSelector, createStore, Immutable } from "react-state-selector";\n\nconst genData = (n = 3) =>\n  new Array(n).fill(0).map(() => Math.round(Math.random() * 10 + 1));\n\nconst initialState = {\n  data: genData(),\n};\n\nconst Store = createStore(\n  {\n    data: genData(),\n    n: 0,\n  },\n  {\n    hooks: {\n      /**\n       * This hook is going to re-render in any change\n       * in the store due to that in every call\n       * the "map" function is giving a new array.\n       */\n      useMultiply2DataWithoutSelector: (state) => {\n        return state.data.map((n) => n * 2);\n      },\n      /**\n       * This hook is only going to be listening to changes\n       * to "data" inside the store\n       */\n      useMultiply2Data: createSelector(\n        (state) => state.data,\n        (data) => {\n          return data.map((n) => n * 2);\n        }\n      ),\n      /**\n       * This hook is only going to be listening to changes\n       * to "data" and the argument given to the hook\n       */\n      useMultiplyNData: createSelector(\n        /**\n         * This type definition is only for TypeScript usage\n         */\n        (state: Immutable<typeof initialState>, _n: number) => state.data,\n        (_state, nMultiply) => nMultiply,\n        (data, nMultiply) => {\n          return data.map((n) => nMultiply * n);\n        }\n      ),\n    },\n    actions: {\n      newData: () => (draft) => {\n        draft.data = genData();\n      },\n      newN: () => (draft) => {\n        draft.n = Math.round(Math.random() * 10000);\n      },\n    },\n  }\n);\n\nconst ListWithoutSelector = () => {\n  const list = Store.hooks.useMultiply2DataWithoutSelector();\n\n  return (\n    <>\n      <p>Random Number = {Math.round(Math.random() * 100)}</p>\n      <ul>\n        {list.map((n, key) => {\n          return <li key={key}>{n}</li>;\n        })}\n      </ul>\n    </>\n  );\n};\n\nconst ListMultiply2 = () => {\n  const list = Store.hooks.useMultiply2Data();\n\n  return (\n    <>\n      <p>Random Number = {Math.round(Math.random() * 100)}</p>\n      <ul>\n        {list.map((n, key) => {\n          return <li key={key}>{n}</li>;\n        })}\n      </ul>\n    </>\n  );\n};\n\nconst ListMultiplyN = () => {\n  const list = Store.hooks.useMultiplyNData(4);\n\n  return (\n    <>\n      <p>Random Number = {Math.round(Math.random() * 100)}</p>\n      <ul>\n        {list.map((n, key) => {\n          return <li key={key}>{n}</li>;\n        })}\n      </ul>\n    </>\n  );\n};\n\nexport const createSelectorExample = () => {\n  return (\n    <div>\n      <ListWithoutSelector />\n      <ListMultiply2 />\n      <ListMultiplyN />\n      <br />\n      <button\n        onClick={() => {\n          Store.actions.newData();\n        }}\n      >\n        New Data\n      </button>\n      <br />\n      <button\n        onClick={() => {\n          Store.actions.newN();\n        }}\n      >\n        New N\n      </button>\n    </div>\n  );\n};\n\nexport default {\n  title: "createStore",\n};\n',
            locationsMap: {
              "createstore--create-selector-example": {
                startLoc: { col: 37, line: 107 },
                endLoc: { col: 1, line: 131 },
                startBody: { col: 37, line: 107 },
                endBody: { col: 1, line: 131 },
              },
            },
          },
        },
        title: "createStore",
      };
    },
    613: function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(
          __webpack_exports__,
          "MultipleProps",
          function () {
            return MultipleProps;
          }
        );
      var ColorsTypes,
        react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
        react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_0__
        ),
        react_state_selector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          11
        ),
        addSourceDecorator =
          (__webpack_require__(15).withSource,
          __webpack_require__(15).addSource);
      !(function (ColorsTypes) {
        (ColorsTypes.blue = "blue"),
          (ColorsTypes.red = "red"),
          (ColorsTypes.green = "green");
      })(ColorsTypes || (ColorsTypes = {}));
      var Store = Object(react_state_selector__WEBPACK_IMPORTED_MODULE_1__.b)(
          {
            data: [
              { color: ColorsTypes.blue, n: 2 },
              { color: ColorsTypes.green, n: 4 },
              { color: ColorsTypes.red, n: 3 },
            ],
          },
          {
            hooks: {
              useGetElement: function (state, arg) {
                return state.data.find(function (value) {
                  return value.color === arg.color || value.n === arg.n;
                });
              },
            },
          }
        ),
        MultipleProps = addSourceDecorator(
          function () {
            var _a = Object(react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),
              color = _a[0],
              setColor = _a[1],
              _b = Object(react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),
              n = _b[0],
              setN = _b[1],
              element = Store.hooks.useGetElement({ color: color, n: n }, [
                color,
                n,
              ]);
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "div",
              null,
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "label",
                null,
                "Color"
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "input",
                {
                  value: color,
                  onChange: function (_a) {
                    var value = _a.target.value;
                    return setColor(value);
                  },
                }
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "br",
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "label",
                null,
                "N"
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "input",
                {
                  value: n,
                  type: "number",
                  onChange: function (_a) {
                    var value = _a.target.value;
                    return setN(parseInt(value));
                  },
                }
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "br",
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "br",
                null
              ),
              element &&
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  "p",
                  { style: { color: element.color } },
                  element.n
                )
            );
          },
          {
            __STORY__:
              'import React, { useState } from "react";\nimport { createStore } from "react-state-selector";\n\nenum ColorsTypes {\n  blue = "blue",\n  red = "red",\n  green = "green",\n}\n\nconst Store = createStore(\n  {\n    data: [\n      { color: ColorsTypes.blue, n: 2 },\n      { color: ColorsTypes.green, n: 4 },\n      { color: ColorsTypes.red, n: 3 },\n    ],\n  },\n  {\n    hooks: {\n      /**\n       * If you need to give more than\n       * a single argument to a hook\n       * selector, you should give\n       * an object\n       */\n      useGetElement: (state, arg: { color: string; n: number }) => {\n        return state.data.find(\n          (value) => value.color === arg.color || value.n === arg.n\n        );\n      },\n    },\n  }\n);\n\nexport const MultipleProps = () => {\n  const [color, setColor] = useState("");\n  const [n, setN] = useState(0);\n\n  /**\n   * But to prevent unneccesary calls\n   * to the selector you can give a\n   * secondary argument just like useMemo\n   * or useCallback\n   */\n  const element = Store.hooks.useGetElement(\n    {\n      color,\n      n,\n    },\n    [color, n]\n  );\n\n  return (\n    <div>\n      <label>Color</label>\n      <input\n        value={color}\n        onChange={({ target: { value } }) => setColor(value)}\n      />\n      <br />\n      <label>N</label>\n      <input\n        value={n}\n        type="number"\n        onChange={({ target: { value } }) => setN(parseInt(value))}\n      />\n\n      <br />\n      <br />\n\n      {element && <p style={{ color: element.color }}>{element.n}</p>}\n    </div>\n  );\n};\n\nexport default {\n  title: "createStore",\n};\n',
            __ADDS_MAP__: {
              "createstore--multiple-props": {
                startLoc: { col: 29, line: 35 },
                endLoc: { col: 1, line: 74 },
                startBody: { col: 29, line: 35 },
                endBody: { col: 1, line: 74 },
              },
            },
            __MAIN_FILE_LOCATION__: "/multipleProps.stories.tsx",
            __MODULE_DEPENDENCIES__: [],
            __LOCAL_DEPENDENCIES__: {},
            __SOURCE_PREFIX__:
              "/home/pablosz/react-state-selector/stories/createStore",
            __IDS_TO_FRAMEWORKS__: {},
          }
        );
      __webpack_exports__.default = {
        parameters: {
          storySource: {
            source:
              'import React, { useState } from "react";\nimport { createStore } from "react-state-selector";\n\nenum ColorsTypes {\n  blue = "blue",\n  red = "red",\n  green = "green",\n}\n\nconst Store = createStore(\n  {\n    data: [\n      { color: ColorsTypes.blue, n: 2 },\n      { color: ColorsTypes.green, n: 4 },\n      { color: ColorsTypes.red, n: 3 },\n    ],\n  },\n  {\n    hooks: {\n      /**\n       * If you need to give more than\n       * a single argument to a hook\n       * selector, you should give\n       * an object\n       */\n      useGetElement: (state, arg: { color: string; n: number }) => {\n        return state.data.find(\n          (value) => value.color === arg.color || value.n === arg.n\n        );\n      },\n    },\n  }\n);\n\nexport const MultipleProps = () => {\n  const [color, setColor] = useState("");\n  const [n, setN] = useState(0);\n\n  /**\n   * But to prevent unneccesary calls\n   * to the selector you can give a\n   * secondary argument just like useMemo\n   * or useCallback\n   */\n  const element = Store.hooks.useGetElement(\n    {\n      color,\n      n,\n    },\n    [color, n]\n  );\n\n  return (\n    <div>\n      <label>Color</label>\n      <input\n        value={color}\n        onChange={({ target: { value } }) => setColor(value)}\n      />\n      <br />\n      <label>N</label>\n      <input\n        value={n}\n        type="number"\n        onChange={({ target: { value } }) => setN(parseInt(value))}\n      />\n\n      <br />\n      <br />\n\n      {element && <p style={{ color: element.color }}>{element.n}</p>}\n    </div>\n  );\n};\n\nexport default {\n  title: "createStore",\n};\n',
            locationsMap: {
              "createstore--multiple-props": {
                startLoc: { col: 29, line: 35 },
                endLoc: { col: 1, line: 74 },
                startBody: { col: 29, line: 35 },
                endBody: { col: 1, line: 74 },
              },
            },
          },
        },
        title: "createStore",
      };
    },
    614: function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(
          __webpack_exports__,
          "AsyncActionsContext",
          function () {
            return AsyncActionsContext;
          }
        );
      var FetchState,
        tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67),
        react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0),
        react__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_1__
        ),
        react_state_selector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          11
        ),
        addSourceDecorator =
          (__webpack_require__(15).withSource,
          __webpack_require__(15).addSource);
      !(function (FetchState) {
        (FetchState[(FetchState.loading = 0)] = "loading"),
          (FetchState[(FetchState.complete = 1)] = "complete"),
          (FetchState[(FetchState.error = 2)] = "error");
      })(FetchState || (FetchState = {}));
      var initialState = { state: FetchState.loading },
        Store = Object(react_state_selector__WEBPACK_IMPORTED_MODULE_2__.c)(
          initialState,
          {
            asyncActions: {
              getPosts: function (produce) {
                return function () {
                  return Object(tslib__WEBPACK_IMPORTED_MODULE_0__.a)(
                    void 0,
                    void 0,
                    void 0,
                    function () {
                      var data_1, err_1;
                      return Object(tslib__WEBPACK_IMPORTED_MODULE_0__.b)(
                        this,
                        function (_a) {
                          switch (_a.label) {
                            case 0:
                              return (
                                _a.trys.push([0, 3, , 4]),
                                produce(function (draft) {
                                  draft.state = FetchState.loading;
                                }),
                                [
                                  4,
                                  fetch(
                                    "https://jsonplaceholder.typicode.com/posts"
                                  ),
                                ]
                              );
                            case 1:
                              return [4, _a.sent().json()];
                            case 2:
                              return (
                                (data_1 = _a.sent()),
                                produce(function (draft) {
                                  (draft.posts = data_1),
                                    (draft.state = FetchState.complete);
                                }),
                                [3, 4]
                              );
                            case 3:
                              return (
                                (err_1 = _a.sent()),
                                produce(function (draft) {
                                  (draft.state = FetchState.error),
                                    (draft.fetchError = JSON.stringify(err_1));
                                }),
                                console.error(err_1),
                                [3, 4]
                              );
                            case 4:
                              return [2];
                          }
                        }
                      );
                    }
                  );
                };
              },
            },
          }
        ),
        AsyncActionsContext = addSourceDecorator(
          function () {
            var _a = Store.useStore(),
              posts = _a.posts,
              state = _a.state,
              fetchError = _a.fetchError,
              getPosts = Store.useActions().getPosts;
            return (
              Object(react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(
                function () {
                  getPosts();
                },
                [getPosts]
              ),
              state === FetchState.error
                ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                    "p",
                    null,
                    "Error!",
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      "br",
                      null
                    ),
                    fetchError
                  )
                : state === FetchState.loading
                ? react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                    "p",
                    null,
                    "Loading..."
                  )
                : react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.Fragment,
                    null,
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      "button",
                      {
                        onClick: function () {
                          getPosts();
                        },
                      },
                      "Get Data"
                    ),
                    react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                      "ol",
                      null,
                      null == posts
                        ? void 0
                        : posts.slice(0, 10).map(function (value) {
                            return react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                              "li",
                              { key: value.id },
                              react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                                "h3",
                                null,
                                value.title
                              ),
                              react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement(
                                "p",
                                null,
                                value.body
                              )
                            );
                          })
                    )
                  )
            );
          },
          {
            __STORY__:
              'import React, { useEffect } from "react";\nimport { createStoreContext } from "react-state-selector";\n\nenum FetchState {\n  loading,\n  complete,\n  error,\n}\n\ninterface IPosts {\n  posts?: {\n    id: number;\n    title: string;\n    body: string;\n    userId: number;\n  }[];\n  state: FetchState;\n  fetchError?: unknown;\n}\n\n/**\n * Only for TypeScript usage this interface\n * and separate definition of the initial state\n * is necessary / good practice.\n */\n\nconst initialState: IPosts = {\n  state: FetchState.loading,\n};\n\nconst Store = createStoreContext(initialState, {\n  asyncActions: {\n    getPosts: (produce) => async () => {\n      try {\n        produce((draft) => {\n          draft.state = FetchState.loading;\n        });\n\n        const data = await (\n          await fetch("https://jsonplaceholder.typicode.com/posts")\n        ).json();\n\n        produce((draft) => {\n          draft.posts = data;\n          draft.state = FetchState.complete;\n        });\n      } catch (err) {\n        produce((draft) => {\n          draft.state = FetchState.error;\n          draft.fetchError = JSON.stringify(err);\n        });\n        console.error(err);\n      }\n    },\n  },\n});\n\nexport const AsyncActionsContext = () => {\n  const { posts, state, fetchError } = Store.useStore();\n  const { getPosts } = Store.useActions();\n\n  useEffect(() => {\n    getPosts();\n  }, [getPosts]);\n\n  if (state === FetchState.error) {\n    return (\n      <p>\n        Error!\n        <br />\n        {fetchError}\n      </p>\n    );\n  }\n\n  if (state === FetchState.loading) {\n    return <p>Loading...</p>;\n  }\n\n  return (\n    <>\n      <button\n        onClick={() => {\n          getPosts();\n        }}\n      >\n        Get Data\n      </button>\n      <ol>\n        {posts?.slice(0, 10).map((value) => {\n          return (\n            <li key={value.id}>\n              <h3>{value.title}</h3>\n              <p>{value.body}</p>\n            </li>\n          );\n        })}\n      </ol>\n    </>\n  );\n};\n\nexport default {\n  title: "createStoreContext",\n};\n',
            __ADDS_MAP__: {
              "createstorecontext--async-actions-context": {
                startLoc: { col: 35, line: 58 },
                endLoc: { col: 1, line: 101 },
                startBody: { col: 35, line: 58 },
                endBody: { col: 1, line: 101 },
              },
            },
            __MAIN_FILE_LOCATION__: "/asyncActionsContext.stories.tsx",
            __MODULE_DEPENDENCIES__: [],
            __LOCAL_DEPENDENCIES__: {},
            __SOURCE_PREFIX__:
              "/home/pablosz/react-state-selector/stories/createStoreContext",
            __IDS_TO_FRAMEWORKS__: {},
          }
        );
      __webpack_exports__.default = {
        parameters: {
          storySource: {
            source:
              'import React, { useEffect } from "react";\nimport { createStoreContext } from "react-state-selector";\n\nenum FetchState {\n  loading,\n  complete,\n  error,\n}\n\ninterface IPosts {\n  posts?: {\n    id: number;\n    title: string;\n    body: string;\n    userId: number;\n  }[];\n  state: FetchState;\n  fetchError?: unknown;\n}\n\n/**\n * Only for TypeScript usage this interface\n * and separate definition of the initial state\n * is necessary / good practice.\n */\n\nconst initialState: IPosts = {\n  state: FetchState.loading,\n};\n\nconst Store = createStoreContext(initialState, {\n  asyncActions: {\n    getPosts: (produce) => async () => {\n      try {\n        produce((draft) => {\n          draft.state = FetchState.loading;\n        });\n\n        const data = await (\n          await fetch("https://jsonplaceholder.typicode.com/posts")\n        ).json();\n\n        produce((draft) => {\n          draft.posts = data;\n          draft.state = FetchState.complete;\n        });\n      } catch (err) {\n        produce((draft) => {\n          draft.state = FetchState.error;\n          draft.fetchError = JSON.stringify(err);\n        });\n        console.error(err);\n      }\n    },\n  },\n});\n\nexport const AsyncActionsContext = () => {\n  const { posts, state, fetchError } = Store.useStore();\n  const { getPosts } = Store.useActions();\n\n  useEffect(() => {\n    getPosts();\n  }, [getPosts]);\n\n  if (state === FetchState.error) {\n    return (\n      <p>\n        Error!\n        <br />\n        {fetchError}\n      </p>\n    );\n  }\n\n  if (state === FetchState.loading) {\n    return <p>Loading...</p>;\n  }\n\n  return (\n    <>\n      <button\n        onClick={() => {\n          getPosts();\n        }}\n      >\n        Get Data\n      </button>\n      <ol>\n        {posts?.slice(0, 10).map((value) => {\n          return (\n            <li key={value.id}>\n              <h3>{value.title}</h3>\n              <p>{value.body}</p>\n            </li>\n          );\n        })}\n      </ol>\n    </>\n  );\n};\n\nexport default {\n  title: "createStoreContext",\n};\n',
            locationsMap: {
              "createstorecontext--async-actions-context": {
                startLoc: { col: 35, line: 58 },
                endLoc: { col: 1, line: 101 },
                startBody: { col: 35, line: 58 },
                endBody: { col: 1, line: 101 },
              },
            },
          },
        },
        title: "createStoreContext",
      };
    },
    615: function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(__webpack_exports__, "basicUsage", function () {
          return basicUsage;
        });
      var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
        react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_0__
        ),
        react_state_selector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          11
        ),
        addSourceDecorator =
          (__webpack_require__(15).withSource,
          __webpack_require__(15).addSource),
        boxStyle = function (color) {
          return {
            border: "1px solid " + color,
            padding: "5px",
            borderRadius: "5px",
            width: "fit-content",
            color: "white",
          };
        },
        _a = Object(react_state_selector__WEBPACK_IMPORTED_MODULE_1__.c)(
          { a: 1, b: 2 },
          {
            hooks: {
              useA: function (_a) {
                return _a.a;
              },
              useB: function (_a) {
                return _a.b;
              },
            },
            actions: {
              incrementA: function (n) {
                return function (draft) {
                  draft.a += n;
                };
              },
              incrementB: function (n) {
                return function (draft) {
                  draft.b += n;
                };
              },
            },
          }
        ),
        Provider = _a.Provider,
        _b = _a.hooks,
        useA = _b.useA,
        useB = _b.useB,
        useActions = _a.useActions,
        RandomNumberEveryRender = function (_a) {
          var _b = _a.limit,
            limit = void 0 === _b ? 100 : _b;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "p",
            { style: boxStyle("red") },
            "Random Number = ",
            Math.round(Math.random() * limit)
          );
        },
        A = function () {
          var a = useA(),
            incrementA = useActions().incrementA;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { style: boxStyle("blue") },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "p",
              null,
              a
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  return incrementA(5);
                },
              },
              "Increment A (+5)"
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              RandomNumberEveryRender,
              null
            )
          );
        },
        B = function () {
          var b = useB(),
            incrementB = useActions().incrementB;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { style: boxStyle("blue") },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "p",
              null,
              b
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  return incrementB(5);
                },
              },
              "Increment B (+5)"
            ),
            " ",
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              RandomNumberEveryRender,
              null
            )
          );
        },
        ManualIncrement = function () {
          var _a = Object(react__WEBPACK_IMPORTED_MODULE_0__.useState)(1),
            n = _a[0],
            setN = _a[1],
            _b = useActions(),
            incrementA = _b.incrementA,
            incrementB = _b.incrementB;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { style: boxStyle("blue") },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "input",
              {
                value: n,
                type: "number",
                onChange: function (_a) {
                  var value = _a.target.value;
                  return setN(parseInt(value));
                },
              }
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  incrementA(n);
                },
              },
              "Increment A"
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  incrementB(n);
                },
              },
              "Increment B"
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              RandomNumberEveryRender,
              null
            )
          );
        },
        basicUsage = addSourceDecorator(
          function () {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "div",
              { style: { display: "flex", flexDirection: "row" } },
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                Provider,
                null,
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  "div",
                  { style: boxStyle("green") },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    "p",
                    null,
                    "Provider 1"
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    A,
                    null
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    "br",
                    null
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    B,
                    null
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    "br",
                    null
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    ManualIncrement,
                    null
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    "br",
                    null
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    RandomNumberEveryRender,
                    null
                  )
                )
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                Provider,
                null,
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  "div",
                  { style: boxStyle("green") },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    "p",
                    null,
                    "Provider 2"
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    A,
                    null
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    "br",
                    null
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    B,
                    null
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    "br",
                    null
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    ManualIncrement,
                    null
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    "br",
                    null
                  ),
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    RandomNumberEveryRender,
                    null
                  )
                )
              )
            );
          },
          {
            __STORY__:
              'import React, { CSSProperties, FC, useState } from "react";\nimport { createStoreContext } from "react-state-selector";\n\nconst boxStyle = (color: string): CSSProperties => {\n  return {\n    border: `1px solid ${color}`,\n    padding: "5px",\n    borderRadius: "5px",\n    width: "fit-content",\n    color: "white",\n  };\n};\n\nconst {\n  Provider,\n  hooks: { useA, useB },\n  useActions,\n} = createStoreContext(\n  {\n    a: 1,\n    b: 2,\n  },\n  {\n    hooks: {\n      useA: ({ a }) => {\n        return a;\n      },\n      useB: ({ b }) => {\n        return b;\n      },\n    },\n    actions: {\n      incrementA: (n: number) => (draft) => {\n        draft.a += n;\n      },\n      incrementB: (n: number) => (draft) => {\n        draft.b += n;\n      },\n    },\n  }\n);\n\nconst RandomNumberEveryRender: FC<{ limit?: number }> = ({ limit = 100 }) => {\n  // This component is designed to show that every component\n  // only subscribes to the data it needs, therefore, less renders needed\n\n  return (\n    <p style={boxStyle("red")}>\n      Random Number = {Math.round(Math.random() * limit)}\n    </p>\n  );\n};\n\nconst A: FC = () => {\n  const a = useA();\n  const { incrementA } = useActions();\n\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{a}</p>\n      <button onClick={() => incrementA(5)}>Increment A (+5)</button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst B: FC = () => {\n  const b = useB();\n  const { incrementB } = useActions();\n\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{b}</p>\n      <button onClick={() => incrementB(5)}>Increment B (+5)</button>{" "}\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst ManualIncrement: FC = () => {\n  const [n, setN] = useState(1);\n  const { incrementA, incrementB } = useActions();\n\n  return (\n    <div style={boxStyle("blue")}>\n      <input\n        value={n}\n        type="number"\n        onChange={({ target: { value } }) => setN(parseInt(value))}\n      />\n      <button\n        onClick={() => {\n          incrementA(n);\n        }}\n      >\n        Increment A\n      </button>\n      <button\n        onClick={() => {\n          incrementB(n);\n        }}\n      >\n        Increment B\n      </button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\n\nexport const basicUsage = () => {\n  return (\n    <div\n      style={{\n        display: "flex",\n        flexDirection: "row",\n      }}\n    >\n      <Provider>\n        <div style={boxStyle("green")}>\n          <p>Provider 1</p>\n          <A />\n          <br />\n          <B />\n          <br />\n          <ManualIncrement />\n          <br />\n          <RandomNumberEveryRender />\n        </div>\n      </Provider>\n      <Provider>\n        <div style={boxStyle("green")}>\n          <p>Provider 2</p>\n          <A />\n          <br />\n          <B />\n          <br />\n          <ManualIncrement />\n          <br />\n          <RandomNumberEveryRender />\n        </div>\n      </Provider>\n    </div>\n  );\n};\n\nexport default {\n  title: "createStoreContext",\n};\n',
            __ADDS_MAP__: {
              "createstorecontext--basic-usage": {
                startLoc: { col: 26, line: 108 },
                endLoc: { col: 1, line: 142 },
                startBody: { col: 26, line: 108 },
                endBody: { col: 1, line: 142 },
              },
            },
            __MAIN_FILE_LOCATION__: "/basicUsageContext.stories.tsx",
            __MODULE_DEPENDENCIES__: [],
            __LOCAL_DEPENDENCIES__: {},
            __SOURCE_PREFIX__:
              "/home/pablosz/react-state-selector/stories/createStoreContext",
            __IDS_TO_FRAMEWORKS__: {},
          }
        );
      __webpack_exports__.default = {
        parameters: {
          storySource: {
            source:
              'import React, { CSSProperties, FC, useState } from "react";\nimport { createStoreContext } from "react-state-selector";\n\nconst boxStyle = (color: string): CSSProperties => {\n  return {\n    border: `1px solid ${color}`,\n    padding: "5px",\n    borderRadius: "5px",\n    width: "fit-content",\n    color: "white",\n  };\n};\n\nconst {\n  Provider,\n  hooks: { useA, useB },\n  useActions,\n} = createStoreContext(\n  {\n    a: 1,\n    b: 2,\n  },\n  {\n    hooks: {\n      useA: ({ a }) => {\n        return a;\n      },\n      useB: ({ b }) => {\n        return b;\n      },\n    },\n    actions: {\n      incrementA: (n: number) => (draft) => {\n        draft.a += n;\n      },\n      incrementB: (n: number) => (draft) => {\n        draft.b += n;\n      },\n    },\n  }\n);\n\nconst RandomNumberEveryRender: FC<{ limit?: number }> = ({ limit = 100 }) => {\n  // This component is designed to show that every component\n  // only subscribes to the data it needs, therefore, less renders needed\n\n  return (\n    <p style={boxStyle("red")}>\n      Random Number = {Math.round(Math.random() * limit)}\n    </p>\n  );\n};\n\nconst A: FC = () => {\n  const a = useA();\n  const { incrementA } = useActions();\n\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{a}</p>\n      <button onClick={() => incrementA(5)}>Increment A (+5)</button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst B: FC = () => {\n  const b = useB();\n  const { incrementB } = useActions();\n\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{b}</p>\n      <button onClick={() => incrementB(5)}>Increment B (+5)</button>{" "}\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst ManualIncrement: FC = () => {\n  const [n, setN] = useState(1);\n  const { incrementA, incrementB } = useActions();\n\n  return (\n    <div style={boxStyle("blue")}>\n      <input\n        value={n}\n        type="number"\n        onChange={({ target: { value } }) => setN(parseInt(value))}\n      />\n      <button\n        onClick={() => {\n          incrementA(n);\n        }}\n      >\n        Increment A\n      </button>\n      <button\n        onClick={() => {\n          incrementB(n);\n        }}\n      >\n        Increment B\n      </button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\n\nexport const basicUsage = () => {\n  return (\n    <div\n      style={{\n        display: "flex",\n        flexDirection: "row",\n      }}\n    >\n      <Provider>\n        <div style={boxStyle("green")}>\n          <p>Provider 1</p>\n          <A />\n          <br />\n          <B />\n          <br />\n          <ManualIncrement />\n          <br />\n          <RandomNumberEveryRender />\n        </div>\n      </Provider>\n      <Provider>\n        <div style={boxStyle("green")}>\n          <p>Provider 2</p>\n          <A />\n          <br />\n          <B />\n          <br />\n          <ManualIncrement />\n          <br />\n          <RandomNumberEveryRender />\n        </div>\n      </Provider>\n    </div>\n  );\n};\n\nexport default {\n  title: "createStoreContext",\n};\n',
            locationsMap: {
              "createstorecontext--basic-usage": {
                startLoc: { col: 26, line: 108 },
                endLoc: { col: 1, line: 142 },
                startBody: { col: 26, line: 108 },
                endBody: { col: 1, line: 142 },
              },
            },
          },
        },
        title: "createStoreContext",
      };
    },
    616: function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(
          __webpack_exports__,
          "createStoreDev",
          function () {
            return createStoreDev;
          }
        );
      var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
        react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_0__
        ),
        react_state_selector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          11
        ),
        _stories_utils_devTools__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          113
        ),
        addSourceDecorator =
          (__webpack_require__(15).withSource,
          __webpack_require__(15).addSource),
        boxStyle = function (color) {
          return {
            border: "1px solid " + color,
            padding: "5px",
            borderRadius: "5px",
            width: "fit-content",
            color: "white",
          };
        },
        _a = Object(react_state_selector__WEBPACK_IMPORTED_MODULE_1__.b)(
          { a: 1, b: 2 },
          {
            devName: "CountExample",
            devToolsInProduction: !0,
            hooks: {
              useA: function (_a) {
                return _a.a;
              },
              useB: function (_a) {
                return _a.b;
              },
            },
            actions: {
              incrementA: function (n) {
                return function (draft) {
                  draft.a += n;
                };
              },
              incrementB: function (n) {
                return function (draft) {
                  draft.b += n;
                };
              },
            },
          }
        ),
        _b = _a.hooks,
        useA = _b.useA,
        useB = _b.useB,
        _c = _a.actions,
        incrementA = _c.incrementA,
        incrementB = _c.incrementB,
        RandomNumberEveryRender = function (_a) {
          var _b = _a.limit,
            limit = void 0 === _b ? 100 : _b;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "p",
            { style: boxStyle("red") },
            "Random Number = ",
            Math.round(Math.random() * limit)
          );
        },
        A = function () {
          var a = useA();
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { style: boxStyle("blue") },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "p",
              null,
              a
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  return incrementA(5);
                },
              },
              "Increment A (+5)"
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              RandomNumberEveryRender,
              null
            )
          );
        },
        B = function () {
          var b = useB();
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { style: boxStyle("blue") },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "p",
              null,
              b
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  return incrementB(5);
                },
              },
              "Increment B (+5)"
            ),
            " ",
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              RandomNumberEveryRender,
              null
            )
          );
        },
        ManualIncrement = function () {
          var _a = Object(react__WEBPACK_IMPORTED_MODULE_0__.useState)(1),
            n = _a[0],
            setN = _a[1];
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { style: boxStyle("blue") },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "input",
              {
                value: n,
                type: "number",
                onChange: function (_a) {
                  var value = _a.target.value;
                  return setN(parseInt(value));
                },
              }
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  incrementA(n);
                },
              },
              "Increment A"
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  incrementB(n);
                },
              },
              "Increment B"
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              RandomNumberEveryRender,
              null
            )
          );
        },
        createStoreDev = addSourceDecorator(
          function () {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,
              null,
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _stories_utils_devTools__WEBPACK_IMPORTED_MODULE_2__.a,
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "div",
                { style: boxStyle("green") },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  "br",
                  null
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  A,
                  null
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  "br",
                  null
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  B,
                  null
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  "br",
                  null
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  ManualIncrement,
                  null
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  "br",
                  null
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  RandomNumberEveryRender,
                  null
                )
              )
            );
          },
          {
            __STORY__:
              'import React, { CSSProperties, FC, useState } from "react";\nimport { createStore } from "react-state-selector";\n\nimport { DevTools } from "../../stories/utils/devTools";\n\nconst boxStyle = (color: string): CSSProperties => {\n  return {\n    border: `1px solid ${color}`,\n    padding: "5px",\n    borderRadius: "5px",\n    width: "fit-content",\n    color: "white",\n  };\n};\n\nconst {\n  hooks: { useA, useB },\n  actions: { incrementA, incrementB },\n} = createStore(\n  {\n    a: 1,\n    b: 2,\n  },\n  {\n    devName: "CountExample",\n    devToolsInProduction: true,\n    hooks: {\n      useA: ({ a }) => {\n        return a;\n      },\n      useB: ({ b }) => {\n        return b;\n      },\n    },\n    actions: {\n      incrementA: (n: number) => (draft) => {\n        draft.a += n;\n      },\n      incrementB: (n: number) => (draft) => {\n        draft.b += n;\n      },\n    },\n  }\n);\n\nconst RandomNumberEveryRender: FC<{ limit?: number }> = ({ limit = 100 }) => {\n  // This component is designed to show that every component\n  // only subscribes to the data it needs, therefore, less renders needed\n\n  return (\n    <p style={boxStyle("red")}>\n      Random Number = {Math.round(Math.random() * limit)}\n    </p>\n  );\n};\n\nconst A: FC = () => {\n  const a = useA();\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{a}</p>\n      <button onClick={() => incrementA(5)}>Increment A (+5)</button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst B: FC = () => {\n  const b = useB();\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{b}</p>\n      <button onClick={() => incrementB(5)}>Increment B (+5)</button>{" "}\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst ManualIncrement: FC = () => {\n  const [n, setN] = useState(1);\n\n  return (\n    <div style={boxStyle("blue")}>\n      <input\n        value={n}\n        type="number"\n        onChange={({ target: { value } }) => setN(parseInt(value))}\n      />\n      <button\n        onClick={() => {\n          incrementA(n);\n        }}\n      >\n        Increment A\n      </button>\n      <button\n        onClick={() => {\n          incrementB(n);\n        }}\n      >\n        Increment B\n      </button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\n\nexport const createStoreDev = () => {\n  return (\n    <>\n      <DevTools />\n      <div style={boxStyle("green")}>\n        <br />\n        <A />\n        <br />\n        <B />\n        <br />\n        <ManualIncrement />\n        <br />\n        <RandomNumberEveryRender />\n      </div>\n    </>\n  );\n};\n\nexport default {\n  title: "devTools",\n};\n',
            __ADDS_MAP__: {
              "devtools--create-store-dev": {
                startLoc: { col: 30, line: 106 },
                endLoc: { col: 1, line: 122 },
                startBody: { col: 30, line: 106 },
                endBody: { col: 1, line: 122 },
              },
            },
            __MAIN_FILE_LOCATION__: "/createStore.stories.tsx",
            __MODULE_DEPENDENCIES__: [],
            __LOCAL_DEPENDENCIES__: {},
            __SOURCE_PREFIX__:
              "/home/pablosz/react-state-selector/stories/devTools",
            __IDS_TO_FRAMEWORKS__: {},
          }
        );
      __webpack_exports__.default = {
        parameters: {
          storySource: {
            source:
              'import React, { CSSProperties, FC, useState } from "react";\nimport { createStore } from "react-state-selector";\n\nimport { DevTools } from "../../stories/utils/devTools";\n\nconst boxStyle = (color: string): CSSProperties => {\n  return {\n    border: `1px solid ${color}`,\n    padding: "5px",\n    borderRadius: "5px",\n    width: "fit-content",\n    color: "white",\n  };\n};\n\nconst {\n  hooks: { useA, useB },\n  actions: { incrementA, incrementB },\n} = createStore(\n  {\n    a: 1,\n    b: 2,\n  },\n  {\n    devName: "CountExample",\n    devToolsInProduction: true,\n    hooks: {\n      useA: ({ a }) => {\n        return a;\n      },\n      useB: ({ b }) => {\n        return b;\n      },\n    },\n    actions: {\n      incrementA: (n: number) => (draft) => {\n        draft.a += n;\n      },\n      incrementB: (n: number) => (draft) => {\n        draft.b += n;\n      },\n    },\n  }\n);\n\nconst RandomNumberEveryRender: FC<{ limit?: number }> = ({ limit = 100 }) => {\n  // This component is designed to show that every component\n  // only subscribes to the data it needs, therefore, less renders needed\n\n  return (\n    <p style={boxStyle("red")}>\n      Random Number = {Math.round(Math.random() * limit)}\n    </p>\n  );\n};\n\nconst A: FC = () => {\n  const a = useA();\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{a}</p>\n      <button onClick={() => incrementA(5)}>Increment A (+5)</button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst B: FC = () => {\n  const b = useB();\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{b}</p>\n      <button onClick={() => incrementB(5)}>Increment B (+5)</button>{" "}\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst ManualIncrement: FC = () => {\n  const [n, setN] = useState(1);\n\n  return (\n    <div style={boxStyle("blue")}>\n      <input\n        value={n}\n        type="number"\n        onChange={({ target: { value } }) => setN(parseInt(value))}\n      />\n      <button\n        onClick={() => {\n          incrementA(n);\n        }}\n      >\n        Increment A\n      </button>\n      <button\n        onClick={() => {\n          incrementB(n);\n        }}\n      >\n        Increment B\n      </button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\n\nexport const createStoreDev = () => {\n  return (\n    <>\n      <DevTools />\n      <div style={boxStyle("green")}>\n        <br />\n        <A />\n        <br />\n        <B />\n        <br />\n        <ManualIncrement />\n        <br />\n        <RandomNumberEveryRender />\n      </div>\n    </>\n  );\n};\n\nexport default {\n  title: "devTools",\n};\n',
            locationsMap: {
              "devtools--create-store-dev": {
                startLoc: { col: 30, line: 106 },
                endLoc: { col: 1, line: 122 },
                startBody: { col: 30, line: 106 },
                endBody: { col: 1, line: 122 },
              },
            },
          },
        },
        title: "devTools",
      };
    },
    617: function (module, exports, __webpack_require__) {},
    618: function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(
          __webpack_exports__,
          "createStoreContextDev",
          function () {
            return createStoreContextDev;
          }
        );
      var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0),
        react__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(
          react__WEBPACK_IMPORTED_MODULE_0__
        ),
        react_state_selector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
          11
        ),
        _stories_utils_devTools__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
          113
        ),
        addSourceDecorator =
          (__webpack_require__(15).withSource,
          __webpack_require__(15).addSource),
        boxStyle = function (color) {
          return {
            border: "1px solid " + color,
            padding: "5px",
            borderRadius: "5px",
            width: "fit-content",
            color: "white",
          };
        },
        _a = Object(react_state_selector__WEBPACK_IMPORTED_MODULE_1__.c)(
          { a: 1, b: 2 },
          {
            devName: "CountContextExample",
            devToolsInProduction: !0,
            hooks: {
              useA: function (_a) {
                return _a.a;
              },
              useB: function (_a) {
                return _a.b;
              },
            },
            actions: {
              incrementA: function (n) {
                return function (draft) {
                  draft.a += n;
                };
              },
              incrementB: function (n) {
                return function (draft) {
                  draft.b += n;
                };
              },
            },
          }
        ),
        Provider = _a.Provider,
        _b = _a.hooks,
        useA = _b.useA,
        useB = _b.useB,
        useActions = _a.useActions,
        RandomNumberEveryRender = function (_a) {
          var _b = _a.limit,
            limit = void 0 === _b ? 100 : _b;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "p",
            { style: boxStyle("red") },
            "Random Number = ",
            Math.round(Math.random() * limit)
          );
        },
        A = function () {
          var a = useA(),
            incrementA = useActions().incrementA;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { style: boxStyle("blue") },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "p",
              null,
              a
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  return incrementA(5);
                },
              },
              "Increment A (+5)"
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              RandomNumberEveryRender,
              null
            )
          );
        },
        B = function () {
          var b = useB(),
            incrementB = useActions().incrementB;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { style: boxStyle("blue") },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "p",
              null,
              b
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  return incrementB(5);
                },
              },
              "Increment B (+5)"
            ),
            " ",
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              RandomNumberEveryRender,
              null
            )
          );
        },
        ManualIncrement = function () {
          var _a = Object(react__WEBPACK_IMPORTED_MODULE_0__.useState)(1),
            n = _a[0],
            setN = _a[1],
            _b = useActions(),
            incrementA = _b.incrementA,
            incrementB = _b.incrementB;
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
            "div",
            { style: boxStyle("blue") },
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "input",
              {
                value: n,
                type: "number",
                onChange: function (_a) {
                  var value = _a.target.value;
                  return setN(parseInt(value));
                },
              }
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  incrementA(n);
                },
              },
              "Increment A"
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              "button",
              {
                onClick: function () {
                  incrementB(n);
                },
              },
              "Increment B"
            ),
            react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              RandomNumberEveryRender,
              null
            )
          );
        },
        createStoreContextDev = addSourceDecorator(
          function () {
            return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
              react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment,
              null,
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                _stories_utils_devTools__WEBPACK_IMPORTED_MODULE_2__.a,
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "br",
                null
              ),
              react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                "div",
                { style: { display: "flex", flexDirection: "row" } },
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  Provider,
                  { debugName: "Provider 1" },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    "div",
                    { style: boxStyle("green") },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      "p",
                      null,
                      "Provider 1"
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      A,
                      null
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      "br",
                      null
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      B,
                      null
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      "br",
                      null
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      ManualIncrement,
                      null
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      "br",
                      null
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      RandomNumberEveryRender,
                      null
                    )
                  )
                ),
                react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                  Provider,
                  { debugName: "Provider 2" },
                  react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                    "div",
                    { style: boxStyle("green") },
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      "p",
                      null,
                      "Provider 2"
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      A,
                      null
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      "br",
                      null
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      B,
                      null
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      "br",
                      null
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      ManualIncrement,
                      null
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      "br",
                      null
                    ),
                    react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(
                      RandomNumberEveryRender,
                      null
                    )
                  )
                )
              )
            );
          },
          {
            __STORY__:
              'import React, { CSSProperties, FC, useState } from "react";\nimport { createStoreContext } from "react-state-selector";\n\nimport { DevTools } from "../../stories/utils/devTools";\n\nconst boxStyle = (color: string): CSSProperties => {\n  return {\n    border: `1px solid ${color}`,\n    padding: "5px",\n    borderRadius: "5px",\n    width: "fit-content",\n    color: "white",\n  };\n};\n\nconst {\n  Provider,\n  hooks: { useA, useB },\n  useActions,\n} = createStoreContext(\n  {\n    a: 1,\n    b: 2,\n  },\n  {\n    devName: "CountContextExample",\n    devToolsInProduction: true,\n    hooks: {\n      useA: ({ a }) => {\n        return a;\n      },\n      useB: ({ b }) => {\n        return b;\n      },\n    },\n    actions: {\n      incrementA: (n: number) => (draft) => {\n        draft.a += n;\n      },\n      incrementB: (n: number) => (draft) => {\n        draft.b += n;\n      },\n    },\n  }\n);\n\nconst RandomNumberEveryRender: FC<{ limit?: number }> = ({ limit = 100 }) => {\n  // This component is designed to show that every component\n  // only subscribes to the data it needs, therefore, less renders needed\n\n  return (\n    <p style={boxStyle("red")}>\n      Random Number = {Math.round(Math.random() * limit)}\n    </p>\n  );\n};\n\nconst A: FC = () => {\n  const a = useA();\n  const { incrementA } = useActions();\n\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{a}</p>\n      <button onClick={() => incrementA(5)}>Increment A (+5)</button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst B: FC = () => {\n  const b = useB();\n  const { incrementB } = useActions();\n\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{b}</p>\n      <button onClick={() => incrementB(5)}>Increment B (+5)</button>{" "}\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst ManualIncrement: FC = () => {\n  const [n, setN] = useState(1);\n  const { incrementA, incrementB } = useActions();\n\n  return (\n    <div style={boxStyle("blue")}>\n      <input\n        value={n}\n        type="number"\n        onChange={({ target: { value } }) => setN(parseInt(value))}\n      />\n      <button\n        onClick={() => {\n          incrementA(n);\n        }}\n      >\n        Increment A\n      </button>\n      <button\n        onClick={() => {\n          incrementB(n);\n        }}\n      >\n        Increment B\n      </button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\n\nexport const createStoreContextDev = () => {\n  return (\n    <>\n      <DevTools />\n      <br />\n      <div\n        style={{\n          display: "flex",\n          flexDirection: "row",\n        }}\n      >\n        <Provider debugName="Provider 1">\n          <div style={boxStyle("green")}>\n            <p>Provider 1</p>\n            <A />\n            <br />\n            <B />\n            <br />\n            <ManualIncrement />\n            <br />\n            <RandomNumberEveryRender />\n          </div>\n        </Provider>\n        <Provider debugName="Provider 2">\n          <div style={boxStyle("green")}>\n            <p>Provider 2</p>\n            <A />\n            <br />\n            <B />\n            <br />\n            <ManualIncrement />\n            <br />\n            <RandomNumberEveryRender />\n          </div>\n        </Provider>\n      </div>\n    </>\n  );\n};\n\nexport default {\n  title: "devTools",\n};\n',
            __ADDS_MAP__: {
              "devtools--create-store-context-dev": {
                startLoc: { col: 37, line: 112 },
                endLoc: { col: 1, line: 150 },
                startBody: { col: 37, line: 112 },
                endBody: { col: 1, line: 150 },
              },
            },
            __MAIN_FILE_LOCATION__: "/createStoreContext.stories.tsx",
            __MODULE_DEPENDENCIES__: [],
            __LOCAL_DEPENDENCIES__: {},
            __SOURCE_PREFIX__:
              "/home/pablosz/react-state-selector/stories/devTools",
            __IDS_TO_FRAMEWORKS__: {},
          }
        );
      __webpack_exports__.default = {
        parameters: {
          storySource: {
            source:
              'import React, { CSSProperties, FC, useState } from "react";\nimport { createStoreContext } from "react-state-selector";\n\nimport { DevTools } from "../../stories/utils/devTools";\n\nconst boxStyle = (color: string): CSSProperties => {\n  return {\n    border: `1px solid ${color}`,\n    padding: "5px",\n    borderRadius: "5px",\n    width: "fit-content",\n    color: "white",\n  };\n};\n\nconst {\n  Provider,\n  hooks: { useA, useB },\n  useActions,\n} = createStoreContext(\n  {\n    a: 1,\n    b: 2,\n  },\n  {\n    devName: "CountContextExample",\n    devToolsInProduction: true,\n    hooks: {\n      useA: ({ a }) => {\n        return a;\n      },\n      useB: ({ b }) => {\n        return b;\n      },\n    },\n    actions: {\n      incrementA: (n: number) => (draft) => {\n        draft.a += n;\n      },\n      incrementB: (n: number) => (draft) => {\n        draft.b += n;\n      },\n    },\n  }\n);\n\nconst RandomNumberEveryRender: FC<{ limit?: number }> = ({ limit = 100 }) => {\n  // This component is designed to show that every component\n  // only subscribes to the data it needs, therefore, less renders needed\n\n  return (\n    <p style={boxStyle("red")}>\n      Random Number = {Math.round(Math.random() * limit)}\n    </p>\n  );\n};\n\nconst A: FC = () => {\n  const a = useA();\n  const { incrementA } = useActions();\n\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{a}</p>\n      <button onClick={() => incrementA(5)}>Increment A (+5)</button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst B: FC = () => {\n  const b = useB();\n  const { incrementB } = useActions();\n\n  return (\n    <div style={boxStyle("blue")}>\n      <p>{b}</p>\n      <button onClick={() => incrementB(5)}>Increment B (+5)</button>{" "}\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\nconst ManualIncrement: FC = () => {\n  const [n, setN] = useState(1);\n  const { incrementA, incrementB } = useActions();\n\n  return (\n    <div style={boxStyle("blue")}>\n      <input\n        value={n}\n        type="number"\n        onChange={({ target: { value } }) => setN(parseInt(value))}\n      />\n      <button\n        onClick={() => {\n          incrementA(n);\n        }}\n      >\n        Increment A\n      </button>\n      <button\n        onClick={() => {\n          incrementB(n);\n        }}\n      >\n        Increment B\n      </button>\n      <RandomNumberEveryRender />\n    </div>\n  );\n};\n\nexport const createStoreContextDev = () => {\n  return (\n    <>\n      <DevTools />\n      <br />\n      <div\n        style={{\n          display: "flex",\n          flexDirection: "row",\n        }}\n      >\n        <Provider debugName="Provider 1">\n          <div style={boxStyle("green")}>\n            <p>Provider 1</p>\n            <A />\n            <br />\n            <B />\n            <br />\n            <ManualIncrement />\n            <br />\n            <RandomNumberEveryRender />\n          </div>\n        </Provider>\n        <Provider debugName="Provider 2">\n          <div style={boxStyle("green")}>\n            <p>Provider 2</p>\n            <A />\n            <br />\n            <B />\n            <br />\n            <ManualIncrement />\n            <br />\n            <RandomNumberEveryRender />\n          </div>\n        </Provider>\n      </div>\n    </>\n  );\n};\n\nexport default {\n  title: "devTools",\n};\n',
            locationsMap: {
              "devtools--create-store-context-dev": {
                startLoc: { col: 37, line: 112 },
                endLoc: { col: 1, line: 150 },
                startBody: { col: 37, line: 112 },
                endBody: { col: 1, line: 150 },
              },
            },
          },
        },
        title: "devTools",
      };
    },
  },
  [[268, 1, 2]],
]);
//# sourceMappingURL=main.ed27fa0b068d5d94a0aa.bundle.js.map
