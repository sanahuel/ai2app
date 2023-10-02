import React, { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  

import "./lifespanr.css";
import expand from "../../icons/expand.svg";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

export const Barras = ({ name, options, condiciones }) => {
    let placasRef = useRef();
    
    // SET UP DATA    
      const [fraccA, setFraccA] = useState(0);
      const [fraccB, setFraccB] = useState(0);
      const [fraccC, setFraccC] = useState(0);
      const [fraccD, setFraccD] = useState(0);
      const [fraccE, setFraccE] = useState(0);
      const [fraccF, setFraccF] = useState(0);

    
      const condNames = Object.keys(condiciones).map(key => "Cond. " + key);  

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

    // RECALC COND
    let calculateCond = (cond) => {
      // array vacio de igual long. que las placas
      let keys = Object.keys(condiciones[cond]);
      let val = 0;
      let n = 0;
      for (let key in condiciones[cond]) {
        if(open[key]===true){
            val += condiciones[cond][key];
            n += 1;
        }
      }
      val = val/n;
      return val;
    };
  
    useEffect(() => {
      setFraccA(calculateCond("A"))
      setFraccB(calculateCond("B"));
      setFraccC(calculateCond("C"));
      setFraccD(calculateCond("D"));
      setFraccE(calculateCond("E"));
      setFraccF(calculateCond("F"));

    }, [open]);

    // DATA
    let data = {
      labels: condNames,
      datasets: [
        // más tonos #187741 #155239 #A8EEC1 #E3FCEC
        {
          label: "",
          data: [fraccA, fraccB, fraccC, fraccD, fraccE, fraccF],
          borderColor: "#249D57",
          backgroundColor: "#249D57",
        },
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
                    <Bar options={options} data={data} />
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