const { GoogleGenerativeAI } = require('@google/generative-ai');

async function runEvaluation() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('API key not found. Please set GEMINI_API_KEY in GitHub secrets.');
    process.exit(1);
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  try {
    // Exemplo: Avaliar o código que foi alterado
    const codeToEvaluate = '/* Seu código aqui. Você pode ler de um arquivo ou de um contexto fornecido pelo GitHub Actions */'; 
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