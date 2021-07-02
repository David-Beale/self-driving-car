import { MainSectionContainer, SectionTitle } from "./ContentsMainStyle";

export default function MainSection({ section }) {
  const Data = section.data;
  return (
    <MainSectionContainer ref={section.ref}>
      <SectionTitle>{section.name}</SectionTitle>
      <Data />
    </MainSectionContainer>
  );
}
