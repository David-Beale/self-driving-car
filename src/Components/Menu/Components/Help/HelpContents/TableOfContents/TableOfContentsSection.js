import { Section } from "./TableOfContentsStyle";

export default function TableOfContentsSection({ section, current }) {
  return <Section current={current}>{section.name}</Section>;
}
