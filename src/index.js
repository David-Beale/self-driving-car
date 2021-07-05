import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import OrientationCheck from "./Components/OrientationWarning/OrientationCheck";
import QualityCheck from "./Components/QualitySelect/QualityCheck";
import Styling from "./Styling/Styling";
import store from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <Styling>
      <OrientationCheck>
        <QualityCheck>
          <App />
        </QualityCheck>
      </OrientationCheck>
    </Styling>
  </Provider>,

  document.getElementById("root")
);
