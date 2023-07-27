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
  let [prev, setPrev] = useState(null);
  let [semaphore, setSemaphore] = useState(false);

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
    }
    setSemaphore(false);
  };

  // liberar semáforo si sale de la página
  useEffect(() => {
    if (prev == "/nuevo" && semaphore === true) {
      releaseLock();
    }
    setPrev(router.pathname);
  }, [router.pathname]);

  //liberar semáforo si cierra o refresca la página
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (semaphore === true) {
        releaseLock();
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
const DifferentWarningComponent = () => <div
style={{position:"absolute",left:0, top:0,height:"100%", width: "100%",display: "flex", justifyContent: "center", alignContent: "center"}}
>
          <span style={{ fontWeight: "bold", color: "#444", marginTop:"100px" }}>
            Solo se puede utilizar una pestaña
          </span>
        </div>

export default withOneTabEnforcer({OnlyOneTabComponent: DifferentWarningComponent})(App)