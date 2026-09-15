const fs = require('fs');
const PizZip = require('pizzip');

const content = fs.readFileSync('./templates/hoja_de_vida_template.docx', 'binary');
const zip = new PizZip(content);

['word/document.xml', 'word/header3.xml', 'word/header1.xml', 'word/header2.xml'].forEach(file => {
  if (!zip.file(file)) return;
  const xml = zip.file(file).asText();
  console.log('\n==============================');
  console.log('--- ' + file + ' ---');
  console.log('==============================');
  
  // Buscar w:drawing
  const drawings = xml.match(/<w:drawing[\s\S]*?<\/w:drawing>/g) || [];
  console.log('w:drawing encontrados:', drawings.length);
  drawings.forEach((d, i) => {
    const behindDoc = d.includes('behindDoc="1"');
    const wrap = d.match(/<wp:wrap[A-Za-z]+/g) || [];
    const docPr = d.match(/<wp:docPr[^>]*>/g) || [];
    console.log(`  Drawing #${i+1}: behindDoc=${behindDoc}, wrap=${wrap.join(',')}, docPr=${docPr.join(' | ')}`);
  });

  // Buscar w:pict (VML shapes)
  const picts = xml.match(/<w:pict[\s\S]*?<\/w:pict>/g) || [];
  console.log('\nw:pict / v:shape encontrados:', picts.length);
  picts.forEach((p, i) => {
    const behind = p.includes('behind="1"') || p.includes('behindDoc="1"');
    const styleMatch = p.match(/style="([^"]*)"/);
    const fillMatch = p.match(/fillcolor="([^"]*)"/);
    const typeMatch = p.match(/<v:shape[^>]*type="([^"]*)"/);
    console.log(`  Pict #${i+1}: behind=${behind}, fill=${fillMatch ? fillMatch[1] : 'none'}, style=${styleMatch ? styleMatch[1] : 'none'}`);
  });

  // Buscar texto con sus colores específicos en este archivo
  const textsWithColor = [];
  const pList = xml.split('</w:p>');
  pList.forEach((p, pIdx) => {
    const colors = p.match(/<w:color[^>]*w:val="([^"]*)"/g) || [];
    const texts = (p.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || []).map(t => t.replace(/<[^>]+>/g, ''));
    if (texts.join('').trim().length > 0) {
      textsWithColor.push({ pIdx, text: texts.join(''), colors });
    }
  });
  console.log(`\nTextos visibles en ${file}: (${textsWithColor.length})`);
  textsWithColor.slice(0, 10).forEach(t => {
    console.log(`  P#${t.pIdx}: [${t.colors.join(',') || 'auto'}] -> "${t.text.substring(0, 70)}"`);
  });
});
