import api from './api';
import { saveAs } from 'file-saver';

/**
 * Llama al backend para generar la Hoja de Vida usando la plantilla oficial de Teams Pro
 * y descarga el archivo .docx resultante.
 *
 * @param {number|string} equipoId - ID del equipo en la base de datos
 * @param {string} numeroInventario - Número de inventario (para el nombre del archivo)
 */
export async function exportarHojaVidaWord(equipoId, numeroInventario) {
  const response = await api.get(`/equipos/${equipoId}/exportar-word`, {
    responseType: 'blob',
  });

  const safeInventario = numeroInventario
    ? String(numeroInventario).replace(/[^a-zA-Z0-9-_]/g, '_')
    : 'Equipo';

  const nombreArchivo = `HojaVida_${safeInventario}.docx`;
  saveAs(response.data, nombreArchivo);
}
