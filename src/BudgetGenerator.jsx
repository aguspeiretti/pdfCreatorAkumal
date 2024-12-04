import React, { useState } from "react";
import { jsPDF } from "jspdf";

const BudgetGenerator = () => {
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

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SHEEPERS LABS", 10, 20);
    doc.setFontSize(10);
    doc.text("TU VISION NUESTRO CODIGO", 10, 27);

    doc.text(`Cliente: ${clientName}`, 10, 40);
    doc.text(`Fecha de Validez: ${validityDate}`, 10, 47);

    const headers = ["Producto", "Cantidad", "Precio Unitario", "Total"];
    const startY = 60;
    doc.setFillColor(200, 220, 255);
    doc.rect(10, startY, 190, 10, "F");
    doc.setTextColor(0);
    doc.text(headers[0], 15, startY + 7);
    doc.text(headers[1], 80, startY + 7);
    doc.text(headers[2], 120, startY + 7);
    doc.text(headers[3], 160, startY + 7);

    products.forEach((product, index) => {
      const y = startY + 10 + index * 10;
      doc.text(product.name, 15, y);
      doc.text(product.quantity.toString(), 80, y);
      doc.text(`$${product.price}`, 120, y);
      doc.text(`$${product.totalPrice.toFixed(2)}`, 160, y);
    });

    const totalY = startY + 10 + products.length * 10 + 10;
    doc.text("Total General:", 120, totalY);
    doc.text(`$${calculateTotal().toFixed(2)}`, 160, totalY);

    doc.save(
      `Presupuesto_${clientName}_${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  return (
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
                <td className="border p-2">${product.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length > 0 && (
          <div className="text-right font-bold">
            Total General: ${calculateTotal().toFixed(2)}
          </div>
        )}

        <button
          onClick={downloadPDF}
          disabled={products.length === 0}
          className="mt-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Descargar PDF
        </button>
      </div>
    </div>
  );
};

export default BudgetGenerator;
