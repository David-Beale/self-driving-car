import { ContentsContainer, ContentsSubContainer } from "./ContentsMainStyle";
import MainSection from "./MainSection";

export default function ContentsMain({ sections }) {
  return (
    <ContentsContainer>
      <ContentsSubContainer>
        {sections.map((section, index) => (
          <MainSection key={index} section={section} />
        ))}
      </ContentsSubContainer>
    </ContentsContainer>
  );
}
