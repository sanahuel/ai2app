import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import NuevoEnsayo from "./pages/NuevoEnsayo";
import Login from "./pages/Login";
import Sidebar from "./components/sidebar";
import Panel from "./pages/Panel";
import Control from "./pages/Control";
import Visualizar from "./pages/Visualizar";
import Results from "./pages/Results";
import Nav from "./components/navbar";

import Config from "./pages/Config";
import NewDevice from "./pages/config/NewDevice";
import NewPlanner from "./pages/config/NewPlanner";
import NewPlate from "./pages/config/NewPlate";
import EditDevice from "./pages/config/EditDevice";
import EditPlanner from "./pages/config/EditPlanner";
import EditPlate from "./pages/config/EditPlate";

import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";
import { IpProvider } from "./context/IpContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { withOneTabEnforcer } from "react-one-tab-enforcer";

function App() {
  const router = useLocation();

  const [prev, setPrev] = useState(localStorage.getItem("prev") || null);
  let [semaphore, setSemaphore] = useState(
    localStorage.getItem("semaphoreFlag") || false
  ); // se utiliza el localStorage para no perder información en caso de refrescar o cerrar

  const [lockedIPs, setLockedIPs] = useState([]); // se almacenan las IPs de los semáforos bloqueados para liberarlos después

  const releaseLock = async () => {
    localStorage.setItem("semaphoreFlag", false);

    let token = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

    try {
      const fetchPromises = [];
      for (let i = 0; i < lockedIPs.length; i++) {
        const dispositivo = lockedIPs[i];
        const fetchPromise = fetch(`http://${dispositivo.IP}:8000/new/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access}`,
          },
          body: JSON.stringify({
            release: "release",
          }),
        });
        fetchPromises.push(fetchPromise);
      }

      await Promise.all(fetchPromises);

      setSemaphore(false);
      setLockedIPs([]);
    } catch (error) {
      console.error("Error releasing lock:", error);
    }
  };

  // liberar semáforo si sale de la página
  useEffect(() => {
    const semaphoreFlag = localStorage.getItem("semaphoreFlag");

    if (prev === "/new" && semaphoreFlag === "true") {
      releaseLock();
      localStorage.setItem("semaphoreFlag", false);
    }

    setPrev(router.pathname);

    localStorage.setItem("prev", router.pathname);
  }, [router.pathname]);

  //liberar semáforo si cierra o refresca la página
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      if (semaphore == true) {
        releaseLock();
        localStorage.setItem("semaphoreFlag", false);
      }
    };

    if (semaphore === true) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [lockedIPs]); // es importante que este useEffect se recargue cada vez que se modifica lockedIPs o almacenará un estado antiguo (= no libera todos los semáforos)

  const updateSemaphore = (data) => {
    setSemaphore(data);
    if (data == true) {
      localStorage.setItem("semaphoreFlag", true);
    } else {
      localStorage.setItem("semaphoreFlag", false);
    }
  };

  return (
    <>
      <IpProvider>
        <AuthProvider>
          <Sidebar />
          <Nav />
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoutes />}>
                <Route path="/" element={<Home />} />
                <Route path="/control" element={<Panel />} />
                <Route path="/control/:disp/:id" element={<Control />} />
                <Route
                  path="/new"
                  element={
                    <NuevoEnsayo
                      semaphore={semaphore}
                      updateSemaphore={updateSemaphore}
                      lockedIPs={lockedIPs}
                      updateLockedIPs={setLockedIPs}
                    />
                  }
                />
                <Route path="/visualize" element={<Visualizar />} />
                <Route path="/visualize/:disp/:id" element={<Results />} />

                <Route path="config/" element={<Config />} />
                <Route path="config/device/new" element={<NewDevice />} />
                <Route path="config/device/:id" element={<EditDevice />} />
                <Route path="config/planner/new" element={<NewPlanner />} />
                <Route path="config/planner/:id" element={<EditPlanner />} />
                <Route path="config/plates/new" element={<NewPlate />} />
                <Route path="config/plates/:id" element={<EditPlate />} />
              </Route>
            </Routes>
          </div>
        </AuthProvider>
      </IpProvider>
    </>
  );
}

// Componente para mostrar en otras pestañas
const DifferentWarningComponent = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      height: "100%",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
    }}
  >
    <span style={{ fontWeight: "bold", color: "#444", marginTop: "100px" }}>
      Solo se puede utilizar una pestaña
    </span>
  </div>
);

export default withOneTabEnforcer({
  OnlyOneTabComponent: DifferentWarningComponent,
})(App);
