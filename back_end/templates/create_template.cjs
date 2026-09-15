const fs = require('fs');
const PizZip = require('pizzip');

const content = fs.readFileSync('back_end/templates/hoja_de_vida_original.docx', 'binary');
const zip = new PizZip(content);
let docXml = zip.file('word/document.xml').asText();

// Helper to replace paragraph text in a cell while preserving paragraph/run properties
// In Word XML, a table cell <w:tc> contains <w:p> containing <w:pPr> and <w:r><w:rPr>...<w:t>text</w:t></w:r>
// Let's create a clean replacer function for specific cells in each table

// 1. Parse tables
const tableParts = docXml.split(/(<w:tbl[\s\S]*?<\/w:tbl>)/);

// Table 1: Identificación General
let tbl1 = tableParts[1];
// Replace values in Table 1
// Activo informático: COMPUTADOR PORTÁTIL -> {tipoActivo}
tbl1 = tbl1.replace(/(<w:t[^>]*>)COMPUTADOR PORTÁTIL(<\/w:t>)/, '$1{tipoActivo}$2');

// Fecha de adquisición: 13-JUN-2024 (it's split across runs <w:t>13</w:t> ... <w:t>-JUN-2024</w:t>)
// Let's find the cell containing FECHA DE ADQUISICIÓN and replace its value cell
tbl1 = tbl1.replace(/FECHA DE ADQUISICIÓN:[\s\S]*?<\/w:tc>\s*<w:tc>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc>[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{fechaAdquisicion}</w:t></w:r>$2');
});

// No. INVENTARIO: TPROPCL-103
tbl1 = tbl1.replace(/No\. INVENTARIO:[\s\S]*?<\/w:tc>\s*<w:tc>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc>[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{numeroInventario}</w:t></w:r>$2');
});

// MARCA: LENOVO
tbl1 = tbl1.replace(/MARCA:[\s\S]*?<\/w:tc>\s*<w:tc>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc>[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{marca}</w:t></w:r>$2');
});

// MODELO: IDEAPAD SLIM 5
tbl1 = tbl1.replace(/MODELO:[\s\S]*?<\/w:tc>\s*<w:tc>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc>[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{modelo}</w:t></w:r>$2');
});

// SERIAL: MP2M1SVL
tbl1 = tbl1.replace(/SERIAL:[\s\S]*?<\/w:tc>\s*<w:tc>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc>[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{serial}</w:t></w:r>$2');
});

// ESTADO: BUENO
tbl1 = tbl1.replace(/ESTADO:[\s\S]*?<\/w:tc>\s*<w:tc>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc>[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{estadoFisico}</w:t></w:r>$2');
});

// RESPONSIBLE: MARÍA PAULA GUTIERREZ
tbl1 = tbl1.replace(/RESPONSIBLE:[\s\S]*?<\/w:tc>\s*<w:tc[\s\S]*?>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{responsable}</w:t></w:r>$2');
});

// FECHA ASIGNACIÓN: 13-JUN-2024
tbl1 = tbl1.replace(/FECHA ASIGNACIÓN:[\s\S]*?<\/w:tc>\s*<w:tc[\s\S]*?>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{fechaAsignacion}</w:t></w:r>$2');
});

tableParts[1] = tbl1;

// Table 2: Especificaciones Técnicas
let tbl2 = tableParts[3];

// PROCESADOR: INTEL i7-13620H 2.4GHz
tbl2 = tbl2.replace(/PROCESADOR:[\s\S]*?<\/w:p><\/w:tc>\s*<w:tc[\s\S]*?>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{procesador}</w:t></w:r>$2');
});

// RAM cell (row 1, cell 4: 16GB DDR?)
// Let's replace the 4th cell of row 1 in tbl2
tbl2 = tbl2.replace(/(<w:tr[\s\S]*?<w:tc[\s\S]*?<\/w:tc>\s*<w:tc[\s\S]*?<\/w:tc>\s*<w:tc[\s\S]*?<\/w:tc>\s*<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>\s*<\/w:tr>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{memoriaRam}</w:t></w:r>$2');

// DISCO DURO: SSD M.2 PCIe 512GB
tbl2 = tbl2.replace(/DISCO DURO:[\s\S]*?<\/w:tc>\s*<w:tc[\s\S]*?>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{discoDuro}</w:t></w:r>$2');
});

// TARJETA GRÁFICA: INTEGRADA INTEL IRIS
tbl2 = tbl2.replace(/TARJETA GRÁFICA:[\s\S]*?<\/w:tc>\s*<w:tc[\s\S]*?>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{tarjetaGrafica}</w:t></w:r>$2');
});

// SISTEMA OPERATIVO: WINDOWS 11 HOME SL
tbl2 = tbl2.replace(/SISTEMA OPERATIVO:[\s\S]*?<\/w:tc>\s*<w:tc[\s\S]*?>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{sistemaOperativo}</w:t></w:r>$2');
});

// LICENCIA OFFICE: 365 PERSONAL x 1 AÑO
tbl2 = tbl2.replace(/LICENCIA OFFICE:[\s\S]*?<\/w:tc>\s*<w:tc[\s\S]*?>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{licenciaOffice}</w:t></w:r>$2');
});

// ACCESORIOS: CARGADOR CON ADAPTADOR DE CORRIENTE
tbl2 = tbl2.replace(/ACCESORIOS:[\s\S]*?<\/w:tc>\s*<w:tc[\s\S]*?>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{accesorios}</w:t></w:r>$2');
});

// GARANTÍA: 1 AÑO
tbl2 = tbl2.replace(/GARANTÍA:[\s\S]*?<\/w:tc>\s*<w:tc[\s\S]*?>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{garantia}</w:t></w:r>$2');
});

// OBSERVACIONES: OMITIDO
tbl2 = tbl2.replace(/OBSERVACIONES:[\s\S]*?<\/w:tc>\s*<w:tc[\s\S]*?>[\s\S]*?<\/w:tc>/, (match) => {
  return match.replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/><w:b/><w:bCs/></w:rPr><w:t>{observaciones}</w:t></w:r>$2');
});

tableParts[3] = tbl2;

// Table 3: Historial de Mantenimiento
// Row 1 and Row 2 are table headers.
// Row 3 is the data row with {#mantenimientos}...{/mantenimientos}
let tbl3 = tableParts[5];

// Split tbl3 rows:
const tbl3Rows = tbl3.split(/(<w:tr[\s\S]*?<\/w:tr>)/);

// We want to replace the 3rd row (index 5 because of split pattern)
let dataRow = tbl3Rows[5];

// In dataRow:
// Cell 1: Day -> {#mantenimientos}{dia}
// Cell 2: Month -> {mes}
// Cell 3: Year -> {anio}
// Cell 4: Description -> {detalle}
// Cell 5: Signature -> {firma}
// Cell 6: Observations -> {obs}{/mantenimientos}

const cells = dataRow.split(/(<w:tc[\s\S]*?<\/w:tc>)/);
// cells[1]: Day
cells[1] = cells[1].replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/></w:rPr><w:t>{#mantenimientos}{dia}</w:t></w:r>$2');
// cells[3]: Month
cells[3] = cells[3].replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/></w:rPr><w:t>{mes}</w:t></w:r>$2');
// cells[5]: Year
cells[5] = cells[5].replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/></w:rPr><w:t>{anio}</w:t></w:r>$2');
// cells[7]: Detalle
cells[7] = cells[7].replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/></w:rPr><w:t>{detalle}</w:t></w:r>$2');
// cells[9]: Firma (keep empty or {firma})
cells[9] = cells[9].replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/></w:rPr><w:t>{firma}</w:t></w:r>$2');
// cells[11]: Observaciones
cells[11] = cells[11].replace(/(<w:tc[\s\S]*?<w:pPr>[\s\S]*?<\/w:pPr>)[\s\S]*?(<\/w:tc>)/, '$1<w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:hAnsi="Arial Narrow"/></w:rPr><w:t>{obs}{/mantenimientos}</w:t></w:r>$2');

tbl3Rows[5] = cells.join('');
tableParts[5] = tbl3Rows.join('');

docXml = tableParts.join('');

zip.file('word/document.xml', docXml);

const buffer = zip.generate({ type: 'nodebuffer' });
fs.writeFileSync('back_end/templates/hoja_de_vida_template.docx', buffer);

console.log('✅ Template hoja_de_vida_template.docx created successfully with all placeholders!');
