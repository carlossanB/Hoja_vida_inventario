const fs = require('fs');
const PizZip = require('pizzip');

const templatePath = './templates/hoja_de_vida_template.docx';
const content = fs.readFileSync(templatePath, 'binary');
const zip = new PizZip(content);
let xml = zip.file('word/document.xml').asText();

// Buscar la celda con {memoriaRam} y su celda anterior
// Reemplazamos el texto vacío en la celda anterior por MEMORIA RAM:
const targetEmptyCell = '<w:p w14:paraId="71B7EA18" w14:textId="3EFE8B60" w:rsidR="003E7FD0" w:rsidRPr="00443951" w:rsidRDefault="00262ACB" w:rsidP="00B06A5C"><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:rPr><w:rFonts w:ascii="Arial Narrow" w:eastAsia="Times New Roman" w:hAnsi="Arial Narrow" w:cs="Calibri"/><w:b/><w:bCs/><w:color w:val="000000"/><w:lang w:val="en-US"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:eastAsia="Times New Roman" w:hAnsi="Arial Narrow" w:cs="Calibri"/><w:b/><w:bCs/><w:color w:val="000000"/><w:lang w:val="en-US"/></w:rPr><w:t xml:space="preserve"> </w:t></w:r></w:p>';

const replacementCell = '<w:p w14:paraId="71B7EA18" w14:textId="3EFE8B60" w:rsidR="003E7FD0" w:rsidRPr="00443951" w:rsidRDefault="00262ACB" w:rsidP="00B06A5C"><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/><w:rPr><w:rFonts w:ascii="Arial Narrow" w:eastAsia="Times New Roman" w:hAnsi="Arial Narrow" w:cs="Calibri"/><w:b/><w:bCs/><w:color w:val="000000"/><w:lang w:val="en-US"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Arial Narrow" w:eastAsia="Times New Roman" w:hAnsi="Arial Narrow" w:cs="Calibri"/><w:b/><w:bCs/><w:color w:val="000000"/><w:lang w:val="en-US"/></w:rPr><w:t>MEMORIA RAM:</w:t></w:r></w:p>';

if (xml.includes(targetEmptyCell)) {
  xml = xml.replace(targetEmptyCell, replacementCell);
  console.log('✓ Celda reemplazada exitosamente con MEMORIA RAM:');
} else {
  // Búsqueda más flexible por regex
  console.log('Intentando reemplazo por patrón...');
  xml = xml.replace(/(<w:tcPr><w:tcW w:w="1980"[^>]*>[\s\S]*?<\/w:tcPr><w:p[^>]*>[\s\S]*?)<w:t xml:space="preserve">\s*<\/w:t>([\s\S]*?<\/w:p><\/w:tc>\s*<w:tc><w:tcPr><w:tcW w:w="2975"[^>]*>[\s\S]*?\{memoriaRam\})/g, '$1<w:t>MEMORIA RAM:</w:t>$2');
  console.log('✓ Reemplazo por patrón aplicado.');
}

// Verificar balance de etiquetas
const openP = (xml.match(/<w:p[ >]/g) || []).length;
const closeP = (xml.match(/<\/w:p>/g) || []).length;
console.log(`Balance <w:p>: ${openP} abiertos, ${closeP} cerrados -> ${openP === closeP ? 'OK' : 'ERROR'}`);

zip.file('word/document.xml', xml);
const buffer = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync(templatePath, buffer);
console.log('Plantilla actualizada en: ' + templatePath);
