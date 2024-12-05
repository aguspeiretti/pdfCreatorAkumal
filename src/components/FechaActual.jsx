const FechaActual = () => {
  // Función para obtener el nombre del mes en español
  const obtenerMesEnEspañol = (mes) => {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return meses[mes];
  };

  // Obtener la fecha actual
  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = obtenerMesEnEspañol(fecha.getMonth());
  const año = fecha.getFullYear();

  return <div className="mt-2">{`Fecha: ${dia} de ${mes} del ${año}`}</div>;
};

export default FechaActual;
