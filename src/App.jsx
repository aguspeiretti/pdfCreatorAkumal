import "./App.css";
import ListaDePrecios from "./components/ListaDePrecios";
import NotaDePedido from "./components/NotaDePedido";
import Presupuesto from "./components/Presupuesto";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListaDePrecios />} />
          <Route path="/Presupuesto" element={<Presupuesto />} />
          <Route path="/Nota-de-pedido" element={<NotaDePedido />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
