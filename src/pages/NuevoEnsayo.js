import React, { useEffect, useState, useRef } from "react";
import "./NuevoEnsayo.css";
import crear from "../icons/save_as.svg";
import del from "../icons/clear.svg";

const NuevoEnsayo = ({ match, history }) => {
  const nombreRef = useRef(null);
  const inicioRef = useRef(null);
  const finRef = useRef(null);
  const horaRef = useRef(null);

  let ensayos_tabla = [];
  let i = 0;
  let j = 0;

  const [horaInic, setHoraInic] = useState([]);

  const [horaFin, setHoraFin] = useState([]);

  let [ensayos, setEnsayos] = useState([]);

  const [horas, setHoras] = useState([]);

  let [tabla, setTabla] = useState([]);

  useEffect(() => {
    if (inicioRef.current.value && finRef.current.value) {
      getEnsayos();
      sortTabla();
    }
  }, [horaInic, horaFin]);

  useEffect(() => {
    ensayos.map((arr) => {
      arr.horas.split(" ").forEach((h) => {
        ensayos_tabla.push({ hora: h, nombre: arr.nombre });
      });
    });
  }, [ensayos]);

  const swap = (start, end, l, arr) =>
    [].concat(
      arr.slice(0, start),
      arr.slice(end, end + 1),
      arr.slice(start + 1, end),
      arr.slice(start, start + 1),
      arr.slice(end + 1, l)
    );

  let getEnsayos = async () => {
    let response = await fetch("/ensayos");
    let data = await response.json();
    setEnsayos(data);
  };

  let sortTabla = () => {
    if (!(ensayos_tabla.lenght === 0)) {
      for (i = 0; i < ensayos_tabla.length; i++) {
        for (j = 0; j < ensayos_tabla.length - 1; j++) {
          let h1 = ensayos_tabla[j].hora.split(":");
          let h2 = ensayos_tabla[j + 1].hora.split(":");
          if (
            Number(h1[0]) > Number(h2[0]) ||
            (Number(h1[0]) == Number(h2[0]) && Number(h1[1]) > Number(h2[1]))
          ) {
            ensayos_tabla = swap(j, j + 1, ensayos_tabla.lenght, ensayos_tabla);
            console.log(ensayos_tabla);
          }
        }
      }
    }
  };

  let createEnsayo = async () => {
    fetch(`/send/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombreRef.current.value,
        inicio: inicioRef.current.value,
        fin: finRef.current.value,
        horas: horas.join(" "),
      }),
    });
    history.push("/");
  };

  let addHora = () => {
    let ok = true;
    for (i = 0; i < ensayos.length; i++) {
      if (ensayos[i].horas.includes(horaRef.current.value)) {
        ok = false;
      }
    }

    if (horas.includes(horaRef.current.value)) {
      ok = false;
    }

    if (ok === true) {
      console.log(ensayos_tabla);
      setHoras([...horas, horaRef.current.value]);
      ensayos_tabla.push({
        hora: horaRef.current.value,
        nombre: "Nuevo Ensayo",
      });
      sortTabla();
    }
  };

  let deleteHora = (index) => {
    const h = [...horas];
    h.splice(index, 1);
    setHoras(h);
  };

  return (
    <div className="nuevo-ensayo">
      <div className="container-div">
        <div className="input-div">
          <span>Nombre del ensayo </span>
          <input className="input-field" ref={nombreRef} placeholder="" />
        </div>
        <div className="input-div">
          <span>Fecha de Inicio </span>
          <input
            className="input-field"
            ref={inicioRef}
            placeholder="Fecha de Inicio"
            type={"date"}
            onChange={(e) => setHoraInic(e.target.value)}
          />
        </div>

        <div className="input-div">
          <span>Fecha de Finalización </span>
          <input
            className="input-field"
            ref={finRef}
            placeholder="Fecha de Finalización"
            type={"date"}
            onChange={(e) => setHoraFin(e.target.value)}
          />
        </div>
      </div>
      <div className="container-div">
        <div className="tabla-horario">
          <div className="header-tabla">
            <span className="texto-horario">Horas Programadas</span>
            <div className="nueva-hora">
              <input type="time" ref={horaRef} className="input-time" />
              <button className="nueva-button" onClick={addHora}>
                +
              </button>
            </div>
          </div>
          <div className="horario">
            {ensayos.map((e, index) => (
              <div key={index} className="fila-tabla">
                <div className="hora-tabla">{e.horas}</div>
                <div className="eliminar-fila">
                  <span className="nombre-tabla">{e.nombre}</span>
                </div>
              </div>
            ))}
            {horas.map((hora, index) => (
              <div key={index} className="fila-tabla">
                <div className="hora-tabla">{hora}</div>
                <div className="eliminar-fila">
                  <span className="nombre-tabla">Nuevo Ensayo</span>
                  <button
                    className="button-eliminar-fila"
                    onClick={() => deleteHora(index)}
                  >
                    <img src={del} alt="" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button className="crear-button" onClick={createEnsayo}>
        <img src={crear} alt="" />
      </button>
    </div>
  );
};

export default NuevoEnsayo;
