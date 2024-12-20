import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../style.css";
import FechaActual from "./FechaActual";
import { HiOutlinePaperClip } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import NavButton from "./NavButton";

const ListaDePrecios = () => {
  const divRef = useRef();
  const [clientName, setClientName] = useState("");
  const [validityDate, setValidityDate] = useState("");
  const [products, setProducts] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [destinoPhone, setDestinoPhone] = useState("");
  const [manejarFondo, setManejarFondo] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    talle: "",
    price: "",
  });
  console.log(manejarFondo);

  const addProduct = () => {
    if (newProduct.name && newProduct.talle && newProduct.price) {
      const totalPrice = parseFloat(newProduct.price);

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
      setNewProduct({ name: "", talle: "", price: "" });
    }
  };
  const startEditProduct = (index) => {
    const productToEdit = products[index];
    setNewProduct({
      name: productToEdit.name,
      talle: productToEdit.talle, // Changed from quantity to talle
      price: productToEdit.price.toString(),
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

  const handleSendPDFToWhatsApp = async (destinoPhone) => {
    const element = divRef.current;

    const canvas = await html2canvas(element, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4", true);

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    const pdfBlob = pdf.output("blob");
    const pdfFile = new File([pdfBlob], "lista-precios.pdf", {
      type: "application/pdf",
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Lista de Precios",
          text: "Documento de lista de precios",
          files: [pdfFile],
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${destinoPhone}&text=${encodeURIComponent(
        "Lista de Precios"
      )}`;
      window.open(whatsappUrl, "_blank");
    }
  };
  const manejarCambioCheckbox = (e) => {
    // Actualizamos el estado según si el checkbox está marcado o no
    setManejarFondo(e.target.checked);
  };

  return (
    <div className="flex">
      <div className="w-[40%] p-4 flex items-center flex-col ">
        <NavButton />
        <h1 className="text-2xl font-bold mb-4 text-white mt-20">
          Crear lista de precios{" "}
        </h1>
        <div className="w-[80%]">
          <div className="flex flex-col">
            <label htmlFor="" className="text-white">
              Nombre del cliente
            </label>
            <input
              className="border p-2 rounded-full  px-4 mb-4"
              placeholder="Nombre del Cliente"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <label htmlFor="" className="text-white">
              Fecha de validez
            </label>
            <input
              type="date"
              className="border p-2 rounded-full px-4  "
              value={validityDate}
              onChange={(e) => setValidityDate(e.target.value)}
            />
            <label htmlFor="" className="text-white mt-2">
              Fondo blanco?
            </label>
            <div>
              <input
                type="checkbox"
                className=" "
                value={manejarFondo}
                onChange={manejarCambioCheckbox}
              />
            </div>
          </div>

          <div className="flex flex-col mt-4">
            <label htmlFor="" className="text-white">
              {editingIndex !== null ? "Editar producto" : "Agregar productos"}
            </label>
            <input
              className="border p-2 rounded-full px-4  mb-2 mt-2"
              placeholder="Producto"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="text"
              className="border p-2 rounded-full px-4  mb-2 "
              placeholder="Talles"
              value={newProduct.talle}
              onChange={(e) =>
                setNewProduct({ ...newProduct, talle: e.target.value })
              }
            />
            <input
              type="number"
              className="border p-2 rounded-full  px-4 mb-4"
              placeholder="Precio"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <div className="flex gap-2">
              <button
                onClick={addProduct}
                className="bg-violet-500  text-white p-2 rounded-full hover:bg-violet-600 mb-8 flex-grow"
              >
                {editingIndex !== null ? "Guardar Cambios" : "Agregar Producto"}
              </button>
              {editingIndex !== null && (
                <button
                  onClick={cancelEdit}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 mb-8 "
                >
                  Cancelar
                </button>
              )}
            </div>
            <div className="flex justify-evenly">
              <button
                onClick={handleDownloadPDF}
                style={{ marginTop: "20px" }}
                className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 w-[40%]"
              >
                Descargar como PDF
              </button>

              <button
                onClick={() => handleSendPDFToWhatsApp(destinoPhone)}
                style={{ marginTop: "20px" }}
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600  w-[40%]"
              >
                Enviar por whatsapp
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={divRef}
        className={`${
          manejarFondo === false
            ? "pdf justify-center px-4 text-white flex flex-col items-center"
            : "fondoblanco justify-center px-4 text-white flex flex-col items-center"
        }`}
      >
        <div className="w-full h-full relative flex justify-center">
          <div
            className={`${
              manejarFondo === true
                ? "hidden "
                : "w-full h-[40px] bg-violet-500 absolute bottom-0 flex justify-evenly items-center"
            }`}
          >
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
                      <p className="mb-2"> Talle</p>
                    </th>
                    <th className="border text-xs h-[30px] w-[15%] ">
                      <p className="mb-2"> Precio Unitario</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={index}
                      onClick={() => startEditProduct(index)}
                      className="cursor-pointer"
                    >
                      <td className="border p-2">{product.name}</td>
                      <td className="border p-2 text-center">
                        {product.talle}
                      </td>
                      <td className="border p-2 text-center">
                        ${product.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </main>
            <footer className="w-full h-[15%] flex relative">
              <div
                className={`${
                  manejarFondo === true
                    ? "hidden "
                    : "flex w-full  mt-4 items-center"
                }`}
              >
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

export default ListaDePrecios;
