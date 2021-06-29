import React from "react";
import { Dialog, Grow, Button } from "@material-ui/core";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";

import { StyledHelp, HelpContainer, HelpRow } from "./HelpStyles";
import { useDispatch, useSelector } from "react-redux";
import { toggleHelpOpen } from "../../../../redux/settings";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

export default function Instructions() {
  const dispatch = useDispatch();
  const open = useSelector(({ settings }) => settings.helpOpen);

  const onToggle = () => {
    dispatch(toggleHelpOpen());
  };

  return (
    <StyledHelp>
      <Button onClick={onToggle}>
        <ContactSupportIcon fontSize="large" />
      </Button>
      <Dialog
        maxWidth={"lg"}
        open={open}
        onClose={onToggle}
        TransitionComponent={Transition}
      >
        <HelpContainer>
          <HelpRow> Click the road to spawn and move your car</HelpRow>
          <HelpRow> Drag and scroll the map to explore</HelpRow>
          <HelpRow>
            Use the menu to switch between the fastest and shortest route
          </HelpRow>
          <HelpRow>
            Select the compare mode to view both routes, then choose a mode to
            start moving
          </HelpRow>
        </HelpContainer>
      </Dialog>
    </StyledHelp>
  );
}
