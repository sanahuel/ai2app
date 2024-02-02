import { React, useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import add from "../../icons/add.svg";
import del from "../../icons/clear.svg";
import { BlockPicker } from "react-color";

const EditPlanner = () => {
  const { id } = useParams();

  let [selectedColor, setSelectedColor] = useState("white");
  let [colorPicker, setColorPicker] = useState("none");
  const [condiciones, setCondiciones] = useState([]);

  const [nombre, setNombre] = useState();
  const [aplicacion, setAplicacion] = useState();
  const [holguraPositiva, setHolguraPositiva] = useState();
  const [holguraNegativa, setHolguraNegativa] = useState();
  const [capturasTotales, setCapturasTotales] = useState();
  const [hFreq, setHFreq] = useState();
  const [minFreq, setMinFreq] = useState();
  const [tipoImg, setTipoImg] = useState();
  const [resWidth, setResWidth] = useState();
  const [resHeight, setResHeight] = useState();
  const [freqCaptura, setFreqCaptura] = useState();
  const [imgsPorCaptura, setImgsPorCaptura] = useState();
  const [configCondiciones, setConfigCondiciones] = useState([]);
  const [configCondicion, setConfigCondicion] = useState("DEFAULT");
  const [placasPorCond, setPlacasPorCond] = useState();
  const [gusanosPorCond, setGusanosPorCond] = useState();
  const [temperaturaMin, setTemperaturaMin] = useState();
  const [temperaturaMax, setTemperaturaMax] = useState();
  const [humedadMin, setHumedadMin] = useState();
  const [humedadMax, setHumedadMax] = useState();

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
    async function fetchData(configs) {
      try {
        const response = await fetch(
          `http://${window.location.hostname}:8000/config/planif/` + id,
          {
            method: "GET",
          }
        );
        const data = await response.json();

        const configCondicionesId = data.configCondicion.id;
        console.log("configCondiciones", configCondiciones);
        const selectedCondicion = configs.find((configCond) => {
          return configCond.id == configCondicionesId;
        });
        setNombre(data.nombre);
        setAplicacion(data.aplicacion);
        setHolguraPositiva(data.holguraPositiva);
        setHolguraNegativa(data.holguraNegativa);
        setCapturasTotales(data.capturasTotales);
        setHFreq(data.hFreq);
        setMinFreq(data.minFreq);
        setTipoImg(data.tipoImg);
        setResWidth(data.resWidth);
        setResHeight(data.resHeight);
        setFreqCaptura(data.freqCaptura);
        setImgsPorCaptura(data.imgsPorCaptura);
        setSelectedColor(data.color);
        setCondiciones(data.condiciones);
        setPlacasPorCond(data.placasPorCond);
        // setConfigCondicion(data.configCondicion);
        setConfigCondicion(selectedCondicion);
        setGusanosPorCond(data.gusanosPorCond);
        setTemperaturaMin(data.temperaturaMin);
        setTemperaturaMax(data.temperaturaMax);
        setHumedadMin(data.humedadMin);
        setHumedadMax(data.humedadMax);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    async function fetchCondicionesAndData() {
      try {
        const response = await fetch(
          `http://${window.location.hostname}:8000/config/placas`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setConfigCondiciones(data["placas"]);

        fetchData(data["placas"]);
      } catch (error) {
        console.error("Error fetching condiciones:", error);
      }
    }

    fetchCondicionesAndData();
  }, []);

  const postPlanif = () => {
    if (nombre === "") {
      alert("La configuración debe tener un nombre");
      return;
    }
    async function fetchPost() {
      fetch(`http://${window.location.hostname}:8000/config/planif/` + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          aplicacion: aplicacion,
          holguraPositiva: holguraPositiva,
          holguraNegativa: holguraNegativa,
          capturasTotales: capturasTotales,
          hFreq: hFreq,
          minFreq: minFreq,
          tipoImg: tipoImg,
          resWidth: resWidth,
          resHeight: resHeight,
          freqCaptura: freqCaptura,
          imgsPorCaptura: imgsPorCaptura,
          color: selectedColor,
          condiciones: condiciones,
          id: id,
          placasPorCond: placasPorCond,
          configCondicion: configCondicion,
          gusanosPorCond: gusanosPorCond,
          temperaturaMin: temperaturaMin,
          temperaturaMax: temperaturaMax,
          humedadMin: humedadMin,
          humedadMax: humedadMax,
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
    console.log(`http://${window.location.hostname}:8000/config/planif/` + id);
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
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="input-div">
            <span>Aplicación</span>
            <select
              name="select"
              className="input-field"
              defaultValue="DEFAULT"
              value={aplicacion}
              onChange={(e) => setAplicacion(e.target.value)}
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
              style={{ width: "145px" }}
              value={JSON.stringify(configCondicion)}
              onChange={(e) => {
                changeConfigCondicion(e.target.value);
              }}
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
              value={placasPorCond}
              onChange={(e) => setPlacasPorCond(e.target.value)}
            ></input>
          </div>
          <div
            className="input-div"
            style={{ marginLeft: "40px", paddingTop: "1px" }}
          >
            <span>Gusanos por condición</span>
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
              value={gusanosPorCond}
              onChange={(e) => setGusanosPorCond(e.target.value)}
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
                    value={condicion.name}
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
              value={holguraNegativa}
              onChange={(e) => setHolguraNegativa(e.target.value)}
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
              value={holguraPositiva}
              onChange={(e) => setHolguraPositiva(e.target.value)}
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
              value={capturasTotales}
              onChange={(e) => setCapturasTotales(e.target.value)}
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
              value={hFreq}
              onChange={(e) => setHFreq(e.target.value)}
            />
            <span id="h-span">h.</span>
            <input
              className="input-field"
              type="number"
              min="0"
              max="59"
              defaultValue="0"
              style={{ left: "289px", width: "42px" }}
              value={minFreq}
              onChange={(e) => setMinFreq(e.target.value)}
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
            <select
              name="select"
              className="input-field"
              value={tipoImg}
              onChange={(e) => setTipoImg(e.target.value)}
            >
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
              style={{ width: "62px" }}
              value={resWidth}
              onChange={(e) => setResWidth(e.target.value)}
            />
            <span id="pix-span">x</span>
            <input
              className="input-field"
              type="number"
              min="0"
              defaultValue="1942"
              style={{ left: "29px", width: "62px" }}
              value={resHeight}
              onChange={(e) => setResHeight(e.target.value)}
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
              value={freqCaptura}
              onChange={(e) => setFreqCaptura(e.target.value)}
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
              value={imgsPorCaptura}
              onChange={(e) => setImgsPorCaptura(e.target.value)}
            />
          </div>
          <div className="input-div">
            <span>Rango de Temperatura</span>
            <input
              className="input-field"
              type="number"
              step="0.01"
              min="0"
              value={temperaturaMin}
              style={{ position: "relative", width: "60px" }}
              onChange={(e) => setTemperaturaMin(e.target.value)}
            />
            <span
              id="min-span"
              style={{
                position: "relative",
                left: "10px",
                width: "2px",
              }}
            >
              min
            </span>
            <span
              style={{
                width: "63px",
                paddingLeft: "34px",
                color: "#555",
              }}
            ></span>
            <input
              className="input-field"
              type="number"
              step="0.01"
              min="0"
              value={temperaturaMax}
              style={{ position: "relative", left: "-13px", width: "60px" }}
              onChange={(e) => setTemperaturaMax(e.target.value)}
            />
            <span id="min-span" style={{ position: "relative", left: "-5px" }}>
              max
            </span>
          </div>
          <div className="input-div">
            <span>Rango de Humedad</span>
            <input
              className="input-field"
              type="number"
              step="0.01"
              min="0"
              value={humedadMin}
              style={{ position: "relative", width: "60px" }}
              onChange={(e) => setHumedadMin(e.target.value)}
            />
            <span
              id="min-span"
              style={{
                position: "relative",
                left: "10px",
                width: "2px",
              }}
            >
              min
            </span>
            <span
              style={{
                width: "63px",
                paddingLeft: "34px",
                color: "#555",
              }}
            ></span>
            <input
              className="input-field"
              type="number"
              min="0"
              step="0.01"
              value={humedadMax}
              style={{ position: "relative", left: "-13px", width: "60px" }}
              onChange={(e) => setHumedadMax(e.target.value)}
            />
            <span id="min-span" style={{ position: "relative", left: "-5px" }}>
              max
            </span>
          </div>
        </div>
      </div>
      <button className="crear-dispositivo" onClick={() => postPlanif()}>
        <img src={add} alt="" style={{ position: "relative", top: "1px" }} />
      </button>
    </div>
  );
};

export default EditPlanner;
