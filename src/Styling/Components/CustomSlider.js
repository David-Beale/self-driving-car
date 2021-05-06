import { withStyles } from "@material-ui/core/styles";
import { Slider } from "@material-ui/core";

const styles = {
  root: {
    color: "rgb(28, 132, 255)",
  },
  thumb: {
    "&:hover": {
      boxShadow: "0px 0px 0px 8px rgba(28, 132, 255, 0.16)",
      "@media (hover: none)": {
        boxShadow: "none",
      },
    },
    "&:active": {
      boxShadow: "0px 0px 0px 14px rgba(28, 132, 255, 0.16)",
    },
  },
  valueLabel: {
    "& *": {
      backgroundColor: "rgb(28, 132, 255)",
      color: "white",
    },
  },
  markLabel: {
    color: "white",
  },
};

export default withStyles(styles)(Slider);
