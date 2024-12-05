import "./App.css";

import ListaDePrecios from "./components/ListaDePrecios";
import Presupuesto from "./components/Presupuesto";
import { BrowserRouter, Routes, Route } from "react-router";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListaDePrecios />} />
          <Route path="Presupuesto" element={<Presupuesto />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
