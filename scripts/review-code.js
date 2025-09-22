const fs = require('fs');
const path = require('path');
const OpenAI = require('openai'); // ou outra biblioteca

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function reviewCode() {
  const codePath = path.join(__dirname, '../aluno/src'); // ou a pasta do código do aluno
  const files = fs.readdirSync(codePath).map(file => fs.readFileSync(path.join(codePath, file), 'utf-8'));
  const fullCode = files.join('\n\n---\n\n');

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em Node.js. Analise o código fornecido e forneça um feedback sobre as boas práticas, organização, segurança (uso de variáveis de ambiente), e uso de middlewares."
        },
        {
          role: "user",
          content: fullCode
        }
      ]
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Erro na análise da IA:", error);
    console.log("Não foi possível realizar a análise de boas práticas.");
  }
}

reviewCode();