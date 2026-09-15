const fs = require('fs');
const PizZip = require('pizzip');

const zip = new PizZip(fs.readFileSync('back_end/templates/HojaVida_Test_TPROPCL-103.docx', 'binary'));
const xml = zip.file('word/document.xml').asText();

const tables = xml.split('</w:tbl>');
tables.slice(0, -1).forEach((tbl, tIdx) => {
  console.log(`\n=== GENERATED TABLE ${tIdx + 1} ===`);
  const rows = tbl.split('</w:tr>');
  rows.slice(0, -1).forEach((row, rIdx) => {
    const cells = row.split('</w:tc>');
    const cellTexts = cells.slice(0, -1).map(c => {
      const match = c.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
      if (!match) return '[EMPTY]';
      return match.map(m => m.replace(/<[^>]+>/g, '')).join('');
    });
    console.log(`Row ${rIdx + 1}: ${JSON.stringify(cellTexts)}`);
  });
});
