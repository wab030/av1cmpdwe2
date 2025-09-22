// scripts/ai_review.js

const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

async function analyzeFile(client, filePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  const prompt = `
Você é um revisor de código que analisa boas práticas, legibilidade, segurança e estrutura do código JavaScript.
Analise o código abaixo e forneça comentários:
- pontos fortes
- pontos que podem melhorar (nomes de funções, modularização, tratamento de erros, otimização, estilo)
- sugestões práticas de mudança

Código:
\`\`\`js
${code}
\`\`\`
  `.trim();

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",  // ou outro modelo disponível
    contents: prompt
  });

  return `## Arquivo: ${filePath}\n\n${response.text}\n\n`;
}

async function main() {
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const jsFiles = [];

  function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (full.endsWith(".js")) {
        jsFiles.push(full);
      }
    }
  }

  walk("src");  // ou outras pastas que você quer revisar

  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports");
  }

  let report = "# Relatório de Revisão AI – Gemini\n\n";
  for (const filePath of jsFiles) {
    try {
      const feedback = await analyzeFile(client, filePath);
      report += feedback;
    } catch (err) {
      report += `## Arquivo: ${filePath}\n\n**Erro ao analisar**: ${err.message}\n\n`;
    }
  }

  fs.writeFileSync("reports/ai-code-review.md", report, "utf-8");
}

main().catch(err => {
  console.error("Falha no ai_review:", err);
  process.exit(1);
});
