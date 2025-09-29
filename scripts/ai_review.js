// scripts/ai_review.js

require('dotenv').config(); 

const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

// Função para analisar um único arquivo e obter feedback estruturado
async function analyzeFile(client, filePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  
  // Prompt customizado, exigindo a nota em formato padronizado
  const prompt = `
Você é um revisor de código que analisa boas práticas, legibilidade, segurança e estrutura do código JavaScript.
Analise o código abaixo e forneça comentários:

1.  **Pontos Fortes** e **Sugestões de Melhoria** (em texto corrido e bem detalhado).
2.  **AO FINAL DE SUA REVISÃO DETALHADA,** crie uma **tabela de resumo** no formato Markdown com duas colunas: **"Problema Principal"** e **"Local/Linha Sugerida"**. 
    * Se não houver problemas graves, a tabela deve ter uma única linha dizendo "Nenhum problema grave encontrado" na coluna "Problema Principal".
3.  **No final da sua análise detalhada, e antes da tabela de resumo, forneça a NOTA do arquivo no formato "NOTA_FINAL: X.Y" onde X.Y é a pontuação de 0.0 a 10.0. Certifique-se de que a nota esteja em uma linha separada.**

Código:
\`\`\`js
${code}
\`\`\`
  `.trim();

  // Verifica a chave antes de chamar a API (segurança extra)
  if (!process.env.GEMINI_API_KEY) {
      throw new Error("403 PERMISSION_DENIED: API Key não está definida. A chave deve ser injetada pelo GitHub Secrets.");
  }
  
  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  return { 
      full_feedback: response.text, 
      filePath: filePath 
  };
}

// Função principal para orquestrar a revisão
async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY não encontrada. Abortando análise.");
  }
  
  const client = new GoogleGenAI({ apiKey });
  const jsFiles = [];
  const resumoProblemas = []; 
  const notas = []; // Array para coletar as notas de cada arquivo

  // Função auxiliar para percorrer os diretórios
  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        if (f === 'node_modules' || f === 'tests' || f === 'reports') {
            continue;
        }
        walk(full);
      } else if (full.endsWith(".js")) {
        jsFiles.push(full);
      }
    }
  }

  walk("src"); // Inicia a revisão na pasta 'src'

  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports");
  }

  let report = "# Relatório de Revisão AI – Gemini\n\n";
  
  for (const filePath of jsFiles) {
    try {
      const { full_feedback } = await analyzeFile(client, filePath);
      
      // 1. Extração da Nota do Arquivo
      const notaRegex = /NOTA_FINAL:\s*(\d+(\.\d{1,2})?)/;
      const matchNota = full_feedback.match(notaRegex);
      let notaArquivo = 'N/A';

      if (matchNota && matchNota[1]) {
          const nota = parseFloat(matchNota[1]);
          if (!isNaN(nota)) {
              notas.push(nota);
              notaArquivo = nota.toFixed(1);
          }
      }

      // 2. Adiciona o feedback completo ao relatório, incluindo a nota individual
      report += `## Arquivo: ${filePath} (Nota: ${notaArquivo}/10)\n\n${full_feedback}\n\n`;

      // 3. Extração da tabela de resumo para o índice geral
      const tableNameHeader = "Problema Principal";
      const tableStartMarker = `| ${tableNameHeader}`;
      const tableStart = full_feedback.indexOf(tableStartMarker);
      
      if (tableStart !== -1) {
          const tableContent = full_feedback.substring(tableStart);
          const tableRegex = /(\|.*?\n)+\|.*?/s; 
          const match = tableContent.match(tableRegex);

          if (match && match[0]) {
              resumoProblemas.push(`### Resumo do Arquivo: \`${filePath}\`\n${match[0].trim()}\n`);
          }
      }

    } catch (err) {
      // Captura o erro da API (403, 500, etc.) e o registra no relatório
      report += `## Arquivo: ${filePath} (Nota: N/A)\n\n**Erro ao analisar**: ${err.message}\n\n`;
    }
  }

  // 4. CÁLCULO E INSERÇÃO DA NOTA FINAL GERAL
  let notaGeral = "N/A";
  if (notas.length > 0) {
      const soma = notas.reduce((acc, curr) => acc + curr, 0);
      const media = soma / notas.length;
      notaGeral = media.toFixed(2); // Duas casas decimais
  }
  
  // Injeta a Nota Final Geral no topo do relatório
  const notaHeader = `## 🌟 NOTA FINAL GERAL DA REVISÃO DE CÓDIGO: ${notaGeral}/10\n\n`;
  report = notaHeader + report;

  // 5. Adicionar o resumo de problemas final ao relatório
  report += "\n---\n\n";

  let tabelaGeral = "## 📊 Resumo de Problemas por Arquivo\n\n";
  if (resumoProblemas.length > 0) {
      tabelaGeral += "Este é o resumo de problemas extraídos automaticamente do feedback detalhado de cada arquivo. Use-o para priorizar correções:\n\n";
      tabelaGeral += resumoProblemas.join('\n'); 
  } else {
      tabelaGeral += "Nenhum arquivo JavaScript encontrado para análise ou não foi possível extrair os resumos das tabelas.\n\n";
  }
  
  report += tabelaGeral;

  // 6. Geração do arquivo final
  fs.writeFileSync("reports/ai-code-review.md", report, "utf-8");
}

main().catch(err => {
  // Em caso de falha fatal (problemas de I/O, erro na chave, etc.), registra o erro e força o exit code 1
  console.error("Falha fatal na execução do ai_review:", err.message || err);
  process.exit(1);
});