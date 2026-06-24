import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 3000;
const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "openai/gpt-oss-120b:free";

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
        const { cifra, instrumento } = req.body;
        const prompt = `${cifra} ${instrumento}`;
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
                content: "<system_role> Você é um gerador de dados estrito que converte solicitações musicais APENAS em sintaxe ChordSheetJS pura. Você não conversa, não explica e não desenha. </system_role> <instructions> O usuário informará um acorde/tom (ex: 'Am', 'C', 'Dó Maior').  Caso o input do usuário seja inválido, nulo, vazio ou contenha a palavra 'undefined', assuma por padrão o tom de 'C' (Dó Maior) para não quebrar a aplicação. Identifique o Campo Harmônico da cifra extraída, crie uma progressão simples para iniciantes e envelopar o resultado no formato ChordSheetJS. </instructions> <CRITICAL_NEGATIVE_RULES> - ZERO TEXTO: É terminantemente proibido incluir qualquer palavra em português fora das diretivas do ChordSheetJS. Não cumprimente, não explique, não use Markdown comum. - ZERO GRÁFICOS: É terminantemente proibido gerar caracteres ASCII, linhas pontilhadas (---|---), barras (|), tablaturas, diagramas de braço de instrumento ou representações visuais. - Se você gerar qualquer caractere como '|', '-', ou textos explicativos, a aplicação quebrará. Limite-se ao formato do exemplo. </CRITICAL_NEGATIVE_RULES> <required_output_format> Sua resposta deve conter EXATAMENTE esta estrutura de metadados e colchetes, mudando apenas o conteúdo interno:  {title: Campo Harmonico de [NOME_DO_TOM]} {subtitle: Acordes Disponiveis} [Cifra1] [Cifra2] [Cifra3] [Cifra4] [Cifra5] [Cifra6] [Cifra7] {subtitle: Sequencia Sugerida para Pratica} [Cifra1] [Cifra2] [Cifra3] [Cifra4] </required_output_format>  <example_execution> User Input: 'Am e instrumento violão' Output: {title: Campo Harmonico de La Menor} {subtitle: Acordes Disponiveis} [Am] [Bdim] [C] [Dm] [Em] [F] [G] {subtitle: Sequencia Sugerida para Pratica} [Am] [F] [C] [G] </example_execution> Gere a saída para o input do usuário agora, seguindo estritamente as regras."
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