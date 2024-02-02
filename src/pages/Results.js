import { React, useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";

import Lifespan from "./results/Lifespan";
import Healthspan from "./results/Healthspan";
import IpContext from "../context/IpContext";

const Results = () => {
  console.log("sssssss");
  console.log(new Date());
  const { disp, id } = useParams();

  const [resultData, setResultData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      fetch(`http://${disp}:8000/results/` + id, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("inside:", new Date());
          console.log(data);
          setResultData(data);
        });
    }
    fetchData();
  }, []);

  return (
    <div>
      {resultData.aplicacion === "lifespan" && (
        <Lifespan resultData={resultData} />
      )}
      {resultData.aplicacion === "healthspan" && (
        <Healthspan resultData={resultData} />
      )}
    </div>
  );
};

export default Results;
