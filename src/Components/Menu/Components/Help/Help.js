import React, { useState } from "react";
import { Dialog, Grow, Button } from "@material-ui/core";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";

import { StyledHelp, HelpContainer, HelpRow } from "./HelpStyles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />;
});

export default function Instructions() {
  const [open, setOpen] = useState(true);

  const onClose = () => {
    setOpen(false);
  };

  return (
    <StyledHelp>
      <Button onClick={() => setOpen(true)}>
        <ContactSupportIcon fontSize="large" />
      </Button>
      <Dialog
        maxWidth={"lg"}
        open={open}
        onClose={onClose}
        onClick={onClose}
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
