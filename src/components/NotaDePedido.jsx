import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../style.css";
import FechaActual from "./FechaActual";
import { HiOutlinePaperClip } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import NavButton from "./NavButton";

const NotaDePedido = () => {
  const divRef = useRef();
  const [clientName, setClientName] = useState("");
  const [Observaciones, setObservaciones] = useState("");
  const [orden, setOrden] = useState("");
  const [validityDate, setValidityDate] = useState("");
  const [products, setProducts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    talle: "",
  });

  const addProduct = () => {
    if (newProduct.quantity && newProduct.talle) {
      const totalPrice =
        parseFloat(newProduct.quantity) * parseFloat(newProduct.talle);

      if (editingIndex !== null) {
        // Update existing product
        const updatedProducts = [...products];
        updatedProducts[editingIndex] = {
          ...newProduct,
          totalPrice,
        };
        setProducts(updatedProducts);
        setEditingIndex(null);
      } else {
        // Add new product
        setProducts([
          ...products,
          {
            ...newProduct,
            totalPrice,
          },
        ]);
      }

      // Reset new product state
      setNewProduct({ name: "", quantity: "", talle: "" });
    }
  };

  const startEditProduct = (index) => {
    const productToEdit = products[index];
    setNewProduct({
      name: productToEdit.name,
      quantity: productToEdit.quantity.toString(),
      talle: productToEdit.talle,
    });
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setNewProduct({ name: "", quantity: "", price: "" });
  };

  const deleteProduct = (indexToRemove) => {
    setProducts(products.filter((_, index) => index !== indexToRemove));
  };

  const formatDate = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year.slice(-2)}`; // Extraemos los últimos 2 dígitos del año
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => total + product.totalPrice, 0);
  };

  const handleDownloadPDF = () => {
    const element = divRef.current;

    html2canvas(element, { scale: 3 }).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      const imgData = canvas.toDataURL("image/png");

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add extra pages if content overflows
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("contenido.pdf");
    });
  };
  console.log(products.length);

  return (
    <div className="flex">
      <div className="w-[40%] p-4 flex items-center flex-col mt-8 ">
        <NavButton />
        <h1 className="text-2xl font-bold mb-4 text-white">
          Crear Nota de pedido
        </h1>
        <div className="w-[80%]">
          <div className="flex flex-col">
            <label htmlFor="" className="text-white">
              Nombre del cliente
            </label>
            <input
              className="border p-2 rounded mb-4"
              placeholder="Nombre del Cliente"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <label htmlFor="" className="text-white">
              Numero de orden
            </label>
            <input
              className="border p-2 rounded mb-4"
              placeholder="Nombre del Cliente"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            />
            <label htmlFor="" className="text-white">
              Fecha de validez
            </label>
            <input
              type="date"
              className="border p-2 rounded "
              value={validityDate}
              onChange={(e) => setValidityDate(e.target.value)}
            />
            <label htmlFor="" className="text-white">
              Observaciones
            </label>
            <textarea
              type="text"
              className="border p-2 rounded "
              value={Observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            ></textarea>
          </div>

          <div className="flex flex-col mt-4">
            <label htmlFor="" className="text-white">
              {editingIndex !== null ? "Editar producto" : "Agregar productos"}
            </label>
            <input
              className="border p-2 rounded"
              placeholder="Producto"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="talle"
              value={newProduct.talle}
              onChange={(e) =>
                setNewProduct({ ...newProduct, talle: e.target.value })
              }
            />
            <input
              type="number"
              className="border p-2 rounded  mb-4"
              placeholder="Cantidad"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: e.target.value })
              }
            />

            <div className="flex gap-2">
              <button
                onClick={addProduct}
                className="bg-violet-500 text-white p-2 rounded hover:bg-violet-600 mb-8 flex-grow"
              >
                {editingIndex !== null ? "Guardar Cambios" : "Agregar Producto"}
              </button>
              {editingIndex !== null && (
                <button
                  onClick={cancelEdit}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 mb-8"
                >
                  Cancelar
                </button>
              )}
            </div>
            <button
              onClick={handleDownloadPDF}
              className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600"
            >
              Descargar como PDF
            </button>
          </div>
        </div>
      </div>
      <div
        ref={divRef}
        className="pdf  justify-center px-4 text-white flex flex-col items-center "
      >
        <div className="w-full h-auto relative flex justify-center">
          <div className="w-[90%] h-fit min-h-[297mm] ">
            <header className="w-full h-[12%] flex justify-between p-8">
              <div className="flex flex-col">
                <img
                  src="/logo2.png"
                  className="w-[100px] h-[100px] "
                  alt="Logo"
                />
                <p className="mt-4 ">
                  Cliente:{" "}
                  <span className="font-semibold ">
                    {clientName || "Nombre del cliente"}
                  </span>
                </p>
              </div>
              <div className="flex flex-col">
                <p>
                  <FechaActual />
                </p>
                <p className="mt-4">
                  <span className="font-semibold">Nº de orden:</span> {orden}
                </p>
                <p className="mt-4">
                  <span className="font-semibold">Fecha ideal de entrega:</span>
                  <span className="font-semibold ml-2">
                    {formatDate(validityDate)}
                  </span>{" "}
                </p>
              </div>
            </header>
            <div className="w-full h-[8%] flex flex-col">
              <p className="font-semibold mb-4">Observaciones:</p>
              <p>{Observaciones}</p>
            </div>
            <main className="w-full h-auto mt-4 ">
              <table className="w-full h-full border-collapse mt-8">
                <thead>
                  <tr className="bg-zinc-600/20">
                    <th className="border  border-black text-xs h-[30px] w-[40%]">
                      <p className="mb-2"> Descripcion</p>
                    </th>
                    <th className="border border-black  text-xs h-[30px] w-[15%] ">
                      <p className="mb-2"> Talle</p>
                    </th>
                    <th className="border border-black  text-xs h-[30px] w-[15%] ">
                      <p className="mb-2"> Cantidad</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} onClick={() => startEditProduct(index)}>
                      <td className="border border-black p-2 cursor-pointer">
                        {product.name}
                      </td>
                      <td className="border border-black p-2 text-center">
                        {product.talle}
                      </td>
                      <td className="border border-black p-2 text-center">
                        {product.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotaDePedido;
