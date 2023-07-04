import { React, useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Gradient from "javascript-color-gradient";
import add from "../../icons/add.svg";
import "./NewPlate.css";
import refresh from "../../icons/refresh.svg";

const EditPlate = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [numCond, setNumCond] = useState(0);
  const [filas, setFilas] = useState(0);
  const [columnas, setColumnas] = useState(0);
  const [condArray, setCondArray] = useState([]);
  const [width, setWidth] = useState("50px");
  const [height, setHeight] = useState("50px");
  const [isDragging, setIsDragging] = useState(false);
  const [isSelected, setIsSelected] = useState([]);
  const [colorGradient, setColorGradient] = useState([]);
  const [idPlate, setIdPlate] = useState(0);

  const condRef = useRef();

  const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    function parseMatrix(data) {
      const parsedMatrix = [];

      // Find the maximum option value
      const maxOption = Math.max(...Object.keys(data.condiciones).map(Number));

      // Initialize the matrix with zeros
      for (let i = 0; i <= data.columnas; i++) {
        parsedMatrix.push(Array(data.filas).fill(0));
      }

      // Fill the matrix with the positions from the .atrix
      Object.entries(data.condiciones).forEach(([option, positions]) => {
        const optionValue = parseInt(option, 10);
        positions.forEach((position) => {
          const [i, j] = position.split(",").map(Number);
          parsedMatrix[i][j] = optionValue;
        });
      });

      setCondArray(parsedMatrix);
    }
    async function fetchData() {
      fetch(`http://127.0.0.1:8000/config/placas/` + id, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.numCondiciones);
          console.log(data.filas);
          console.log(data.columnas);
          setIdPlate(data.id);
          setNombre(data.nombre);
          setNumCond(data.numCondiciones);
          setFilas(data.filas);
          setColumnas(data.columnas);
          parseMatrix(data);
          setColorGradient(
            new Gradient()
              .setColorGradient("#027df7", "#dcecfc")
              .setMidpoint(parseInt(data.numCondiciones) + 1)
              .getColors()
          );
        });
    }
    fetchData();
  }, []);

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

  const putPlate = () => {
    if (nombre === "") {
      alert("La  configuración debe tener nombre");
      return;
    }

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

    async function fetchData() {
      fetch(`http://127.0.0.1:8000/config/placas/` + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          numCondiciones: String(Object.keys(result).length),
          filas: filas,
          columnas: columnas,
          condiciones: result,
          id: idPlate,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            navigate("/config");
          }
        });
    }
    fetchData();
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
              value={nombre}
              ref={condRef}
              onChange={(e) => setNombre(e.target.value)}
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
              style={{ width: "104px" }}
              value={numCond}
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
              value={filas}
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
              value={columnas}
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
        </div>
      </div>
      <div className="container-div" style={{ minHeight: "100px" }}>
        <div className="container-header">
          <span>Distribución por Placa</span>
        </div>
        <div className="border-div" style={{ width: "170px" }}></div>
        <div style={{ display: "flex" }}>
          <div className="select-cond-row" style={{ flex: 0.95 }}>
            {Array.from({ length: parseInt(numCond) }, (_, i) => (
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
                    <span
                      key={i + 1}
                      style={{ width: width, userSelect: "none" }}
                    >
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
                {/* AQUI --- */}
                {Array.from({ length: parseInt(columnas) }, (_, j) => {
                  const key = `columna-${j}`;
                  console.log(typeof condArray[i][j]);
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
                            condArray[i][j] > 0
                              ? colorGradient[condArray[i][j] - 1]
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
          putPlate();
        }}
      >
        <img src={add} alt="" style={{ position: "relative", top: "1px" }} />
      </button>
    </div>
  );
};

export default EditPlate;
