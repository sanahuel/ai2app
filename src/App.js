import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/sidebar";
import NuevoEnsayo from "./pages/NuevoEnsayo";
import Panel from "./pages/Panel";
import Visualizar from "./pages/Visualizar";
import Nav from "./components/navbar";

function App() {
  return (
    <>
      <Sidebar />
      <Nav />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/control" element={<Panel />} />
          <Route path="/nuevo" element={<NuevoEnsayo />} />
          <Route path="/visualizar" element={<Visualizar />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
