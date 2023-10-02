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
  Legend,
} from "chart.js";

import "./lifespanr.css";
import expand from "../../icons/expand.svg";

import Gradient from "javascript-color-gradient";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );


export const Grafica = ({ name, options, condiciones }) => {
    let placasRef = useRef();

    // PRUEBA COLOR
    let hex = "#0077b6"

    hex = hex.replace(/^#/, '');

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const darkness = 20 / 100;

    const newR = Math.max(0, Math.floor(r - r * darkness));
    const newG = Math.max(0, Math.floor(g - g * darkness));
    const newB = Math.max(0, Math.floor(b - b * darkness));

    const newHex =
        '#' +
        (newR < 16 ? '0' : '') + newR.toString(16) +
        (newG < 16 ? '0' : '') + newG.toString(16) +
        (newB < 16 ? '0' : '') + newB.toString(16);
    
    const gradientArray = new Gradient()
    .setColorGradient(newHex, "#FFFFFF")
    .setMidpoint(10)
    .getColors();

    console.log(gradientArray);


    // SET UP DATA    
      const [fraccA, setFraccA] = useState([]);
      const [fraccB, setFraccB] = useState([]);
      const [fraccC, setFraccC] = useState([]);
      const [fraccD, setFraccD] = useState([]);
    
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
    let calculateCond = (cond) => {
      // array vacio de igual long. que las placas
      let keys = Object.keys(condiciones[cond]);
      let vivos = Array(condiciones[cond][keys[0]].length).fill(0);
      for (let key in condiciones[cond]) {
        if(open[key]===true){
        for (let i = 0; i < Object.keys(condiciones[cond][key]).length; i++) {
            vivos[i] += condiciones[cond][key][i];
        }}
      }
      let n = vivos[0]; //cambiar (de donde leer num max de celegans??) el primer dia puede haber muerto alguno ya
      vivos = vivos.map((i) => (i / n) * 100);
      return vivos;
    };
  
    useEffect(() => {
      setFraccA(calculateCond("A"))
      setFraccB(calculateCond("B"));
      setFraccC(calculateCond("C"));
      setFraccD(calculateCond("D"));
    }, [open]);

    //SLIDE PLACAS
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
    let data = {
      labels: dias,
      datasets: [
        // más tonos #187741 #155239 #A8EEC1 #E3FCEC
        {
          label: "Cond. A",
          data: fraccA,
        //   borderColor: "#249D57",
        //   backgroundColor: "#249D57",
          borderColor: gradientArray[0], 
          backgroundColor: gradientArray[0],
        },
        {
          label: "Cond. B",
          data: fraccB,
        //   borderColor: "#38C172",
        //   backgroundColor: "#38C172",
        borderColor: gradientArray[1], 
        backgroundColor: gradientArray[1],
        },
        {
          label: "Cond. C",
          data: fraccC,
        //   borderColor: "#74D99F",
        //   backgroundColor: "#74D99F",
            borderColor: gradientArray[4], 
            backgroundColor: gradientArray[4],
        },
        {
          label: "Cond. D",
          data: fraccD,
        //   borderColor: "#B9F6CA",
        //   backgroundColor: "#B9F6CA",
            borderColor: gradientArray[7], 
            backgroundColor: gradientArray[7],
        },
      ],
    };
  

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
                    <Line options={options} data={data} />
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