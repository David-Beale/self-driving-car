import { useEffect, useState } from "react";

export const useCheckCurrentSection = (sections) => {
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      for (let i = 0; i < sectionsVisible.length; i++) {
        if (sectionsVisible[i].isVisible) {
          setCurrentSection(i);
          break;
        }
      }
    };

    const sectionsVisible = [];
    sections.forEach((section) => {
      const newObject = { isVisible: false };
      newObject.observer = new IntersectionObserver(([entry]) => {
        newObject.isVisible = entry.isIntersecting;
        onScroll();
      });
      newObject.observer.observe(section.ref.current);
      sectionsVisible.push(newObject);
    });

    return () => {
      sectionsVisible.forEach((section) => {
        section.observer.disconnect();
      });
    };
  }, [sections]);

  return currentSection;
};
