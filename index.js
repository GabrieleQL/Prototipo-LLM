import "dotenv/config";

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "openai/gpt-oss-120b:free";
if (!API_KEY) {
 console.error("Erro: crie o arquivo .env com OPENROUTER_API_KEY.");
 process.exit(1);
}
async function chamarLLM() {
 const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
 method: "POST",
 headers: {
 "Authorization": `Bearer ${API_KEY}`,
 "Content-Type": "application/json",
 "HTTP-Referer": "http://localhost:3000",
 "X-OpenRouter-Title": "Prototipo Adordes"
 },
 body: JSON.stringify({
 model: MODEL,
 messages: [
 {
 role: "system",
 content: "Você é um tutor didatico para alunos iniciantes em violão. Responda representando os acordes em diagramas simples, com clareza e sem inventar informações. Se não souber a resposta, diga que não sabe."},
 {
 role: "user",
 content: "Explique o que é um acorde para um aluno iniciante em violão."
 }
 ],
 temperature: 0.7,
 max_completion_tokens: 500
 })
 });
 if (!response.ok) {
 const detalhe = await response.text();
 throw new Error(`Erro na API: ${response.status} - ${detalhe}`);
 }
 const data = await response.json();
 const text = data.choices?.[0]?.message?.content;
 if (!text) {
 throw new Error("A API respondeu, mas nao retornou texto.");
 }
 console.log("\nResposta da IA:\n");
 console.log(text);
}
chamarLLM().catch((error) => {
 console.error("Falha ao chamar o OpenRouter:");
 console.error(error.message);
});