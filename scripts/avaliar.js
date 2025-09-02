import { GoogleGenerativeAI } from '@google/generative-ai';
import { configDotenv } from 'dotenv';

// You might need to import dotenv if you are using a .env file locally
// require('dotenv').config();

async function runEvaluation() {
  configDotenv();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('API key not found. Please set GEMINI_API_KEY in GitHub secrets or in a .env file.');
    process.exit(1);
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    // Directly use a known working model name
    // Try 'gemini-1.5-flash' as it's a good choice for fast text generation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Replace with the actual code you want to evaluate
    const codeToEvaluate = '/* Your code here */'; 
    const prompt = `Avalie a qualidade do seguinte código, buscando por boas práticas, legibilidade e possíveis melhorias:\n\n${codeToEvaluate}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('--- Avaliação do Gemini ---');
    console.log(text);
    console.log('---------------------------');

  } catch (error) {
    console.error('Error during Gemini API call:', error);
    process.exit(1);
  }
}

runEvaluation();