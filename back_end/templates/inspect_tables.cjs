const fs = require('fs');

const xml = fs.readFileSync('back_end/templates/document_raw.xml', 'utf8');

// Let's parse tables and paragraphs
const tables = xml.split('</w:tbl>');
console.log(`Found ${tables.length - 1} tables.`);

tables.slice(0, -1).forEach((tbl, tIdx) => {
  console.log(`\n=== TABLE ${tIdx + 1} ===`);
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
