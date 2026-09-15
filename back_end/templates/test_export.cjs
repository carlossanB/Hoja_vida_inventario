const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

const templatePath = path.join(__dirname, 'hoja_de_vida_template.docx');
const content = fs.readFileSync(templatePath, 'binary');

const zip = new PizZip(content);
const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true,
});

const testData = {
  tipoActivo: 'COMPUTADOR PORTÁTIL',
  fechaAdquisicion: '15-AGO-2024',
  numeroInventario: 'TPROPCL-103',
  marca: 'LENOVO',
  modelo: 'IDEAPAD SLIM 5',
  serial: 'MP2M1SVL',
  estadoFisico: 'BUENO',
  responsable: 'MARÍA PAULA GUTIÉRREZ',
  fechaAsignacion: '15-AGO-2024',
  procesador: 'INTEL Core i7-13620H 2.4GHz',
  memoriaRam: '16 GB DDR5',
  discoDuro: '512 GB SSD M.2 PCIe',
  tarjetaGrafica: 'Intel Iris Xe Integrada',
  sistemaOperativo: 'Windows 11 Home',
  licenciaOffice: 'Microsoft 365 Personal',
  accesorios: 'Cargador con adaptador de corriente',
  garantia: '1 Año',
  observaciones: 'Equipo en óptimas condiciones de funcionamiento.',
  mantenimientos: [
    {
      dia: '15',
      mes: '08',
      anio: '24',
      detalle: 'Mantenimiento preventivo general, limpieza física, actualización de parches de seguridad y punto de restauración.',
      firma: '',
      obs: 'Sin novedades',
    },
    {
      dia: '20',
      mes: '01',
      anio: '25',
      detalle: 'Limpieza de ventiladores, verificación de disco y optimización de inicio de sistema.',
      firma: '',
      obs: 'OK',
    },
  ],
};

doc.render(testData);

const buf = doc.getZip().generate({
  type: 'nodebuffer',
  compression: 'DEFLATE',
});

const outputPath = path.join(__dirname, 'HojaVida_Test_TPROPCL-103.docx');
fs.writeFileSync(outputPath, buf);

console.log('✅ Generated test document at:', outputPath);
