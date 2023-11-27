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
      try {
        const response = await fetch(`http://${ipData.IP}:8000/results/`);
        const data = await response.json();
        console.log('DATA', data)
  
        for (let i = 0; i < data["experimentos"].length; i++) {
          data["experimentos"][i].ip = ipData.IP;
        }
  
        return {
          nDisp: ipData.nDisp,
          experimentos: data["experimentos"]
        };
      } catch (error) {
        console.error(`Error fetching data for IP ${ipData.IP}:`, error);
        return null;
      }
    }
  
    async function fetchAllData() {
      try {
        const fetchedData = await Promise.all(ipData.map(async (data) => {
          return await fetchData(data);
        }));
  
        console.log('FETCHED', fetchedData)

        const updatedEnsayos = {...ensayos};
        const updatedDisplay = [];
        console.log('for each....')
        fetchedData.forEach(item => {
          if (item) {
            updatedEnsayos[item.nDisp] = item.experimentos;
            updatedDisplay.push(...item.experimentos);
          }
        });
        console.log('ENSAYOS', updatedEnsayos)
        console.log('DISPLAY', updatedDisplay)
  
        setEnsayos(updatedEnsayos);
        setDisplay(prevDisplay => [...prevDisplay, ...updatedDisplay]);
      } catch (error) {
        console.error("Error fetching multiple IPs:", error);
      }
    }
  
    if (ipData.length > 0) {
      fetchAllData();
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
                window.open(`http://${data.IP}:3001/`, "_blank");
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
