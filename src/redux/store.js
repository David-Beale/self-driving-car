import { configureStore } from "@reduxjs/toolkit";

import roadWorks from "./roadWorks";
import settings from "./settings";
import mode from "./mode";

export default configureStore({
  reducer: {
    roadWorks,
    settings,
    mode,
  },
});
