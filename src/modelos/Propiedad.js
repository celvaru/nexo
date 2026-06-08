class Propiedad {
  constructor(id, titulo, descripcion, precio, ubicacion, latitud, longitud, categoria, numHabitaciones, estacionamiento, superficie, estado, usuarioId) {
    this.id = id
    this.titulo = titulo
    this.descripcion = descripcion
    this.precio = precio
    this.ubicacion = ubicacion
    this.latitud = latitud
    this.longitud = longitud
    this.categoria = categoria
    this.numHabitaciones = numHabitaciones
    this.estacionamiento = estacionamiento
    this.superficie = superficie
    this.estado = estado
    this.usuarioId = usuarioId
    this.imagenes = []  // Relación: una propiedad tiene muchas imágenes
  }
}

export default Propiedad