import React from "react";
import { useParams } from "react-router-dom";

const Results = () => {
  const { id } = useParams();
  return (
    <div>
      <span>{id}</span>
    </div>
  );
};

export default Results;
