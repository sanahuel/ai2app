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
import { useEffect, useState, useContext } from "react";

import { withOneTabEnforcer } from "react-one-tab-enforcer"

function App() {
  const router = useLocation();
  const [prev, setPrev] = useState(localStorage.getItem('prev') || null);
  let [semaphore, setSemaphore] = useState(localStorage.getItem('semaphoreFlag') || false);

  const releaseLock = () => {
    let token = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

    if (semaphore === true) {
      fetch(`http://${window.location.hostname}:8000/new/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.access}`,
        },
        body: JSON.stringify({
          release: "release",
        }),
      });

      setSemaphore(false);
      localStorage.setItem('semaphoreFlag', false)
    }
    setSemaphore(false);
    localStorage.setItem('semaphoreFlag', false);
  };

  // liberar semáforo si sale de la página
  useEffect(() => {
    const semaphoreFlag = localStorage.getItem('semaphoreFlag')
    

    if (prev === "/nuevo" && semaphoreFlag === 'true') {
      releaseLock();
      localStorage.setItem('semaphoreFlag', false)
    }

    setPrev(router.pathname);

    // Store the updated `prev` value in localStorage
    localStorage.setItem('prev', router.pathname);
  }, [router.pathname]);



  //liberar semáforo si cierra o refresca la página
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      if (semaphore == true) {
        releaseLock();
        localStorage.setItem('semaphoreFlag', false)

      }
    };

    if (semaphore === true) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [semaphore]);

  const updateSemaphore = (data) => {
    setSemaphore(data);
    if (data == true){
      localStorage.setItem('semaphoreFlag', true)
    } else {
      localStorage.setItem('semaphoreFlag', false)
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
                  path="/nuevo"
                  element={
                    <NuevoEnsayo
                      semaphore={semaphore}
                      updateSemaphore={updateSemaphore}
                    />
                  }
                />
                <Route path="/visualizar" element={<Visualizar />} />
                <Route path="/visualizar/:disp/:id" element={<Results />} />

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
const DifferentWarningComponent = () => <div
style={{position:"absolute",left:0, top:0,height:"100%", width: "100%",display: "flex", justifyContent: "center", alignContent: "center"}}
>
          <span style={{ fontWeight: "bold", color: "#444", marginTop:"100px" }}>
            Solo se puede utilizar una pestaña
          </span>
        </div>

export default withOneTabEnforcer({OnlyOneTabComponent: DifferentWarningComponent})(App)