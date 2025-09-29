// scripts/ai_review.js

require('dotenv').config(); 

const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

// Função para analisar um único arquivo e obter feedback estruturado
async function analyzeFile(client, filePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  
  // Prompt customizado para forçar a geração de uma tabela de resumo
  const prompt = `
Você é um revisor de código que analisa boas práticas, legibilidade, segurança e estrutura do código JavaScript.
Analise o código abaixo e forneça comentários:

1.  **Pontos Fortes** e **Sugestões de Melhoria** (em texto corrido e bem detalhado).
2.  **AO FINAL DE SUA REVISÃO DETALHADA,** crie uma **tabela de resumo** no formato Markdown com duas colunas: **"Problema Principal"** e **"Local/Linha Sugerida"**. 
    * Se não houver problemas graves, a tabela deve ter uma única linha dizendo "Nenhum problema grave encontrado" na coluna "Problema Principal".

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
    // Se a chave não estiver no process.env, o erro será capturado pelo try/catch
    // na função analyzeFile, mas colocamos um fallback.
    throw new Error("GEMINI_API_KEY não encontrada. Abortando análise.");
  }
  
  const client = new GoogleGenAI({ apiKey });
  const jsFiles = [];
  const resumoProblemas = []; // Array para coletar os resumos de cada arquivo

  // Função auxiliar para percorrer os diretórios
  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        // Ignorar pastas comuns de build ou dependências
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
      
      // 1. Adiciona o feedback completo ao relatório
      report += `## Arquivo: ${filePath}\n\n${full_feedback}\n\n`;

      // 2. Extração da tabela de resumo para o índice geral
      const tableNameHeader = "Problema Principal";
      const tableStartMarker = `| ${tableNameHeader}`;
      const tableStart = full_feedback.indexOf(tableStartMarker);
      
      if (tableStart !== -1) {
          // Extrai o conteúdo da tabela, garantindo que pegue o cabeçalho, separador e linhas
          const tableContent = full_feedback.substring(tableStart);
          
          // Usa RegEx para encontrar a tabela completa (cabeçalho + separador + conteúdo)
          // e parar antes do próximo bloco de texto (duas quebras de linha).
          const tableRegex = /(\|.*?\n)+\|.*?/s; 
          const match = tableContent.match(tableRegex);

          if (match && match[0]) {
              // Adiciona a tabela ao nosso resumo, prefixando com o nome do arquivo
              resumoProblemas.push(`### Resumo do Arquivo: \`${filePath}\`\n${match[0].trim()}\n`);
          }
      }

    } catch (err) {
      // Captura o erro da API (403, 500, etc.) e o registra no relatório
      report += `## Arquivo: ${filePath}\n\n**Erro ao analisar**: ${err.message}\n\n`;
    }
  }

  // 3. Adicionar o resumo final ao relatório
  report += "\n---\n\n";

  let tabelaGeral = "## 📊 Resumo de Problemas por Arquivo\n\n";
  if (resumoProblemas.length > 0) {
      tabelaGeral += "Este é o resumo de problemas extraídos automaticamente do feedback detalhado de cada arquivo. Use-o para priorizar correções:\n\n";
      tabelaGeral += resumoProblemas.join('\n'); // Concatena todos os resumos individuais
  } else {
      tabelaGeral += "Nenhum arquivo JavaScript encontrado para análise ou não foi possível extrair os resumos das tabelas.\n\n";
  }
  
  // Adiciona o resumo geral ao final do relatório
  report += tabelaGeral;

  fs.writeFileSync("reports/ai-code-review.md", report, "utf-8");
}

main().catch(err => {
  // Em caso de falha fatal (ex: problemas de I/O), registra o erro no console do GA
  console.error("Falha fatal na execução do ai_review:", err.message || err);
  process.exit(1);
});