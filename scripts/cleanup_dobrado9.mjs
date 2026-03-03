// Script de limpeza - Dobrado Nº 9 (IDs 67, 68, 69)
// Deleta arquivos do R2 via wrangler CLI

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const arquivos = [
    // Partitura id 68 (provavelmente existem no R2)
    "1770948230544_68_Baixo_Bb.pdf",
    "1770948230544_68_Baixo_Eb.pdf",
    "1770948230544_68_Bar_tono_Bb.pdf",
    "1770948230544_68_Bombardino.pdf",
    "1770948230544_68_Bombo.pdf",
    "1770948230544_68_Caixa.pdf",
    "1770948230544_68_Clarinete_Bb_1.pdf",
    "1770948230544_68_Clarinete_Bb_2.pdf",
    "1770948230544_68_Flauta.pdf",
    "1770948230544_68_Flautim.pdf",
    "1770948230544_68_Grade.pdf",
    "1770948230544_68_Pratos.pdf",
    "1770948230544_68_Requinta.pdf",
    "1770948230544_68_Sax._Alto_1.pdf",
    "1770948230544_68_Sax._Alto_2.pdf",
    "1770948230544_68_Sax._Bar_tono.pdf",
    "1770948230544_68_Sax._Soprano.pdf",
    "1770948230544_68_Sax._Tenor_1.pdf",
    "1770948230544_68_Sax._Tenor_2.pdf",
    "1770948230544_68_Trombone_1.pdf",
    "1770948230544_68_Trombone_2.pdf",
    "1770948230544_68_Trompa_Eb_1.pdf",
    "1770948230544_68_Trompa_Eb_2.pdf",
    "1770948230544_68_Trompa_F.pdf",
    "1770948230544_68_Trompete_Bb_1.pdf",
    "1770948230544_68_Trompete_Bb_2.pdf",
    // Partitura id 69 (não existem no R2, mas tentamos mesmo assim)
    "1770949507947_69_Baixo_Bb.pdf",
    "1770949507947_69_Baixo_Eb.pdf",
    "1770949507947_69_Bar_tono_Bb.pdf",
    "1770949507947_69_Bombardino.pdf",
    "1770949507947_69_Bombo.pdf",
    "1770949507947_69_Caixa.pdf",
    "1770949507947_69_Clarinete_Bb_1.pdf",
    "1770949507947_69_Clarinete_Bb_2.pdf",
    "1770949507947_69_Flauta.pdf",
    "1770949507947_69_Flautim.pdf",
    "1770949507947_69_Grade.pdf",
    "1770949507947_69_Pratos.pdf",
    "1770949507947_69_Requinta.pdf",
    "1770949507947_69_Sax._Alto_1.pdf",
    "1770949507947_69_Sax._Alto_2.pdf",
    "1770949507947_69_Sax._Bar_tono.pdf",
    "1770949507947_69_Sax._Soprano.pdf",
    "1770949507947_69_Sax._Tenor_1.pdf",
    "1770949507947_69_Sax._Tenor_2.pdf",
    "1770949507947_69_Trombone_1.pdf",
    "1770949507947_69_Trombone_2.pdf",
    "1770949507947_69_Trompa_Eb_1.pdf",
    "1770949507947_69_Trompa_Eb_2.pdf",
    "1770949507947_69_Trompa_F.pdf",
    "1770949507947_69_Trompete_Bb_1.pdf",
    "1770949507947_69_Trompete_Bb_2.pdf",
];

let removidos = 0;
let ignorados = 0;

for (const arquivo of arquivos) {
    try {
        execSync(`npx wrangler r2 object delete "acervo-pdfs/${arquivo}"`, {
            stdio: 'pipe',
            cwd: fileURLToPath(new URL('..', import.meta.url))
        });
        console.log(`✅ Deletado: ${arquivo}`);
        removidos++;
    } catch (e) {
        console.log(`⚠️  Ignorado (não encontrado): ${arquivo}`);
        ignorados++;
    }
}

console.log(`\nConcluído: ${removidos} deletados, ${ignorados} ignorados.`);
