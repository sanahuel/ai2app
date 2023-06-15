import { React, useState, useEffect, useRef } from "react";
import add from "../../icons/add.svg";
import del from "../../icons/clear.svg";
import { BlockPicker } from "react-color";

const NewPlanner = () => {
  let [selectedColor, setSelectedColor] = useState("#69b1fa");
  let [colorPicker, setColorPicker] = useState("none");
  const [condiciones, setCondiciones] = useState([]);

  let colorRef = useRef();

  let num_cond = 1;

  useEffect(() => {
    let handler = (e) => {
      if (!colorRef.current.contains(e.target)) {
        setColorPicker("none");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  let createCondicion = () => {
    setCondiciones([...condiciones, num_cond++]);
  };
  let deleteCondicion = (index) => {
    let condCopy = [...condiciones];
    condCopy.splice(index, 1);
    setCondiciones(condCopy);
  };

  return (
    <div className="nuevo-ensayo">
      <div className="container-div">
        <div className="container-header">
          <span>Configuración del Planificador</span>
        </div>
        <div className="border-div" style={{ width: "250px" }}></div>
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
            />
          </div>
          <div className="input-div">
            <span>Aplicación</span>
            <select
              name="select"
              className="input-field"
              defaultValue="DEFAULT"
            >
              <option value="DEFAULT" disabled>
                {" "}
              </option>
              <option value="lifespan">Lifespan</option>
              <option value="healthspan">Healthspan</option>
            </select>
          </div>
          <div className="input-div">
            <span>Color</span>
            <span
              className="color-span"
              style={{
                backgroundColor: selectedColor,
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                marginLeft: "2px",
              }}
              onClick={() => setColorPicker("inline")}
            />
          </div>
          <div
            style={{
              display: colorPicker,
              position: "absolute",
              zIndex: 9999,
              left: "143px",
            }}
            ref={colorRef}
          >
            <BlockPicker
              color={selectedColor}
              onChange={(color, e) => setSelectedColor(color.hex)}
              triangle="hide"
            />
          </div>
        </div>
      </div>

      <div className="container-div">
        <div className="container-header">
          <span>Condiciones del Ensayo</span>
        </div>
        <div className="border-div"></div>
        <div className="container-content">
          {condiciones.map((condicion, index) => (
            <div key={condicion}>
              <div className="condicion-div">
                <div className="input-div">
                  <span>Nombre de la condición</span>
                  <input
                    className="input-field"
                    placeholder=""
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <button
                    className="button-eliminar-fila"
                    onClick={() => deleteCondicion(index)}
                  >
                    <img src={del} alt="" />
                  </button>
                </div>
                <div
                  className="input-div"
                  style={{ marginLeft: "40px", paddingTop: "1px" }}
                >
                  <span>Nº de placas</span>
                  <input
                    className="input-field"
                    type="number"
                    min="1"
                    placeholder=""
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    style={{ width: "104px" }}
                  />
                </div>
              </div>
            </div>
          ))}
          <button className="nueva-button" onClick={createCondicion}>
            <span style={{ color: "#666" }}>+</span>
          </button>
        </div>
      </div>

      <div className="container-div">
        <div className="container-header">
          <span>Captura de Imagen</span>
        </div>
        <div className="border-div"></div>
        <div className="container-content">
          <div className="input-div">
            <span>Holgura</span>
            <span
              style={{
                width: "13px",
                position: "relative",
                left: "-13px",
                color: "#555",
              }}
            >
              -
            </span>
            <input
              className="input-field"
              type="number"
              min="0"
              max="59"
              defaultValue="0"
              style={{ position: "relative", left: "-13px", width: "42px" }}
            />
            <span
              id="min-span"
              style={{
                position: "relative",
                left: "-5px",
                width: "2px",
              }}
            >
              min.
            </span>
            <span
              style={{
                width: "63px",
                paddingLeft: "34px",
                color: "#555",
              }}
            >
              +
            </span>
            <input
              className="input-field"
              type="number"
              min="0"
              max="59"
              defaultValue="0"
              style={{ position: "relative", left: "-13px", width: "42px" }}
            />
            <span id="min-span" style={{ position: "relative", left: "-5px" }}>
              min.
            </span>
          </div>

          <div className="input-div">
            <span>Nº de Capturas</span>
            <input
              className="input-field"
              placeholder=""
              type="number"
              min="1"
              style={{ width: "138.4px" }}
            />
          </div>
          <div className="input-div">
            <span>Frecuencia entre Capturas</span>
            <input
              className="input-field"
              type="number"
              min="0"
              defaultValue="1"
              style={{ width: "42px" }}
            />
            <span id="h-span">h.</span>
            <input
              className="input-field"
              type="number"
              min="0"
              max="59"
              defaultValue="0"
              style={{ left: "289px", width: "42px" }}
            />
            <span id="min-span">min.</span>
          </div>
        </div>
      </div>

      <div className="container-div">
        <div className="container-header">
          <span>Parámetros de Captura</span>
        </div>
        <div className="border-div"></div>
        <div className="container-content">
          <div className="input-div">
            <span>Tipo de Imagen </span>
            <select name="select" className="input-field">
              <option value="rgb">RGB</option>
              <option value="bw">BW</option>
            </select>
          </div>
          <div className="input-div">
            <span>Resolución</span>
            <input
              className="input-field"
              type="number"
              min="0"
              defaultValue="1942"
              style={{ width: "52px" }}
            />
            <span id="pix-span">x</span>
            <input
              className="input-field"
              type="number"
              min="0"
              defaultValue="1942"
              style={{ left: "29px", width: "52px" }}
            />
          </div>
          <div className="input-div">
            <span>Frecuencia de Captura</span>
            <input
              className="input-field"
              placeholder=""
              type="number"
              min="1"
              style={{ width: "138.4px" }}
            />
            <span
              style={{
                fontSize: "small",
                color: "#555",
                marginLeft: "5px",
              }}
            >
              fps
            </span>
          </div>
          <div className="input-div">
            <span>Nº de Imagenes</span>
            <input
              className="input-field"
              placeholder=""
              type="number"
              min="1"
              style={{ width: "138.4px" }}
            />
          </div>
        </div>
      </div>
      <button className="crear-dispositivo">
        <img src={add} alt="" style={{ position: "relative", top: "1px" }} />
      </button>
    </div>
  );
};

export default NewPlanner;
