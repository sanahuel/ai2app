import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import "./Panel.css";
import "./Visualizar.css";
import IpContext from "../context/IpContext";

const Visualizar = () => {
  const ipData = useContext(IpContext);

  const [ensayos, setEnsayos] = useState({});
  const [display, setDisplay] = useState([]);

  useEffect(() => {
    async function fetchData(ipData) {
      fetch(`http://${ipData.IP}:8000/results/`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data["experimentos"].length; i++) {
            data["experimentos"][i].ip = ipData.IP;
          }

          const copy = ensayos;
          copy[ipData.nDisp] = data["experimentos"];
          setEnsayos(copy);
          setDisplay([...display, ...data["experimentos"]]);
        });
    }
    for (let i = 0; i < ipData.length; i++) {
      fetchData(ipData[i]);
    }
  }, []);

  return (
    <div className="nuevo-ensayo">
      {/* DISPOSITIVOS */}
      <div className="dispositivos-short-row">
        {ipData.map((data, index) => {
          return (
            <div
              className="dispositivo-short-container"
              key={index}
              onClick={() => {
                setDisplay(ensayos[data.nDisp]);
              }}
              onDoubleClick={() => {
                window.open(`http://${data.IP}:3001/ai2app`, "_blank");
              }}
            >
              Dispositivo {data.nDisp}
            </div>
          );
        })}
      </div>

      {/* ENSAYOS */}
      <div>
        {display.map((data) => {
          return (
            <Link
              key={data.id}
              to={`/visualize/${data.ip}/${data.id}`}
              style={{
                display: "inline-block",
                width: "48.6%",
                marginRight: "1.2%",
                textDecoration: "none",
              }}
              className={"link"}
            >
              <div className="control-container-div">
                <div className="container-header" style={{ display: "flex" }}>
                  <span>{data.nombre}</span>
                </div>
                <div className="border-div"></div>
                <div className="control-row-div">
                  <span style={{ color: "rgb(112, 112, 112)" }}>
                    {data.aplicacion[0].toUpperCase() +
                      data.aplicacion.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="control-row-div">
                  <span style={{ color: "rgb(112, 112, 112)", whiteSpace: "nowrap"  }}>
                    Proyecto {data.proyecto}
                  </span>
                </div>
                <div className="skill-box">
                  <div className="skill-bar">
                    <span className="skill"></span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Visualizar;
