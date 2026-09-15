const fs = require('fs');
const PizZip = require('pizzip');

const content = fs.readFileSync('./templates/hoja_de_vida_template.docx', 'binary');
const zip = new PizZip(content);
const xml = zip.file('word/styles.xml').asText();

const styleEncabezado = xml.match(/<w:style[^>]*w:styleId="Encabezado"[\s\S]*?<\/w:style>/);
if (styleEncabezado) {
  console.log('--- Style Encabezado ---');
  console.log(styleEncabezado[0]);
}

const defaultRPr = xml.match(/<w:rPrDefault>[\s\S]*?<\/w:rPrDefault>/);
if (defaultRPr) {
  console.log('--- Default rPr ---');
  console.log(defaultRPr[0]);
}
