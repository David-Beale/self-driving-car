import { TableOfContentsContainer } from "./TableOfContentsStyle";
import TableOfContentsSection from "./TableOfContentsSection";
import { useCheckCurrentSection } from "./useCheckCurrentSection";

export default function TableOfContents({ sections }) {
  const currentSection = useCheckCurrentSection(sections);
  return (
    <TableOfContentsContainer>
      {sections.map((section, index) => (
        <TableOfContentsSection
          key={index}
          section={section}
          current={currentSection === index}
        />
      ))}
    </TableOfContentsContainer>
  );
}
