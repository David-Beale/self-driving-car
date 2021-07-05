import { useDispatch } from "react-redux";
import { setQuality } from "../../redux/quality";
import {
  QSBackground,
  QSContainer,
  QSTitle,
  QSButtonsContainer,
  QSButton,
} from "./QualitySelectStyle";
export default function QualitySelect() {
  const dispatch = useDispatch();
  const onClick = (value) => {
    dispatch(setQuality(value));
  };
  return (
    <QSBackground>
      <QSContainer>
        <QSTitle>Select Quality</QSTitle>
        <QSButtonsContainer>
          <QSButton onClick={() => onClick(1)}>Low</QSButton>
          <QSButton onClick={() => onClick(2)}>Medium</QSButton>
          <QSButton onClick={() => onClick(3)}>High</QSButton>
        </QSButtonsContainer>
      </QSContainer>
    </QSBackground>
  );
}
