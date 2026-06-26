import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 3000;
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-oss-120b:free";

if (!API_KEY) {
 console.error("Erro: configure OPENROUTER_API_KEY no arquivo .env.");
 process.exit(1);
}
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.get("/api/status", (req, res) => {
    res.json({ status: "API local funcionando", model: MODEL });
});
app.post("/api/llm", async (req, res) => {
    try {
        console.log(`usuário envio ${req.body.prompt}`)
        // const { cifra } = req.body.prompt;
        const prompt = req.body.prompt;
        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({ erro: "O campo prompt e obrigatorio." });
    }
    if (prompt.length > 2000) {
        return res.status(400).json({ erro: "Limite: 2000 caracteres." });
    }
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-OpenRouter-Title": "Prototipo Acordes"
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                    {
                        role: "system",
                        content: `Você é um gerador de dados estrito que converte uma cifra/tom informado APENAS em uma progressão de 4 acordes na sintaxe jtab (separados por espaço). Você não conversa, não explica e não usa Markdown.

                        <instructions>
                        1. O input do usuário será estritamente um acorde ou tom (ex: 'Am', 'C', 'F#').
                        2. Identifique o Campo Harmônico desse tom e gere uma progressão simples de 4 acordes para iniciantes.
                        3. REGRA DE FALLBACK: Se o input for vazio, contiver a palavra exata 'undefined' ou não for um acorde/tom válido, assuma o tom padrão de Dó Maior e retorne exatamente: C G Am F.
                        </instructions>

                        <CRITICAL_NEGATIVE_RULES>
                        - ZERO TEXTO EXTRA: Proibido incluir qualquer caractere, letra, saudação ou explicação que não faça parte dos 4 acordes.
                        - ZERO FORMATAÇÃO: Não use blocos de código (\`\`\`), não use colchetes [ ], barras |, hífens - ou tablaturas em texto.
                        - A saída deve ser estritamente uma única linha de texto com 4 acordes e 3 espaços no total.
                        </CRITICAL_NEGATIVE_RULES>

                        <required_output_format>
                        Acorde1 Acorde2 Acorde3 Acorde4
                        </required_output_format>

                        <examples>
                        User Input: Am
                        Output: Am F C G

                        User Input: D
                        Output: D Bm G A

                        User Input: F#m
                        Output: F#m D A E

                        User Input: undefined
                        Output: C G Am F
                        </examples>

                        Gere a saída para o input do usuário agora, seguindo estritamente as regras.`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
            temperature: 0.7,
            max_completion_tokens: 700
        })
    });
    if (!response.ok) {
        const detalhe = await response.text();
        return res.status(502).json({
            erro: "Erro ao consultar o OpenRouter.",
            status: response.status,
            detalhe
        });
    }
    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) {
        return res.status(502).json({ erro: "Resposta vazia ou inesperada." });
    }
    res.json({ modelo: MODEL, resposta: text, uso: data.usage ?? null });
    } catch (error) {
        res.status(500).json({ erro: "Erro interno no servidor.", detalhe: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});