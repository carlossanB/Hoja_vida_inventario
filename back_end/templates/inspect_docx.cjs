const fs = require('fs');
const PizZip = require('pizzip');

const content = fs.readFileSync('back_end/templates/hoja_de_vida_original.docx', 'binary');
const zip = new PizZip(content);
const docXml = zip.file('word/document.xml').asText();

fs.writeFileSync('back_end/templates/document_raw.xml', docXml);

const regex = /<w:t[^>]*>(.*?)<\/w:t>/g;
let match;
let texts = [];
while ((match = regex.exec(docXml)) !== null) {
  texts.push(match[1]);
}
console.log('--- ALL TEXT PIECES ---');
console.log(texts.join(' --- '));
