import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Para comprobar las IPs cada vez que se cambia de página

const IpContext = createContext();

export default IpContext;

export const IpProvider = ({ children }) => {
  const [ipData, setIpData] = useState({});
  const [unreachableIPs, setUnreachableIPs] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const reloadLocations = ["/", "/new", "/control", "/visualize", "/config"]; //solo recargar en estas paginas
    if (reloadLocations.includes(location.pathname)) {
      function checkIPs(dispositivos) {
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
          const url = `http://${dispositivo.IP}:8000/check`;
          const promise = fetchWithTimeout(url, 700) // 700 ms de timeout, OJO si la red es mala...
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
            /////////// if reachableIPs.length === 0 change localInfo
            const newData = dispositivos.filter((dispositivo) => {
              return !reachableIPs.some(
                (reachableIP) => reachableIP.nDis === dispositivo.nDis
              );
            });
            setUnreachableIPs(newData);
            setIpData(reachableIPs);
            console.log("IPS DISPONIBLES :", reachableIPs);
          })
          .catch((error) => {
            // console.error('Error checking IPs:', error);
          });
      }

      async function fetchData() {
        fetch(`http://${window.location.hostname}:8000/config/disp`, {
          method: "GET",
        })
          .then((response) => response.json())
          .then((data) => {
            // setIpData(data["dispositivos"]);
            checkIPs(data["dispositivos"]);
          });
      }

      fetchData();
    }
  }, [location]); // si no se usara location solo se comprueban IPs al abrir por primera vez o al refrescar navegador

  useEffect(() => {
    // Igual pero para las IP Secundarias
    function checkIPs(dispositivos) {
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
        const promise = fetchWithTimeout(url, 700) // 700 ms de timeout, OJO si la red es mala...
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
          // Se cambian las IPs para utilizar la IP2 en el resto de la app
          const permutedIPs = reachableIPs.map((entry) => {
            const temp = entry.IP;
            entry.IP = entry.IP2;
            entry.IP2 = temp;
            return entry;
          });
          setIpData([...ipData, ...reachableIPs]);
        })
        .catch((error) => {
          // console.error('Error checking IPs:', error);
        });
    }

    async function fetchData() {
      fetch(`http://${window.location.hostname}:8000/config/disp`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          // setIpData(data["dispositivos"]);
          checkIPs(data["dispositivos"]);
        });
    }

    fetchData();
  }, [unreachableIPs]);
  return <IpContext.Provider value={ipData}>{children}</IpContext.Provider>;
};
