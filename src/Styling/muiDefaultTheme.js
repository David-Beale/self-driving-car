import { createMuiTheme } from "@material-ui/core/styles";

export const makeMuiTheme = () =>
  createMuiTheme({
    palette: {
      primary: {
        main: "rgb(25,120,216)",
      },
    },
    overrides: {
      MuiDrawer: {
        paper: {
          background:
            "linear-gradient(to right bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2))",
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
      MuiPaper: {
        rounded: {
          borderRadius: 0,
        },
      },
      MuiDialog: {
        paperWidthFalse: {
          maxHeight: "100%",
          maxWidth: "100%",
        },
        paper: {
          background: "rgba(255,255,255,0.9)",
          margin: "0",
        },
      },
    },
  });
