import { React, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import add from "../../icons/add.svg";
import del from "../../icons/clear.svg";
import { BlockPicker } from "react-color";

const NewPlanner = () => {
  let [selectedColor, setSelectedColor] = useState("#69b1fa");
  let [colorPicker, setColorPicker] = useState("none");
  const [condiciones, setCondiciones] = useState([]);
  const [configCondiciones, setConfigCondiciones] = useState([]);
  const [configCondicion, setConfigCondicion] = useState([]);

  const nombre = useRef();
  const aplicacion = useRef();
  const holguraPositiva = useRef();
  const holguraNegativa = useRef();
  const capturasTotales = useRef();
  const hFreq = useRef();
  const minFreq = useRef();
  const tipoImg = useRef();
  const resWidth = useRef();
  const resHeight = useRef();
  const freqCaptura = useRef();
  const imgsPorCaptura = useRef();
  const placasPorCond = useRef();
  let colorRef = useRef();

  let navigate = useNavigate();

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

  useEffect(() => {
    async function fetchCondiciones() {
      fetch(`http://${window.location.hostname}:8000/config/placas`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setConfigCondiciones(data["placas"]);
        });
    }
    fetchCondiciones();
  }, []);

  const postPlan = () => {
    if (nombre.current.value === "") {
      alert("La configuración debe tener un nombre");
      return;
    }
    async function fetchPost() {
      fetch(`http://${window.location.hostname}:8000/config/planif`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre.current.value,
          aplicacion: aplicacion.current.value,
          color: selectedColor,
          condiciones: condiciones,
          holguraPositiva: holguraPositiva.current.value,
          holguraNegativa: holguraNegativa.current.value,
          capturasTotales: capturasTotales.current.value,
          hFreq: hFreq.current.value,
          minFreq: minFreq.current.value,
          tipoImg: tipoImg.current.value,
          resWidth: resWidth.current.value,
          resHeight: resHeight.current.value,
          freqCaptura: freqCaptura.current.value,
          imgsPorCaptura: imgsPorCaptura.current.value,
          placasPorCond: placasPorCond.current.value,
          configCondicion: configCondicion,
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
    fetchPost();
  };

  let changeConfigCondicion = (config) => {
    setConfigCondicion(JSON.parse(config));
    const numCond = JSON.parse(config).numCondiciones;
    const newCondiciones = [];
    for (let i = 0; i < numCond; i++) {
      newCondiciones.push({
        name: "",
      });
    }
    setCondiciones(newCondiciones);
  };

  let createCondicion = () => {
    const addedCond = [];
    console.log(configCondicion);
    for (let i = 0; i < configCondicion.numCondiciones; i++) {
      addedCond.push({
        name: "",
      });
    }
    setCondiciones([...condiciones, ...addedCond]);
  };

  let changeNombreCondicion = (e, index) => {
    const copy = [...condiciones];
    copy[index].name = e;
    setCondiciones(copy);
  };

  let deleteCondicion = (index) => {
    const copy = [...condiciones];
    copy.splice(index, configCondicion.numCondiciones);
    setCondiciones(copy);
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
              ref={nombre}
            />
          </div>
          <div className="input-div">
            <span>Aplicación</span>
            <select
              name="select"
              className="input-field"
              defaultValue="DEFAULT"
              ref={aplicacion}
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
              colors={[
                "#0646b4",
                "#0077b6",
                "#00b4d8",
                "#6dc4e3",
                "#90e0ef",
                "#249D57",
                "#38C172",
                "#3ad47a",
                "#74D99F",
                "#B9F6CA",
              ]}
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
          <div className="input-div">
            <span>Configuración</span>
            <select
              name="select"
              className="input-field"
              defaultValue="DEFAULT"
              style={{ width: "145px" }}
              onChange={(e) => changeConfigCondicion(e.target.value)}
            >
              <option value="DEFAULT" disabled>
                {" "}
              </option>
              {configCondiciones.map((config) => (
                <option value={JSON.stringify(config)}>{config.nombre}</option>
              ))}
            </select>
          </div>
          <div
            className="input-div"
            style={{ marginLeft: "40px", paddingTop: "1px" }}
          >
            <span>Placas por condición</span>
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
              ref={placasPorCond}
            ></input>
          </div>
          {condiciones.map((condicion, index) => (
            <div key={condicion}>
              <div className="condicion-div">
                <div
                  className="input-div"
                  style={{ marginLeft: "40px", paddingTop: "1px" }}
                >
                  <span
                    style={{
                      color: condicion.name === "" ? "gray" : "black",
                    }}
                  >
                    Nombre condición {index + 1}
                  </span>
                  <input
                    className="input-field"
                    placeholder=""
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    style={{ width: "104px" }}
                    onChange={(e) =>
                      changeNombreCondicion(e.target.value, index)
                    }
                  />
                  {index % configCondicion.numCondiciones === 0 &&
                    index !== 0 && (
                      <button
                        className="button-eliminar-fila"
                        onClick={() => deleteCondicion(index)}
                      >
                        <img src={del} alt="" />
                      </button>
                    )}
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
              ref={holguraNegativa}
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
              ref={holguraPositiva}
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
              ref={capturasTotales}
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
              ref={hFreq}
            />
            <span id="h-span">h.</span>
            <input
              className="input-field"
              type="number"
              min="0"
              max="59"
              defaultValue="0"
              style={{ left: "289px", width: "42px" }}
              ref={minFreq}
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
            <select name="select" className="input-field" ref={tipoImg}>
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
              ref={resWidth}
            />
            <span id="pix-span">x</span>
            <input
              className="input-field"
              type="number"
              min="0"
              defaultValue="1942"
              style={{ left: "29px", width: "52px" }}
              ref={resHeight}
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
              ref={freqCaptura}
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
              ref={imgsPorCaptura}
            />
          </div>
        </div>
      </div>
      <button className="crear-dispositivo" onClick={() => postPlan()}>
        <img src={add} alt="" style={{ position: "relative", top: "1px" }} />
      </button>
    </div>
  );
};

export default NewPlanner;
