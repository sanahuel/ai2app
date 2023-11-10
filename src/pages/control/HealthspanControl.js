import React from "react";
import { Grafica } from "../results/Grafica";
import { Barras } from "../results/Barras";


const HealthspanControl = (resultData) => {
  console.log(resultData)
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
    


  return (
    <>
      <Grafica name={"Cantidad de Movimiento"} options={CantidadMovOptions} condiciones={resultData['resultData']}/>
    </>
  );
};

export default HealthspanControl;
