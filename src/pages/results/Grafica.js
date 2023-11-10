import React, { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
  } from 'chart.js';
  import { mean, std } from 'mathjs';

  

import "./lifespanr.css";
import expand from "../../icons/expand.svg";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
  );


export const Grafica = ({ name, options, condiciones }) => {
    let placasRef = useRef();

    // CALC MEAN Y STD DEV

      const newCalcData = (condicion) => {
        const numPositions = Object.values(condicion)[0].length; // Assuming all keys have the same length.
        const means = Array(numPositions).fill(0);
        const stdDev = Array(numPositions).fill(0);
      
        const conditionKeys = Object.keys(condicion);
        const validKeys = conditionKeys.filter(key => open[key] === true);

        
      
        for (let j = 0; j < numPositions; j++) {
          const valuesCalcMean = []

          for (let i = 0; i < validKeys.length; i++) {
            if (condicion[validKeys[i]][j] != null){
              valuesCalcMean.push(condicion[validKeys[i]][j])
            }
          }
          means[j] = mean(valuesCalcMean);
          stdDev[j] = std(valuesCalcMean)
        }

        const meansMinusStdDeviations = means.map((mean, index) => mean - stdDev[index]);
        const meansPlusStdDeviations = means.map((mean, index) => mean + stdDev[index]);
      
        return [means, meansMinusStdDeviations, meansPlusStdDeviations];
      }
      
            
    // SET UP DATA   
      const [condData, setCondData] = useState({})

      const firstEntry = condiciones[Object.keys(condiciones)[0]];
      const secondDimensionLength = firstEntry[Object.keys(firstEntry)[0]].length; 
      const [dias, setDias] = [Array.from({ length: secondDimensionLength }, (_, index) => index + 1)];
    

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

    // RECALC COND  
    useEffect(() => {
      const newData = {};
      for (const key in condiciones) {
        newData[key] = newCalcData(condiciones[key]);
      }
      setCondData(newData);
      }, [open]);


    //SLIDE PLACAS (página de la tabla)
    const [slidePlacas, setSlidePlacas] = useState(Object.keys(condiciones).reduce((acc, key) => {
        acc[key] = 0;
        return acc;
      }, {}))
    
    const handleSlideChange = (cond, increment) => {
        if ((increment === 1 && (slidePlacas[cond] + 1) * 3 < Object.keys(condiciones[cond]).length) || (increment === -1 && slidePlacas[cond] > 0)) {
            setSlidePlacas((prevSlidePlacas) => ({
            ...prevSlidePlacas,
            [cond]: prevSlidePlacas[cond] + increment,
          }));
    }
    console.log(Object.keys(condiciones['A'])
    .slice(slidePlacas['A'] * 3, slidePlacas['A'] * 3 + 3).length)
    };



    // DATA

    let fillCounter = 0
    // let colorPallet = ['16, 122, 64', '24, 90, 189', '179, 36, 54', '196, 63, 29']
    const colorPallet = ['0, 119, 182', '191, 52, 61', '25, 107, 36', '233, 113, 50', '191, 73, 178', '78, 167, 46', '15, 158, 213']
    
    const opt = {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            display: true,
            labels: {
                filter: item => !item.text.includes('Band')
            }
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
              text: "Capturas",
            },
          },
        },
        }
    const dataLine = {
        labels: dias,
        datasets: Object.keys(condData).flatMap(key => {
            const datasets = [
              {
                label: key,
                borderColor: `rgb(${colorPallet[Math.floor(fillCounter/3)*Math.floor(colorPallet.length/4)]})`,
                backgroundColor: `rgb(${colorPallet[Math.floor(fillCounter/3)*Math.floor(colorPallet.length/4)]})`,
                fill: false,
                pointRadius: 2,
                tension: 0.1,
                data: condData[key][0],
                yAxisID: 'y',
                xAxisID: 'x'
              },
              {
                label: "BandTop" + key,
                borderColor: "transparent",
                backgroundColor: `rgb(${colorPallet[Math.floor(fillCounter/3*Math.floor(colorPallet.length/4))]}, 0.4)`,
                pointRadius: 0,
                fill: fillCounter,
                data: condData[key][2],
                yAxisID: 'y',
                xAxisID: 'x'
              },
              {
                label: "BandBottom" + key,
                type: "line",
                backgroundColor: `rgb(${colorPallet[Math.floor(fillCounter/3)*Math.floor(colorPallet.length/4)]}, 0.4)`,
                borderColor: "transparent",
                pointRadius: 0,
                fill: fillCounter,
                tension: 0,
                data: condData[key][1],
                yAxisID: 'y',
                xAxisID: 'x'
              }
            ];
        
            fillCounter += 3; // Increment fillCounter for the next iteration.
        
            return datasets;
          })                
    }

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
                    <Line
                    redraw={false}
                    options={opt}
                    data={dataLine}
                />
                </div>
            </div>
        </div>


        {/* TABLA */}
        <div ref={placasRef} style={{ maxWidth: "100%", overflowX: "hidden" }}>
            {Object.entries(condiciones).map(([key, placa]) => (
            <div className="container-div" style={{ paddingBottom: "10px" }}>
                <div
                className="container-header"
                style={{  fontWeight: "500px", display: "flex", justifyContent: "space-between"}}
                >
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

                <div style={{display: openCond[key] === false ? "none" : "block", marginTop:"10px"}}>
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
                        Captura
                    </div>
                    <div
                        className="border-div"
                        style={{ width: "90%", marginBottom: "7px" }}
                    ></div>
                    {dias.map((day) => (
                        <>
                        <div className="condicion-cell">{day}</div>
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
                    {Object.entries(placa)
                        .slice(slidePlacas[key] * 3, slidePlacas[key] * 3 + 3)
                        .map(([key, values]) => (
                    <div
                        className={`placa-div ${open[key] ? "active" : "inactive"}`}
                        onClick={() => {
                        handlePlaca(key);
                        }}
                        style={{ fontWeight: "500", width: "75px" }}
                    >
                        <div style={{ paddingBottom: "1px", textAlign: "center",whiteSpace: "nowrap" }}>
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
                    {/* Añadir divs columna vacíos para que no se desajuste por el flex */}
                    {/* SI SOLO QUEDA 1 -> AÑADIR 2 */}
                    {
                    (Object.keys(placa)
                    .slice(slidePlacas[key] * 3, slidePlacas[key] * 3 + 3).length == 1) && 
                    <>
                    <div
                        className="placa-div empty-div"
                        style={{ width: "75px", }}
                    ></div>
                    <div
                        className="placa-div empty-div"
                        style={{ width: "75px",  }}
                    ></div>
                    </>
                    }
                    {/* SI SOLO QUEDA 2 -> AÑADIR 1 */}
                    {
                    (Object.keys(placa)
                    .slice(slidePlacas[key] * 3, slidePlacas[key] * 3 + 3).length == 2) && 
                    <div
                        className="placa-div empty-div"
                        style={{ width: "75px",  }}
                    ></div>
                    }
                
                </div>
                </div>
                <button className="nueva-button" onClick={() => handleOpenCond(key)}>
                    <img
                    src={expand}
                    alt=""
                    style={{
                        filter: "invert(50%)",
                        transform:
                        openCond[key] === false ? "none" : "rotate(180deg)",
                    }}
                    />
                </button>
            </div>
            ))}
            
        </div>
        </>
    )
}