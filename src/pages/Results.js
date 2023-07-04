import { React, useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";

import Lifespan from "./results/Lifespan";
import Healthspan from "./results/Healthspan";
import IpContext from "../context/IpContext";

const Results = () => {
  const { disp, id } = useParams();
  const ipData = useContext(IpContext);

  const [resultData, setResultData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      fetch(`http://${disp}:8000/results/` + id, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setResultData(data);
        });
    }
    fetchData();
  }, []);

  // BORRAR
  const vivosA = [
    120, 120, 120, 120, 120, 120, 120, 119, 117, 112, 104, 90, 69, 44, 21, 7, 1,
    0, 0, 0, 0,
  ];
  const vivosB = [
    120, 120, 120, 120, 120, 119, 119, 117, 115, 110, 99, 86, 60, 32, 16, 3, 0,
    0, 0, 0, 0,
  ];
  const vivosC = [
    120, 120, 120, 120, 120, 120, 120, 119, 119, 116, 109, 100, 80, 64, 33, 17,
    8, 3, 1, 1, 0,
  ];
  const vivosD = [
    120, 120, 120, 120, 120, 120, 119, 118, 117, 115, 104, 90, 67, 43, 20, 6, 1,
    0, 0, 0, 0,
  ];

  const Placa1 = [
    120, 120, 120, 120, 120, 120, 120, 119, 117, 112, 104, 90, 69, 44, 21, 7, 1,
    0, 0, 0, 0,
  ];
  const Placa2 = [
    120, 120, 120, 120, 120, 120, 120, 119, 117, 112, 104, 90, 69, 44, 21, 7, 1,
    0, 0, 0, 0,
  ];
  const Placa3 = [
    120, 120, 120, 120, 120, 120, 120, 119, 117, 112, 104, 90, 69, 44, 21, 7, 1,
    0, 0, 0, 0,
  ];

  const Placa4 = [
    120, 120, 120, 120, 120, 119, 119, 117, 115, 110, 99, 86, 60, 32, 16, 3, 0,
    0, 0, 0, 0,
  ];
  const Placa5 = [
    120, 120, 120, 120, 120, 119, 119, 117, 115, 110, 99, 86, 60, 32, 16, 3, 0,
    0, 0, 0, 0,
  ];
  const Placa6 = [
    120, 120, 120, 120, 120, 119, 119, 117, 115, 110, 99, 86, 60, 32, 16, 3, 0,
    0, 0, 0, 0,
  ];

  const Placa7 = [
    120, 120, 120, 120, 120, 120, 120, 119, 119, 116, 109, 100, 80, 64, 33, 17,
    8, 3, 1, 1, 0,
  ];
  const Placa8 = [
    120, 120, 120, 120, 120, 120, 120, 119, 119, 116, 109, 100, 80, 64, 33, 17,
    8, 3, 1, 1, 0,
  ];
  const Placa9 = [
    120, 120, 120, 120, 120, 120, 120, 119, 119, 116, 109, 100, 80, 64, 33, 17,
    8, 3, 1, 1, 0,
  ];

  const Placa10 = [
    120, 120, 120, 120, 120, 120, 119, 118, 117, 115, 104, 90, 67, 43, 20, 6, 1,
    0, 0, 0, 0,
  ];
  const Placa11 = [
    120, 120, 120, 120, 120, 120, 119, 118, 117, 115, 104, 90, 67, 43, 20, 6, 1,
    0, 0, 0, 0,
  ];
  const Placa12 = [
    120, 120, 120, 120, 120, 120, 119, 118, 117, 115, 104, 90, 67, 43, 20, 6, 1,
    0, 0, 0, 0,
  ];

  const A = { 1: Placa1, 2: Placa2, 3: Placa3 };
  const B = { 4: Placa4, 5: Placa5, 6: Placa6 };
  const C = { 7: Placa7, 8: Placa8, 9: Placa9 };
  const D = { 10: Placa10, 11: Placa11, 12: Placa12 };

  const condiciones = { A: A, B: B, C: C, D: D };

  const fraccA = vivosA.map((i) => (i / 120) * 100);
  const fraccB = vivosB.map((i) => (i / 120) * 100);
  const fraccC = vivosC.map((i) => (i / 120) * 100);
  const fraccD = vivosD.map((i) => (i / 120) * 100);

  const dias = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  ];

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
