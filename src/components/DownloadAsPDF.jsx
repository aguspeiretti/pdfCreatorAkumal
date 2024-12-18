import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../style.css";
import FechaActual from "./FechaActual";
import { HiOutlinePaperClip } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

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
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);

      const imgWidth = 210; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("contenido.pdf");
    });
  };

  return (
    <div className="flex">
      <div className="w-[40%] p-4 flex items-center flex-col ">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Crear presupuesto clientes{" "}
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
              Fecha de validez
            </label>
            <input
              type="date"
              className="border p-2 rounded "
              value={validityDate}
              onChange={(e) => setValidityDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col mt-4">
            <label htmlFor="" className="text-white">
              Agregar productos
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
              className="border p-2 rounded mb-4"
              placeholder="Precio"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <button
              onClick={addProduct}
              className="bg-violet-500 text-white p-2 rounded hover:bg-violet-600 mb-8"
            >
              Agregar Producto
            </button>
            <button
              onClick={handleDownloadPDF}
              style={{ marginTop: "20px" }}
              className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600"
            >
              Descargar como PDF
            </button>
          </div>
        </div>
      </div>
      <div
        ref={divRef}
        className="pdf justify-center px-4 text-white flex flex-col items-center"
      >
        <div className="w-full h-full relative flex justify-center">
          <div className="w-full h-[40px] bg-violet-500 absolute bottom-0 flex justify-evenly items-center">
            <div className="flex items-center gap-2">
              <FaInstagram size={22} /> <p>Akumaluniformes</p>
            </div>
            <div className="flex items-center gap-2">
              <FaWhatsapp size={22} /> <p>Local: 351-242 3693</p>
            </div>{" "}
            <div className="flex items-center gap-2">
              <FaWhatsapp size={22} /> <p>Administracion: 351-811 5096</p>
            </div>
          </div>

          <div className="w-[90%] h-full ">
            <header className="w-full h-[25%] flex justify-between p-8">
              <div className="flex flex-col">
                <img
                  src="/logo2.png"
                  className="w-[150px] h-[150px] mb-4"
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
                <div className="flex items-center gap-2 mt-4">
                  <HiOutlinePaperClip size={16} />
                  <p>Oficina: Lascano Colodrero 2962</p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <FaShop size={16} />
                  <p>Local:Av.Rogelio Nores Martinez 3098 Local 2</p>
                </div>
                <p className="mt-4">
                  Fecha de validez:
                  <span className="font-semibold ml-2">
                    {formatDate(validityDate)}
                  </span>{" "}
                </p>
              </div>
            </header>
            <main className="w-full h-[55%] mt-4 ">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-600/20">
                    <th className="border text-xs h-[30px] w-[50%]">
                      <p className="mb-2"> Producto</p>
                    </th>
                    <th className="border text-xs h-[30px] w-[15%] ">
                      <p className="mb-2"> Cantidad</p>
                    </th>
                    <th className="border text-xs h-[30px] w-[15%] ">
                      <p className="mb-2"> Precio Unitario</p>
                    </th>
                    <th className="border text-xs h-[30px] w-[20%] ">
                      <p className="mb-2">Total</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td className="border p-2">{product.name}</td>
                      <td className="border p-2 text-center">
                        {product.quantity}
                      </td>
                      <td className="border p-2 text-center">
                        ${product.price}
                      </td>
                      <td className="border p-2 text-center">
                        ${product.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length > 0 && (
                <>
                  <div className="text-right font-bold mt-8">
                    Total General: ${calculateTotal().toFixed(2)}
                  </div>
                  <div className="text-right font-bold mt-8">
                    Entrega inicial solicitada <br /> $
                    {calculateTotal().toFixed(2) / 2}
                  </div>
                </>
              )}
            </main>
            <footer className="w-full h-[15%] flex relative">
              <div className="flex w-full  mt-4 items-center">
                <p className="text-base w-full text-center">
                  <span className="text-base font-semibold mr-2 ">
                    Forma de pago:
                  </span>
                  50% Al momento de contratar, 50% Contra entrega de la
                  mercadería. <br />
                  <span className="font-bold">
                    EFECTIVO O TRANSFERENCIA BANCARIA.
                  </span>
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadAsPDF;
