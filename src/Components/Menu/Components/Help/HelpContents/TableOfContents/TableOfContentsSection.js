import { Section } from "./TableOfContentsStyle";

export default function TableOfContentsSection({ section, current }) {
  const onClick = () => {
    section.ref.current.scrollIntoView();
  };
  return (
    <Section current={current} onClick={onClick}>
      {section.name}
    </Section>
  );
}
