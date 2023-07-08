import { createContext, useState, useEffect } from "react";

const IpContext = createContext();

export default IpContext;

export const IpProvider = ({ children }) => {
  const [ipData, setIpData] = useState({});

  useEffect(() => {
    console.log(window.location.hostname);
    async function fetchData() {
      fetch(`http://${window.location.hostname}:8000/config/disp`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setIpData(data["dispositivos"]);
        });
    }
    fetchData();
  }, []);

  return <IpContext.Provider value={ipData}>{children}</IpContext.Provider>;
};
