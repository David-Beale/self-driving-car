import TableOfContents from "./TableOfContents/TableOfContents";
import ContentsMain from "./ContentsMain/ContentsMain";
import styled from "styled-components";
import useSections from "./SectionData/useSections";

const HelpContentsContainer = styled.div`
  max-width: 100vw;
  position: relative;
  display: flex;
`;

export default function HelpContents() {
  const sections = useSections();
  return (
    <HelpContentsContainer>
      <TableOfContents sections={sections} />
      <ContentsMain sections={sections} />
    </HelpContentsContainer>
  );
}
