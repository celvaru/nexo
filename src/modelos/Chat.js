class Chat {
  constructor(id, fechainicio, fechaFin, usuarioId, propiedadId) {
    this.id = id
    this.fechainicio = fechainicio
    this.fechaFin = fechaFin
    this.usuarioId = usuarioId
    this.propiedadId = propiedadId
    this.mensajes = []  // Relación: un chat tiene muchos mensajes
  }
}

export default Chat