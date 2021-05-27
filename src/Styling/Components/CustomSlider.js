import { withStyles } from "@material-ui/core/styles";
import { Slider } from "@material-ui/core";

const styles = {
  root: {
    color: "rgb(5,132,178)",
  },
  thumb: {
    color: "lightgrey",
    height: "20px",
    width: "20px",
    marginLeft: "-10px",
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
    left: "calc(-50% + 2px)",
    "& *": {
      backgroundColor: "rgb(28, 132, 255)",
      color: "white",
    },
  },
  markLabel: {
    color: "white",
  },
  rail: {
    height: "10px",
    borderRadius: "5px",
  },
  track: {
    height: "10px",
    borderRadius: "5px",
  },
};

export default withStyles(styles)(Slider);
