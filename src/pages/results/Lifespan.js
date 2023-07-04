import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import exportToExcel from "./exportToExcel";

import "./lifespanr.css";
import file from "../../icons/file.svg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Lifespan = (resultData) => {
  const [ensayos, setEnsayos] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    let formatData = (data) => {
      return data.map((str) => {
        return {
          title: " ",
          start: str,
          allDay: false,
          color: "#ddd",
        };
      });
    };
    async function fetchData() {
      const response = await fetch("/results/20");
      const data = await response.json();
      console.log(data);
      //setEnsayos(formatData(data.capturas));
    }
    fetchData();
    // console.log(capturas);
  }, []);

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

  const [open, setOpen] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    12: true,
  });

  let placasRef = useRef();

  let calculateCond = (cond) => {
    // array vacio de igual long. que las placas
    let keys = Object.keys(condiciones[cond]);
    let vivos = Array(condiciones[cond][keys[0]].length).fill(0);
    for (let key in condiciones[cond]) {
      for (let i = 0; i < Object.keys(condiciones[cond][key]).length; i++) {
        vivos[i] += condiciones[cond][key][i];
      }
    }
    let n = vivos[0]; //cambiar (de donde leer num max de celegans??) el primer dia puede haber muerto alguno ya
    vivos.map((i) => (i / n) * 100);
    // console.log(vivos);
    return vivos;
  };

  useEffect(() => {
    let fraccA = calculateCond("A");
    let fraccB = calculateCond("B");
    let fraccC = calculateCond("C");
    let fraccD = calculateCond("D");
  });

  let data = {
    labels: dias,
    datasets: [
      {
        label: "Cond. A",
        data: fraccA,
        borderColor: "#0608B4",
        backgroundColor: "#0608B4",
      },
      {
        label: "Cond. B",
        data: fraccB,
        borderColor: "#0077b6",
        backgroundColor: "#0077b6",
      },
      {
        label: "Cond. C",
        data: fraccC,
        borderColor: "#00b4d8",
        backgroundColor: "#00b4d8",
      },
      {
        label: "Cond. D",
        data: fraccD,
        borderColor: "#90e0ef",
        backgroundColor: "#90e0ef",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        display: true,
      },
      title: {
        display: false,
        text: "Lifespan R",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Fracción Vivos %",
        },
      },
      x: {
        title: {
          display: true,
          text: "Días",
        },
      },
    },
  };

  let handlePlaca = (key) => {
    setOpen({ ...open, [key]: !open[key] });
  };

  const handleExport = () => {
    exportToExcel([
      { dia: 1, CondA: 100, condB: 200, condC: 300, condD: 400 },
      { dia: 2, CondA: 100, condB: 200, condC: 300, condD: 400 },
    ]);
  };

  return (
    <div className="nuevo-ensayo">
      <div className="container-div">
        <div className="container-header">
          <span>Información</span>
        </div>
        <div className="border-div"></div>
        <div className="control-row-div" style={{ paddingTop: "10px" }}>
          <span>Ensayo</span>
          <input
            type="text"
            value=" Lifespan #0"
            className="input-field"
            readOnly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Proyecto</span>
          <input
            type="text"
            value=" xxxxx"
            className="input-field"
            readOnly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Aplicación</span>
          <input
            type="text"
            value=" Lifespan"
            className="input-field"
            readOnly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Nº de Placas</span>
          <input
            type="text"
            value=" 25"
            className="input-field"
            style={{ width: "104px" }}
            readOnly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Capturas Totales</span>
          <input
            type="text"
            value=" 30"
            className="input-field"
            style={{ width: "104px" }}
            readOnly
          ></input>
        </div>
        <div className="control-row-div" style={{ paddingBottom: "10px" }}>
          <span>Fecha de Inicio </span>
          <input
            type="text"
            value=" 01/02/2023"
            className="input-field"
            style={{ width: "104px" }}
            readOnly
          ></input>
        </div>
      </div>

      <div>
        <div className="container-div" style={{ padding: "20px" }}>
          {/* GRAFICA */}
          <Line options={options} data={data} />
        </div>
      </div>
      {/* TABLA */}
      {/* <div
        className="container-div"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
        ref={placasRef}
      >
        {Object.entries(condiciones).map(([key, placa]) => (
          <div style={{ textAlign: "center", padding: "15px", width: "200px" }}>
            <div style={{ fontWeight: "500", marginBottom: "5px" }}>
              Condición {key}
            </div>
            {Object.entries(placa).map(([key, value]) => (
              <div
                draggable
                className={`placa-div ${open[key] ? "active" : "inactive"}`}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                }}
                onDragEnd={(e) => dragDrop(e)}
                onClick={() => {
                  handlePlaca(key);
                }}
                style={{ marginBottom: "7px" }}
              >
                Placa {key}
              </div>
            ))}
          </div>
        ))}
      </div> */}

      <div ref={placasRef} style={{ maxWidth: "100%", overflowX: "hidden" }}>
        {Object.entries(condiciones).map(([key, placa]) => (
          <div className="container-div" style={{ paddingBottom: "10px" }}>
            <div
              className="container-header"
              style={{ paddingBottom: "10px", fontWeight: "500px" }}
            >
              <span>Condición {key}</span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <div
                style={{
                  fontWeight: "500",
                  marginBottom: "5px",
                  width: "75px",
                  textAlign: "center",
                }}
              >
                <div style={{ paddingBottom: "1px", textAlign: "center" }}>
                  Día
                </div>
                <div
                  className="border-div"
                  style={{ width: "90%", marginBottom: "7px" }}
                ></div>
                {[...Array(21).keys()].map((day) => (
                  <>
                    <div className="condicion-cell">{day + 1}</div>
                    <div
                      className="border-div"
                      style={{
                        width: "140%",
                        left: "-17%",
                        marginBottom: "5px",
                      }}
                    ></div>
                  </>
                ))}
              </div>
              {Object.entries(placa).map(([key, values]) => (
                <div
                  className={`placa-div ${open[key] ? "active" : "inactive"}`}
                  onClick={() => {
                    handlePlaca(key);
                  }}
                  style={{ fontWeight: "500", width: "75px" }}
                >
                  <div style={{ paddingBottom: "1px", textAlign: "center" }}>
                    Placa {key}
                  </div>
                  <div
                    className="border-div"
                    style={{ width: "110%", left: "-8%", marginBottom: "7px" }}
                  ></div>

                  <div>
                    {values.map((value) => (
                      <>
                        <div className="condicion-cell">{value}</div>
                        <div
                          className="border-div"
                          style={{
                            left: "-190%",
                            width: "450%",
                            marginBottom: "5px",
                          }}
                        ></div>
                      </>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* EXPORT */}
      <div className="crear-div">
        <button className="crear-button">
          <img
            src={file}
            alt=""
            style={{
              position: "relative",
              top: "1px",
            }}
            onClick={() => {
              handleExport();
            }}
          />{" "}
        </button>
        <span className="hidden-span" id="crear-span">
          Descargar .xlsx
        </span>
      </div>
    </div>
  );
};

export default Lifespan;
