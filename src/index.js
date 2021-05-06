import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import Styling from "./Styling/Styling";
import store from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <Styling>
      <App />
    </Styling>
  </Provider>,

  document.getElementById("root")
);
