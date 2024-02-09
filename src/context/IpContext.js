import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Para comprobar las IPs cada vez que se cambia de página

const IpContext = createContext();

export default IpContext;

export const IpProvider = ({ children }) => {
  // Context que gestiona las IPs de dispositivos
  // Se utiliza el localStorage para hacer fetch primero a IPs principales o secundarias, para tener una respuesta más rápida que mostrar
  // Por defecto se hace feth a las principales, pero si no se obtiene respuesta de ninguna (estando por wifi y que las principales sean de ethernet p.ej.), se pasará a usar las Secundarias por defecto

  const [ipData, setIpData] = useState([]);
  const location = useLocation();
  const TIMEOUT = 700; // 700 ms de timeout, OJO si la red es mala...

  const fetchPrincipales = (dispositivos) => {
    return new Promise((resolve, reject) => {
      // Se utilizan promesas para asegurar que fetchSecundarias espera a que se ejecute todo el código
      // Fetch on timeout
      function fetchWithTimeout(url, timeout) {
        return new Promise((resolve, reject) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error("Timeout"));
          }, timeout);

          fetch(url, { signal: controller.signal })
            .then((response) => {
              clearTimeout(timeoutId);
              resolve(response);
            })
            .catch((error) => {
              clearTimeout(timeoutId);
              reject(error);
            });
        });
      }

      // Array para promises
      const fetchPromises = [];
      let newData = [];

      dispositivos.forEach((dispositivo) => {
        const startTime = Date.now();
        const url = `http://${dispositivo.IP}:8000/check`;
        const promise = fetchWithTimeout(url, TIMEOUT)
          .then((response) => {
            const elapsedTime = Date.now() - startTime;
            console.log(`Time for IP ${dispositivo.IP}: ${elapsedTime}ms`);
            if (response.ok) {
              return dispositivo;
            } else {
              throw new Error(
                `Endpoint not reachable for IP: ${dispositivo.IP}`
              );
            }
          })
          .catch((error) => {
            return null;
          });

        fetchPromises.push(promise);
      });

      Promise.all(fetchPromises)
        .then((results) => {
          // Filtrar null
          const reachableIPs = results.filter((ip) => ip !== null);
          // Si no se obtiene respuesta de ninguna principal dar prioridad a las IPs secundarias
          if (reachableIPs.length === 0) {
            localStorage.setItem("localInfo", "Secundarias");
          } else {
            // si se obtiene respuesta de al menos una principal se da prioridad a estas
            localStorage.setItem("localInfo", "Principales");
          }

          newData = dispositivos.filter((dispositivo) => {
            return !reachableIPs.some(
              (reachableIP) => reachableIP.nDis === dispositivo.nDis
            );
          });

          setIpData((prevIpData) => [...prevIpData, ...reachableIPs]);
          resolve(newData);
        })
        .catch((error) => {
          // console.error('Error checking IPs:', error);
        });
    });
  };

  const fetchSecundarias = (dispositivos) => {
    return new Promise((resolve, reject) => {
      // Fetch on timeout
      function fetchWithTimeout(url, timeout) {
        return new Promise((resolve, reject) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
            reject(new Error("Timeout"));
          }, timeout);

          fetch(url, { signal: controller.signal })
            .then((response) => {
              clearTimeout(timeoutId);
              resolve(response);
            })
            .catch((error) => {
              clearTimeout(timeoutId);
              reject(error);
            });
        });
      }

      // Array para promises
      const fetchPromises = [];

      dispositivos.forEach((dispositivo) => {
        const startTime = Date.now();
        const url = `http://${dispositivo.IP2}:8000/check`;
        const promise = fetchWithTimeout(url, TIMEOUT) // 700 ms de timeout, OJO si la red es mala...
          .then((response) => {
            const elapsedTime = Date.now() - startTime;
            console.log(`Time for IP ${dispositivo.IP2}: ${elapsedTime}ms`);
            if (response.ok) {
              return dispositivo;
            } else {
              throw new Error(
                `Endpoint not reachable for IP: ${dispositivo.IP2}`
              );
            }
          })
          .catch((error) => {
            return null;
          });

        fetchPromises.push(promise);
      });

      Promise.all(fetchPromises)
        .then((results) => {
          // Filtrar null
          const reachableIPs = results.filter((ip) => ip !== null);
          // Si no se obtiene respuesta de ninguna secundaria se da prioridad a las principales
          if (reachableIPs.length === 0) {
            localStorage.setItem("localInfo", "Principales");
          }

          const newData = dispositivos.filter((dispositivo) => {
            return !reachableIPs.some(
              (reachableIP) => reachableIP.nDis === dispositivo.nDis
            );
          });

          // Se cambian las IPs para utilizar la IP2 en el resto de la app
          reachableIPs.map((entry) => {
            const temp = entry.IP;
            entry.IP = entry.IP2;
            entry.IP2 = temp;
            return entry;
          });
          setIpData((prevIpData) => [...prevIpData, ...reachableIPs]);
          resolve(newData);
        })
        .catch((error) => {
          // console.error('Error checking IPs:', error);
        });
    });
  };

  useEffect(() => {
    const reloadLocations = ["/", "/control", "/visualize", "/config"]; //solo recargar en estas paginas
    if (reloadLocations.includes(location.pathname)) {
      setIpData([]);
      fetch(`http://${window.location.hostname}:8000/config/disp`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          let dispositivos = data["dispositivos"]; // Declare and initialize dispositivos directly here

          const localInfo = localStorage.getItem("localInfo") || "Principales"; //se almacena a qué IPs hacer fetch primero para tener una respuesta más rápida
          console.log("LOCAL INFO: ", localInfo);

          if (localInfo === "Principales") {
            fetchPrincipales(dispositivos).then((unreachableDispositivos) => {
              fetchSecundarias(unreachableDispositivos);
            });
          } else if (localInfo === "Secundarias") {
            fetchSecundarias(dispositivos).then((unreachableDispositivos) => {
              fetchPrincipales(unreachableDispositivos);
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [location]); // sin location como dependencia solo se ejecutaría IpContext.js una vez al entrar a la página por primera vez, a partir de ahí ipData sería invariante

  return <IpContext.Provider value={ipData}>{children}</IpContext.Provider>;
};
