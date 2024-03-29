import { React, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Gradient from "javascript-color-gradient";
import add from "../../icons/add.svg";
import "./NewPlate.css";
import refresh from "../../icons/refresh.svg";

const NewPlate = () => {
  const [filas, setFilas] = useState(0);
  const [columnas, setColumnas] = useState(0);
  const [numCond, setNumCond] = useState(0);
  const [width, setWidth] = useState("50px");
  const [height, setHeight] = useState("50px");
  const [isDragging, setIsDragging] = useState(false);
  const [isSelected, setIsSelected] = useState([]);
  const [colorGradient, setColorGradient] = useState([]);
  const [condArray, setCondArray] = useState([]);

  const condRef = useRef();
  const nombre = useRef();

  const navigate = useNavigate();

  const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    if (filas * columnas < 3) {
      setWidth("150px");
      setHeight("150px");
    } else if (filas * columnas < 6) {
      setWidth("100px");
      setHeight("100px");
    } else if (filas * columnas < 16) {
      setWidth("75px");
      setHeight("75px");
    } else if (filas * columnas < 74 && filas < 8) {
      setWidth("50px");
      setHeight("50px");
    } else if (filas < 10 && columnas < 15) {
      setWidth("40px");
      setHeight("40px");
    } else {
      setWidth("30px");
      setHeight("30px");
    }
  }, [filas, columnas]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const changePlate = (i, j) => {
    const matrix = [...condArray];
    const row = [...matrix[i]];
    const index = isSelected.findIndex((element) => element !== 0) + 1;
    if (row[j] === index && !isDragging) {
      row[j] = 0;
    } else {
      row[j] = index;
    }
    matrix[i] = row;
    setCondArray(matrix);
  };

  const parseMatrix = () => {
    const result = {};

    condArray.forEach((row, i) => {
      row.forEach((option, j) => {
        if (option > 0) {
          if (result[option]) {
            result[option].push(`${i},${j}`);
          } else {
            result[option] = [`${i},${j}`];
          }
        }
      });
    });

    return result;
  };

  const postPlate = () => {
    async function fetchPost(parsedCondArray) {
      fetch(`http://${window.location.hostname}:8000/config/placas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.current.value,
          numCondiciones: String(Object.keys(parsedCondArray).length),
          filas: filas,
          columnas: columnas,
          condiciones: parsedCondArray,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message == 1) {
            navigate("/config");
          } else if (data.error === "nombre") {
            alert("Nombre de configuración ya asignado");
          }
        });
    }

    if (nombre.current.value === "") {
      alert("La  configuración debe tener nombre");
      return;
    }

    let parsedCondArray = parseMatrix();

    let maxElement = condArray[0][0];
    for (let i = 0; i < condArray.length; i++) {
      for (let j = 0; j < condArray[i].length; j++) {
        if (condArray[i][j] > maxElement) {
          maxElement = condArray[i][j];
        }
      }
    }
    if (maxElement == 0) {
      alert("La placa no debe tener condiciones");
      return;
    }

    fetchPost(parsedCondArray);
  };

  return (
    <div className="nuevo-ensayo">
      <div className="container-div">
        <div className="container-header">
          <span>Configuración de Distribución de Condiciones por Placa</span>
        </div>
        <div className="border-div" style={{ width: "420px" }}></div>
        <div className="container-content">
          <div className="input-div">
            <span>Nombre de configuración</span>
            <input
              className="input-field"
              placeholder=""
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              ref={nombre}
            />
          </div>
          <div className="input-div">
            <span>Nº de Filas</span>
            <input
              className="input-field"
              type="number"
              placeholder=""
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              min={1}
              style={{ width: "104px" }}
              onChange={(e) => {
                setFilas(e.target.value);
                setCondArray(
                  Array(parseFloat(e.target.value)).fill(
                    Array(parseFloat(columnas)).fill(0)
                  )
                );
                if (
                  numCond >
                  parseFloat(e.target.value) * parseFloat(columnas)
                ) {
                  setNumCond(parseFloat(e.target.value) * parseFloat(columnas));
                  condRef.current.value =
                    parseFloat(e.target.value) * parseFloat(columnas);
                  setColorGradient(
                    new Gradient()
                      .setColorGradient("#027df7", "#dcecfc")
                      .setMidpoint(
                        parseFloat(e.target.value) * parseFloat(columnas) + 1
                      )
                      .getColors()
                  );
                }
              }}
            />
          </div>
          <div className="input-div">
            <span>Nº de Columnas</span>
            <input
              className="input-field"
              type="number"
              placeholder=""
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              min={1}
              style={{ width: "104px" }}
              onChange={(e) => {
                setColumnas(e.target.value);
                setCondArray(
                  Array(parseFloat(filas)).fill(
                    Array(parseFloat(e.target.value)).fill(0)
                  )
                );
                if (numCond > parseFloat(filas) * parseFloat(e.target.value)) {
                  setNumCond(parseFloat(filas) * parseFloat(e.target.value));
                  condRef.current.value =
                    parseFloat(filas) * parseFloat(e.target.value);
                  setColorGradient(
                    new Gradient()
                      .setColorGradient("#027df7", "#dcecfc")
                      .setMidpoint(
                        parseFloat(filas) * parseFloat(e.target.value) + 1
                      )
                      .getColors()
                  );
                }
              }}
            />
          </div>
          <div className="input-div">
            <span>Nº de Condiciones</span>
            <input
              className="input-field"
              type="number"
              placeholder=""
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              min={1}
              max={filas * columnas}
              ref={condRef}
              style={{ width: "104px" }}
              onChange={(e) => {
                setNumCond(e.target.value);
                setIsSelected(Array(parseFloat(e.target.value)).fill(0));
                setColorGradient(
                  new Gradient()
                    .setColorGradient("#027df7", "#dcecfc")
                    .setMidpoint(parseFloat(e.target.value) + 1)
                    .getColors()
                );
              }}
            />
          </div>

        </div>
      </div>
      <div className="container-div" style={{ minHeight: "100px" }}>
        <div className="container-header">
          <span>Distribución por Placa</span>
        </div>
        <div className="border-div" style={{ width: "170px" }}></div>
        <div style={{ display: "flex" }}>
          <div className="select-cond-row" style={{ flex: 0.95 }}>
            {Array.from({ length: numCond }, (_, i) => (
              <div
                key={`cond-${i}`}
                className="cond-element"
                style={{
                  backgroundColor: isSelected[i]
                    ? "rgb(243, 243, 243)"
                    : "white",
                }}
                onClick={() => {
                  setIsSelected((isSelected) => {
                    let newSelected = Array(parseFloat(numCond) + 1).fill(0);
                    newSelected[i] = 1;
                    return newSelected;
                  });
                }}
              >
                {i + 1}
                <div
                  className="cond-element-color"
                  style={{ backgroundColor: colorGradient[i] }}
                />
              </div>
            ))}
          </div>
          <div style={{ flex: 0.05, marginTop: "6px" }}>
            <button
              className="nueva-button"
              onClick={() => {
                setCondArray(
                  Array(parseFloat(filas)).fill(
                    Array(parseFloat(columnas)).fill(0)
                  )
                );
              }}
            >
              <img src={refresh} alt="" style={{ filter: "invert(50%)" }} />
            </button>
          </div>
        </div>

        <div className="plate-cond-div"></div>
        <div className="plate-container">
          <div className="plate-div">
            <div
              className="plate-header"
              style={{
                left: "11px",
                top: "-1px",
                position: "relative",
                display: "flex",
                justifyContent: "space-around",
                width: "579.6px",
              }}
            >
              {columnas > 1 &&
                Array.from({ length: columnas }, (_, i) => {
                  return (
                    <span key={i + 1} style={{ width: width }}>
                      {i + 1}
                    </span>
                  );
                })}
            </div>
            {Array.from({ length: filas }, (_, i) => (
              <div
                key={`fila-${i}`}
                className="plate-fila"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {filas > 1 && (
                  <div
                    className="plate-row-header"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ userSelect: "none" }}>{ABC[i]}</span>
                  </div>
                )}
                {Array.from({ length: columnas }, (_, j) => {
                  const key = `columna-${j}`;
                  return (
                    <div
                      key={key}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                      }}
                    >
                      <div
                        key={key}
                        className="individual-div"
                        style={{
                          width: width,
                          height: height,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor:
                            parseFloat(condArray[i][j]) > 0
                              ? colorGradient[parseFloat(condArray[i][j]) - 1]
                              : "rgb(223, 223, 223)",
                        }}
                        onMouseEnter={() => {
                          if (isDragging) {
                            changePlate(i, j);
                          }
                        }}
                        onMouseDown={() => {
                          changePlate(i, j);
                        }}
                      >
                        <span
                          style={{
                            fontStyle: "italic",
                            color: "white",
                            userSelect: "none",
                          }}
                        >
                          {condArray[i][j] > 0 ? condArray[i][j] : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {filas > 1 && (
                  <div
                    className="plate-row-header"
                    style={{
                      width: "10.21px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        className="crear-dispositivo"
        onClick={() => {
          postPlate();
        }}
      >
        <img src={add} alt="" style={{ position: "relative", top: "1px" }} />
      </button>
    </div>
  );
};

export default NewPlate;
