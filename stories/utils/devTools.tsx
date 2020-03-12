import "../../src/plugins/devTools";
import "./public/style.css";

import React, { FC, useEffect, useMemo } from "react";

let open = false;

export const DevTools: FC = () => {
  const isDevTools = useMemo(() => {
    return (
      typeof window !== "undefined" &&
      typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
    );
  }, []);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined" &&
      !open
    ) {
      try {
        window.__REDUX_DEVTOOLS_EXTENSION__.open("right");
      } catch (err) {}
      open = true;
    }
  }, []);

  return isDevTools ? (
    <div
      style={{
        border: "1px solid white",
        borderRadius: "5px",
        width: "fit-content",
        padding: "5px",
      }}
    >
      <p style={{ color: "white" }}>
        Check the <b>Redux DevTools</b> extension and see the current state,
        history and actions dispatched to the store.
      </p>
    </div>
  ) : (
    <div
      style={{
        border: "1px solid white",
        borderRadius: "5px",
        width: "fit-content",
        padding: "5px",
        color: "white",
      }}
    >
      Install <b>Redux DevTools</b> in{" "}
      <a
        style={{ color: "white" }}
        target="_blank"
        rel="noopener noreferrer"
        href="https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en"
      >
        <b>Chrome</b>
      </a>{" "}
      or{" "}
      <a
        style={{ color: "white" }}
        target="_blank"
        rel="noopener noreferrer"
        href="https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/"
      >
        <b>Firefox</b>
      </a>
    </div>
  );
};
