import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router";
const NavButton = () => {
  const [open, setOpen] = useState(false);

  const handleMenu = () => {
    setOpen(!open);
  };

  return (
    <div className="flex flex-col">
      <div
        onClick={handleMenu}
        className="w-12 h-12 bg-black rounded-full absolute top-2 left-2 flex justify-center items-center "
      >
        <AiOutlineMenu color="white" />
      </div>
      <div
        className={`w-[300px] h-auto bg-zinc-700/90 rounded-xl shadow-xl flex flex-col items-center justify-around p-4 absolute top-20 ${
          open ? "left-0" : "left-[-500px]"
        } `}
      >
        <Link to={"/"} className="w-[100%]">
          <li className="text-white text-xl border-2 w-[90%] border-violet-600 list-none p-4 text-center rounded-lg mb-4 bg-violet-700">
            Lista de precios
          </li>
        </Link>
        <Link to={"Presupuesto"} className="w-[100%]">
          <li className="text-white text-xl border-2 w-[90%] border-violet-600 list-none p-4 text-center rounded-lg mb-4 bg-violet-700">
            Presupuesto
          </li>
        </Link>
        <Link to={"Nota-de-Pedido"} className="w-[100%]">
          <li className="text-white text-xl border-2 w-[90%] border-violet-600 list-none p-4 text-center rounded-lg mb-4 bg-violet-700">
            Nota de pedido
          </li>
        </Link>
      </div>
    </div>
  );
};

export default NavButton;
