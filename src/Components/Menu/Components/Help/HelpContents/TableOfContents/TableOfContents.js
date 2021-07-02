import { useState } from "react";
import { TableOfContentsContainer } from "./TableOfContentsStyle";
import TableOfContentsSection from "./TableOfContentsSection";

export default function TableOfContents({ sections }) {
  const [currentSection, setCurrentSection] = useState(0);
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
