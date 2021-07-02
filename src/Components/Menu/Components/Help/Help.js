import React from "react";
import { Dialog, Grow, Button } from "@material-ui/core";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";

import { StyledHelp, HelpContainer } from "./HelpStyles";
import { useDispatch, useSelector } from "react-redux";
import { toggleHelpOpen } from "../../../../redux/settings";
import CloseButton from "./CloseButton";
import HelpContents from "./HelpContents/HelpContents";

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
        maxWidth={false}
        open={open}
        onClose={onToggle}
        TransitionComponent={Transition}
      >
        <HelpContainer>
          <CloseButton onClick={onToggle} />
          <HelpContents />
        </HelpContainer>
      </Dialog>
    </StyledHelp>
  );
}
