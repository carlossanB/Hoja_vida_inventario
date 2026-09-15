const fs = require('fs');
const PizZip = require('pizzip');

const zip = new PizZip(fs.readFileSync('back_end/templates/hoja_de_vida_original.docx', 'binary'));

console.log('--- FILES IN ZIP ---');
Object.keys(zip.files).forEach(f => {
  if (f.endsWith('.xml')) {
    const txt = zip.files[f].asText();
    const matches = txt.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    if (matches) {
      console.log(`\nFILE: ${f}`);
      console.log(matches.map(m => m.replace(/<[^>]+>/g, '')).join(' | '));
    }
  }
});
