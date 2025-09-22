import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function avaliarCodigo(caminhoArquivo) {
  const codigo = fs.readFileSync(caminhoArquivo, "utf-8");

  const prompt = `
  Você é um professor de Node.js. Avalie este código:
  - Legibilidade
  - Boas práticas
  - Organização do código
  - Pontos de melhoria

  Código:
  ${codigo}
  `;

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500
  });

  const feedback = response.choices[0].message.content;

  // Salva em arquivo de feedback
  const caminhoFeedback = caminhoArquivo.replace(".js", ".feedback.txt");
  fs.writeFileSync(caminhoFeedback, feedback);

  console.log(`Feedback gerado: ${caminhoFeedback}`);
}
