import React from "react";
import { useSelector } from "react-redux";
import QualitySelect from "./QualitySelect";

export default function QualityCheck({ children }) {
  const quality = useSelector(({ quality }) => quality.quality);

  return <>{quality ? <>{children}</> : <QualitySelect />}</>;
}
