// Prueba la plantilla reparada con datos de ejemplo y verifica que el resultado
// tenga XML valido y se pueda abrir en Word
const fs = require('fs');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const templatePath = './templates/hoja_de_vida_template_fixed.docx';
const outputPath   = './templates/TEST_FIXED.docx';

const content = fs.readFileSync(templatePath, 'binary');
const zip = new PizZip(content);

let doc;
try {
  doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    // Ignorar errores de tags no encontrados (para los GUIDs)
    nullGetter: function() { return ''; },
  });
} catch(e) {
  console.error('Error al cargar la plantilla:', e.message);
  process.exit(1);
}

const datos = {
  tipoActivo: 'COMPUTADOR PORTATIL',
  fechaAdquisicion: '01-ENE-2024',
  numeroInventario: 'TPROPCL-103',
  marca: 'LENOVO',
  modelo: 'ThinkPad E14',
  serial: 'SN12345678',
  estadoFisico: 'BUENO',
  responsable: 'CARLOS BUITRON',
  fechaAsignacion: '15-MAR-2024',
  procesador: 'Intel Core i5 12a gen',
  memoriaRam: '16 GB DDR4',
  discoDuro: '512 GB SSD',
  tarjetaGrafica: 'Intel Iris Xe',
  sistemaOperativo: 'Windows 11 Pro',
  licenciaOffice: 'Microsoft 365',
  accesorios: 'Cargador y maletin',
  garantia: '1 ANO',
  observaciones: 'Buen estado general',
  mantenimientos: [
    { dia: '10', mes: '01', anio: '24', detalle: 'Limpieza interna', firma: '', obs: 'Sin novedad' },
    { dia: '15', mes: '06', anio: '24', detalle: 'Cambio pasta termica', firma: '', obs: 'Temperatura mejorada' },
  ],
};

try {
  doc.render(datos);
} catch(e) {
  console.error('Error al renderizar:', JSON.stringify(e, null, 2));
  process.exit(1);
}

const buffer = doc.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync(outputPath, buffer);
console.log('Documento de prueba generado: ' + outputPath + ' (' + buffer.length + ' bytes)');

// Verificar balance XML del resultado
const resultZip = new PizZip(buffer.toString('binary'));
const resultXml = resultZip.file('word/document.xml').asText();
const openP  = (resultXml.match(/<w:p[ >]/g) || []).length;
const closeP = (resultXml.match(/<\/w:p>/g) || []).length;
console.log('\n=== BALANCE XML DEL DOCUMENTO GENERADO ===');
console.log('  <w:p>  abiertos: ' + openP);
console.log('  </w:p> cerrados: ' + closeP);
console.log('  Balance: ' + (openP === closeP ? 'OK - El archivo deberia abrir en Word correctamente' : 'DESBALANCEADO (' + (openP - closeP) + ')'));
