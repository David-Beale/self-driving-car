import { createMuiTheme } from "@material-ui/core/styles";

export const makeMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MuiDrawer: {
        paper: {
          background:
            "linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.2))",
          backdropFilter: "blur(1rem)",
          backgroundColor: "transparent",
        },
        paperAnchorDockedLeft: {
          borderRight: "none",
        },
      },
      MuiBackdrop: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      },
      MuiDialog: {
        paper: {
          backdropFilter: "blur(0.2rem)",
          borderRadius: 10,
          background:
            "linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3))",
        },
      },
    },
  });
