import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import { configDotenv } from 'dotenv';

// You might need to import dotenv if you are using a .env file locally
// require('dotenv').config();
configDotenv();

async function runEvaluation() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('API key not found. Please set GEMINI_API_KEY.');
    process.exit(1);
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const evaluationPath = path.join(process.cwd(), 'avaliacao');
    const files = await fs.readdir(evaluationPath);
    let codeToEvaluate = '';

    for (const file of files) {
      const filePath = path.join(evaluationPath, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      codeToEvaluate += `--- Conteúdo do arquivo: ${file} ---\n`;
      codeToEvaluate += '```\n' + fileContent + '\n```\n\n';
    }

    const prompt = `Avalie a qualidade do seguinte conjunto de arquivos de código, focando em boas práticas, consistência, segurança, legibilidade e possíveis melhorias. O código está organizado da seguinte forma:\n\n${codeToEvaluate}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Escreve o relatório no arquivo de resumo do job para ser exibido no GitHub.
    const summaryFilePath = process.env.GITHUB_STEP_SUMMARY;
    if (summaryFilePath) {
      await fs.appendFile(summaryFilePath, `### 🤖 Análise de Código (Gemini)\n\n`);
      await fs.appendFile(summaryFilePath, text);
      await fs.appendFile(summaryFilePath, `\n\n---`);
    }

    console.log('--- Avaliação do Gemini gerada com sucesso ---');

  } catch (error) {
    console.error('Erro durante a chamada da API ou leitura dos arquivos:', error);
    process.exit(1);
  }
}

runEvaluation();