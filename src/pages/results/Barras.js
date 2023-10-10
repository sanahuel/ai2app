import React, { useState, useRef, useEffect } from "react";
import { Chart } from "react-chartjs-2";
import 'chartjs-chart-error-bars'; // Import the error bars plugin

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Tooltip
    } from 'chart.js';

  import {
    BarWithErrorBarsController,
    BarWithErrorBar
} from "chartjs-chart-error-bars";
  
  

import "./lifespanr.css";
import expand from "../../icons/expand.svg";

ChartJS.register(
    BarWithErrorBarsController,
    BarWithErrorBar,
    CategoryScale,
    LinearScale,
    Tooltip
  );

export const Barras = ({ name, options, condiciones }) => {
    const placasRef = useRef({})
      
    // CALC MEDIA Y STD DEV
    const calcData = (condicion) => {
        let mean = 0;
        let stdDeviation = 0;
        let n = 0;
        const conditionKeys = Object.keys(condicion);
        const values = [];
      
        for (let i = 0; i < conditionKeys.length; i++) {
          const key = conditionKeys[i];
          const value = condicion[key];
          if(open[key]===true){
          values.push(value); // Collect values for the given condition.
          mean += value;
          n += 1;
          }
        }
      
        if (n > 0) {
          mean = mean / n;
          // Calculate the standard deviation using the collected values.
          const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
          const variance = squaredDifferences.reduce((acc, value) => acc + value, 0) / n;
          stdDeviation = Math.sqrt(variance);
        }
      
        return [mean, stdDeviation];
      };
      
    
    // OPEN PLACAS
    // en función del idPlacas del objeto condiciones
    const tempPlacas = Object.keys(condiciones).reduce((acc, key) => {
        const numericKeys = Object.keys(condiciones[key]).map(Number);
        numericKeys.forEach((numericKey) => {
        acc[numericKey] = true;
        });
        return acc;
    }, {});

    const [open, setOpen] = useState(tempPlacas); // {1:true, 2:true, ...}

    let handlePlaca = (key) => {
        setOpen({ ...open, [key]: !open[key] });
      };
    
    // OPEN CONDICIONES
    const [openCond, setOpenCond] = useState( Object.keys(condiciones).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {})
      )
    
    let handleOpenCond = (key) => {
    setOpenCond({...openCond, [key]: !openCond[key]});
    }

    //SLIDE PLACAS
    const [slidePlacas, setSlidePlacas] = useState(Object.keys(condiciones).reduce((acc, key) => {
        acc[key] = 0;
        return acc;
      }, {}))
    
    const handleSlideChange = (cond, increment) => {
        if ((increment === 1 && (slidePlacas[cond] + 1) * 6 < Object.keys(condiciones[cond]).length) || (increment === -1 && slidePlacas[cond] > 0)) {
            setSlidePlacas((prevSlidePlacas) => ({
            ...prevSlidePlacas,
            [cond]: prevSlidePlacas[cond] + increment,
          }));
    }
    };

    // SET UP DATA    
    const [condData, setCondData] = useState({});
    // const [fraccB, setFraccB] = useState(0);
    // const [fraccC, setFraccC] = useState(0);
    // const [fraccD, setFraccD] = useState(0);
    // const [fraccE, setFraccE] = useState(0);
    // const [fraccF, setFraccF] = useState(0);

    
    const condNames = Object.keys(condiciones).map(key => "Cond. " + key);    


    // RECALC COND
    // let calculateCond = (cond) => {
    //   let val = 0;
    //   let n = 0;
    //   for (let key in condiciones[cond]) {
    //     if(open[key]===true){
    //         val += condiciones[cond][key];
    //         n += 1;
    //     }
    //   }
    //   val = val/n;
    //   return val;
    // };
  
    useEffect(() => {
    const newData = {};
    for (const key in condiciones) {
      newData[key] = calcData(condiciones[key]);
    }
    setCondData(newData);
    }, [open]);

    // DATA
    let data = {
      labels: condNames,
      datasets: [
        {
          label: "",
          data: Object.entries(condData).map(([key, value]) => ({
            y: value[0],
            yMin: value[0] - value[1],
            yMax: value[0] + value[1],
          })),
          borderColor: "#249D57",
          backgroundColor: "#249D57",
        }
      ],
    };

    const step = 1;

    return(
        <>

        {/* GRAFICA */}
        <div>
            <div className="container-div">
                <div className="container-header">
                    <span>{name}</span>
                </div>
                <div className="border-div"></div>
                <div style={{ padding: "20px" }}>
                    <Chart  type={"barWithErrorBars"} options={options} data={data}/>
                </div>
            </div>
        </div>

        {/* TABLA */}
        <div ref={placasRef} style={{ maxWidth: "100%", overflowX: "hidden" }}>
            {Object.entries(condiciones).map(([key, placa]) => (
            <div className="container-div" style={{ paddingBottom: "10px" }}>
                <div className="container-header" style={{ fontWeight: "500px", display: "flex", justifyContent: "space-between" }}>
                    <span>Condición {key}</span>
                    <span style={{ display: openCond[key] === false ? "none" : "block"}}>
                    <button className="nueva-button" onClick={() => handleSlideChange(key, -1)} style={{width:"16px", height:"16px", marginRight:"3px"}}>
                    <img
                    src={expand}
                    alt=""
                    style={{
                        filter: "invert(50%)",
                        transform: "rotate(90deg)",
                        width:"16px",
                        height:"16px"
                    }}
                    />
                </button>
                <button className="nueva-button" onClick={() => handleSlideChange(key, 1)} style={{width:"16px", height:"16px"}}>
                    <img
                    src={expand}
                    alt=""
                    style={{
                        filter: "invert(50%)",
                        transform: "rotate(270deg)",
                        width:"16px",
                        height:"16px"
                    }}
                    />
                </button>
                    </span>
                </div>
                <div className="border-div"></div>

                <div style={{ display: openCond[key] === false ? "none" : "block", marginTop: "10px" }}>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                    {Object.entries(placa)
                        .slice(slidePlacas[key] * 6, slidePlacas[key] * 6 + 6) // Slice the object to show 6 elements based on 'step'
                        .map(([key, value]) => (
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
                            <div className="condicion-cell">{value}</div>
                            </div>
                        </div>
                        ))}
                    {[...Array(6 - Object.entries(placa).slice(slidePlacas[key] * 6, slidePlacas[key] * 6 + 6).length)].map((_, index) => (
                        <div
                            key={`empty-${index}`}
                            className="placa-div empty-div"
                            style={{ width: "75px", visibility: "hidden" }}
                        ></div>
                    ))}

                    </div>
                </div>
                <button className="nueva-button" onClick={() => handleOpenCond(key)}>
                    <img
                    src={expand}
                    alt=""
                    style={{
                        filter: "invert(50%)",
                        transform: openCond[key] === false ? "none" : "rotate(180deg)",
                    }}
                    />
                </button>
            </div>
            ))}
        </div>
        </>
    )
}