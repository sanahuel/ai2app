import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NuevoEnsayo from "./pages/NuevoEnsayo";
import Login from "./pages/Login";
import Sidebar from "./components/sidebar";
import Panel from "./pages/Panel";
import Lifespan from "./pages/lifespan1";
import LifespanR from "./pages/lifespanr";
import Visualizar from "./pages/Visualizar";
import Results from "./pages/Results";
import Nav from "./components/navbar";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const router = useLocation();
  let [prev, setPrev] = useState(null);
  let [semaphore, setSemaphore] = useState(false);

  const releaseLock = () => {
    if (semaphore === true) {
      console.log("releasing..... semaphore", semaphore);
      fetch("http://127.0.0.1:8000/new/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
      <AuthProvider>
        <Sidebar />
        <Nav />
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/control" element={<Panel />} />
              <Route path="/control/lifespan-1" element={<Lifespan />} />
              <Route path="/visualizar/lifespan-r" element={<LifespanR />} />
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
              <Route path="/visualizar/:id" element={<Results />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </>
  );
}

export default App;
