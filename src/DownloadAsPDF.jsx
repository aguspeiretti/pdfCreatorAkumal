import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./style.css";

const DownloadAsPDF = () => {
  const divRef = useRef();
  const [clientName, setClientName] = useState("");
  const [validityDate, setValidityDate] = useState("");
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  const addProduct = () => {
    if (newProduct.name && newProduct.quantity && newProduct.price) {
      const totalPrice =
        parseFloat(newProduct.quantity) * parseFloat(newProduct.price);
      setProducts([
        ...products,
        {
          ...newProduct,
          totalPrice,
        },
      ]);
      setNewProduct({ name: "", quantity: "", price: "" });
    }
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => total + product.totalPrice, 0);
  };

  const handleDownloadPDF = () => {
    const element = divRef.current;

    html2canvas(element, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Dimensiones del PDF (A4 en mm: 210 x 297)
      const imgWidth = 210; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Mantener la proporción

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("contenido.pdf");
    });
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4"></h1>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              className="border p-2 rounded"
              placeholder="Nombre del Cliente"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <input
              type="date"
              className="border p-2 rounded"
              placeholder="Fecha de Validez"
              value={validityDate}
              onChange={(e) => setValidityDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            <input
              className="border p-2 rounded"
              placeholder="Producto"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="number"
              className="border p-2 rounded"
              placeholder="Cantidad"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: e.target.value })
              }
            />
            <input
              type="number"
              className="border p-2 rounded"
              placeholder="Precio"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <button
              onClick={addProduct}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Agregar Producto
            </button>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Producto</th>
                <th className="border p-2">Cantidad</th>
                <th className="border p-2">Precio Unitario</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">{product.quantity}</td>
                  <td className="border p-2">${product.price}</td>
                  <td className="border p-2">
                    ${product.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length > 0 && (
            <div className="text-right font-bold">
              Total General: ${calculateTotal().toFixed(2)}
            </div>
          )}
        </div>
      </div>
      <div
        ref={divRef}
        className="pdf  justify-center p-8 text-white flex flex-col items-center  "
      >
        <div className="w-[85%] h-[85%] bg-white">
          <header className="w-full h-[20%] bg-slate-400 flex justify-between p-8">
            <div className="flex flex-col">
              <img src="" alt="img" />
              <p>Nombre del cliente</p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p>Nº Presupuesto</p>
                <p>142</p>
              </div>
              <p>Fecha</p>
            </div>
          </header>
          <main className="w-full h-[80%] bg-slate-300">
            <table></table>
          </main>
        </div>
        <footer className="w-full h-[15%] relative ">
          <div className="flex w-full justify-between px-24 mt-4 items-center">
            <p className="text-lg">
              <span className="text-xl font-semibold">Forma de pago:</span>
              <br /> 50% al momento de contratar, <br /> 50% al momento de la
              enterga.
            </p>
            <p className="text-center">
              <span className="text-xl font-semibold">vijente hasta:</span>{" "}
              <br /> 16/01/89
            </p>
          </div>
          <div className="w-full h-[40px] bg-violet-500 absolute bottom-0"></div>
        </footer>
      </div>
      <button onClick={handleDownloadPDF} style={{ marginTop: "20px" }}>
        Descargar como PDF
      </button>
    </div>
  );
};

export default DownloadAsPDF;
