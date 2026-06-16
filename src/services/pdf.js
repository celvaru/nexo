import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const pdfService = {
  async generarPDFTabla(elementId, options = {}) {
    const {
      titulo = 'Reporte',
      nombreArchivo = 'reporte',
      logo = null,
      orientacion = 'portrait'
    } = options

    const elemento = document.getElementById(elementId)
    
    if (!elemento) {
      alert('No se encontró la tabla para generar el PDF')
      return
    }

    // Clonar la tabla para no afectar la original
    const contenedor = document.createElement('div')
    contenedor.style.position = 'fixed'
    contenedor.style.left = '-9999px'
    contenedor.style.top = '0'
    contenedor.style.width = '100%'
    contenedor.style.backgroundColor = 'white'
    contenedor.style.padding = '20px'
    contenedor.style.zIndex = '9999'
    
    const tablaClon = elemento.cloneNode(true)
    contenedor.appendChild(tablaClon)
    
    // Agregar estilos
    const estilo = document.createElement('style')
    estilo.textContent = `
    table {
        width: 100%;
        border-collapse: collapse;
        font-family: Arial, sans-serif, bold;
        font-size: 20px;
    }
    th {
        background-color: #6a0dad;
        color: white;
        padding: 10px;
        text-align: left;
        font-weight: bold;
        font-size: 25px;
    }
    td {
        padding: 8px 10px;
        border-bottom: 1px solid #ddd;
        font-size: 22px;
    }
    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    `
    contenedor.appendChild(estilo)
    document.body.appendChild(contenedor)
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      const canvas = await html2canvas(contenedor, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      })
      
      document.body.removeChild(contenedor)

      const imgData = canvas.toDataURL('image/png')
      
      const pdf = new jsPDF(orientacion, 'mm', 'a4')
      const pageWidth = orientacion === 'landscape' ? 297 : 210
      const pageHeight = orientacion === 'landscape' ? 210 : 297
      const margin = 15
      let y = 20

      // Logo
      if (logo) {
        try {
          pdf.addImage(logo, 'PNG', margin, y - 5, 25, 25)
        } catch (error) {
          console.warn('No se pudo cargar el logo:', error)
        }
      }

      // Título
      pdf.setFontSize(23)
      pdf.setTextColor(60, 60, 60)
      const tituloX = logo ? 50 : margin
      pdf.text(`Nexo Inmobiliario - ${titulo}`, tituloX, y + 5)
      y += 13

      // Fecha
      pdf.setFontSize(10)
      pdf.setTextColor(120, 120, 120)
      const fecha = new Date().toLocaleString('es-BO')
      pdf.text(`Generado: ${fecha}`, tituloX, y + 2)
      y += 13

      // Imagen de la tabla
      const imgWidth = pageWidth - (margin * 2)
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let finalHeight = imgHeight
      let finalWidth = imgWidth
      const maxHeight = pageHeight - 50
      
      if (imgHeight > maxHeight) {
        finalHeight = maxHeight
        finalWidth = (canvas.width * maxHeight) / canvas.height
      }
      
      pdf.addImage(imgData, 'PNG', margin, y, finalWidth, finalHeight)

      // Pie de página
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text(
        'Nexo Inmobiliario - Reporte generado automáticamente',
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )

      pdf.save(`${nombreArchivo}_${new Date().toISOString().split('T')[0]}.pdf`)
      
    } catch (error) {
      console.error('Error al generar PDF:', error)
      if (document.body.contains(contenedor)) {
        document.body.removeChild(contenedor)
      }
      alert('Error al generar el PDF')
    }
  }
}

export default pdfService