import "core-js/stable";
import "regenerator-runtime/runtime";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "styles/font/index.css";
import "styles/global.css";

import { Provider } from "react-redux";
import { store } from "./redux";

import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { theme } from "./styles";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DayjsUtils from "@date-io/dayjs";

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <CssBaseline />
        <App />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root"),
);
