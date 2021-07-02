import CancelIcon from "@material-ui/icons/Cancel";
import { StyledCloseButton } from "./HelpStyles";

export default function CloseButton({ onClick }) {
  return (
    <StyledCloseButton>
      <CancelIcon fontSize="large" onClick={onClick} />
    </StyledCloseButton>
  );
}
