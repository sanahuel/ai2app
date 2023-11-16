import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grafica } from "./Grafica";
import { Barras } from "./Barras";
import * as XLSX from 'xlsx';

import "./lifespanr.css";
import file from "../../icons/file.svg";

  // Error boundary component
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      // Update state to indicate an error has occurred
      return { hasError: true };
    }

    render() {
      if (this.state.hasError) {
        // Render fallback UI when there's an error
        return <div className="error-message" style={{fontWeight:"bold"}}>Ha ocurrido un error</div>;
      }

      return this.props.children; // Render children components normally
    }
  }


const Healthspan = (resultData) => {
  const { id } = useParams();
  console.log(resultData['resultData'])

  // OPTIONS
  let CantidadMovOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        display: true,
      },
      title: {
        display: false,
        text: " ",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Cantidad de Movimiento",
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

  let Indicador2Options = {
    type: "barWithErrorBars",
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Indicador 2",
        },
      },
    },
  };

  const dataToXLSX = (data) => {
    const reformattedData = [];

    for (const [cond, plates] of Object.entries(data)) {
      for (const [plate, values] of Object.entries(plates)) {
        const formattedPlate = {
          Plate: parseInt(plate),
          Cond: cond,
        };
  
        for (let i = 0; i < values.length; i++) {
          formattedPlate[`Capt. ${i + 1}`] = values[i];
        }
  
        reformattedData.push(formattedPlate);
      }
    }
  
    return reformattedData;
  }

  const exportXLSX = () => {
    const cantidadMov = dataToXLSX(resultData['resultData']['resultados']['cantidadMov'])
    // otros indicadores. . . 

    const worksheet = XLSX.utils.json_to_sheet(cantidadMov);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Movement");
    XLSX.writeFile(workbook, `Healthspan_id${id}.xlsx`, { compression: true });
  }


  return (
    <div className="nuevo-ensayo">
      {/* Si se da error no se queda la página en blanco y se puede seguir exportando a excel */}
      <ErrorBoundary>
      <div className="container-div">
        <div className="container-header">
          <span>Información</span>
        </div>
        <div className="border-div"></div>
        <div className="control-row-div" style={{ paddingTop: "10px" }}>
          <span>Ensayo</span>
          <input
            type="text"
            value={resultData['resultData']['ensayo']}
            className="input-field"
            readonly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Proyecto</span>
          <input
            type="text"
            value={resultData['resultData']['proyecto']}
            className="input-field"
            readonly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Aplicación</span>
          <input
            type="text"
            value="Healthspan"
            className="input-field"
            readonly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Nº de Placas</span>
          <input
            type="text"
            value={resultData['resultData']['placas'].length}
            className="input-field"
            style={{ width: "104px" }}
            readonly
          ></input>
        </div>
        <div className="control-row-div">
          <span>Capturas Totales</span>
          <input
            type="text"
            value={resultData['resultData']['nCapturas']}
            className="input-field"
            style={{ width: "104px" }}
            readonly
          ></input>
        </div>
        <div className="control-row-div" style={{ paddingBottom: "10px" }}>
          <span>Fecha de Inicio </span>
          <input
            type="text"
            value={resultData['resultData']['inicio']}
            className="input-field"
            style={{ width: "104px" }}
            readonly
          ></input>
        </div>
      </div>

      {/* GRAFICAS */}

      {/* LOGICA PARA GRAFICAR:
        1 PUNTO DE CAPTURA -> DIAGRAMA DE BARRAS
        1 PUNTO DE CAPTURA -> GRÁFICA TEMPORAL */}

      <Grafica 
        name={"Cantidad de Movimiento"} 
        options={CantidadMovOptions} 
        condiciones={resultData['resultData']['resultados']['cantidadMov']}
      />

      {/* <Barras name={"Indicador 2"} options={Indicador2Options} condiciones={condiciones.Indicador2}/> */}
      </ErrorBoundary>

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
            onClick={() => exportXLSX()}
          />
        </button>
        <span className="hidden-span" id="crear-span">
          Descargar .xlsx
        </span>
      </div>
    </div>
  );
};

export default Healthspan;
