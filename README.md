# Prototipo-LLM

Protótipo de geração de progressões de acordes usando a API do OpenRouter com o modelo **openai/gpt-oss-120b:free**. O sistema converte uma cifra ou tom informado em uma sequência de 4 acordes dentro do mesmo campo harmônico.

## Objetivo

Este protótipo demonstra como um modelo LLM pode criar progressões harmônicas simples e diatônicas para iniciantes. A ideia é gerar acordes pertencentes à mesma tonalidade da cifra inicial e retornar apenas uma linha com 4 acordes.

## Como executar

1. Crie um arquivo `.env` na raiz do projeto.
2. Adicione sua chave de API do OpenRouter em `.env`:

```env
OPENROUTER_API_KEY=seu_token_aqui
```

3. Instale as dependências:

```bash
npm install
```

4. Inicie o servidor:

```bash
npm start
```

5. Acesse no navegador:

```text
http://localhost:3000
```

## Como o protótipo funciona

O servidor em `server.js` recebe um prompt contendo um acorde ou tom. Em seguida, ele envia esse prompt para a API do OpenRouter e pede ao modelo que:

- identifique o campo harmônico do tom informado;
- gere uma progressão simples de 4 acordes;
- retorne apenas os 4 acordes em uma linha, sem texto extra;
- siga o formato `Acorde1 Acorde2 Acorde3 Acorde4`.

Se o input for inválido, vazio ou contiver a palavra `undefined`, o modelo deve usar o fallback padrão:

```text
C G Am F
```

## Exemplos de acordes reais

### Exemplo correto

- Entrada: `C`
- Saída esperada: `C Am F G`
- Por que é correto: todos os acordes estão no campo harmônico de C maior.

### Exemplo incorreto

- Entrada: `C`
- Saída incorreta: `C D# G# A`
- Por que é incorreto: `D#` e `G#` não pertencem ao campo harmônico de C maior e quebram a tonalidade.

### Outro exemplo correto

- Entrada: `G`
- Saída esperada: `G Em C D`
- Por que é correto: esses acordes são do campo harmônico de G maior.

### Outro exemplo incorreto

- Entrada: `G`
- Saída incorreta: `G Bb Eb F`
- Por que é incorreto: `Bb` e `Eb` saem da tonalidade de G maior e formam uma progressão de outro campo harmônico.

## Quando o protótipo acerta

O protótipo geralmente acerta quando:

- identifica corretamente a tonalidade a partir da cifra;
- gera acordes diatônicos do mesmo campo harmônico;
- mantém as funções harmônicas básicas de tônica, subdominante e dominante;
- devolve somente os 4 acordes solicitados.

## Quando o protótipo erra

O protótipo pode errar quando:

- mistura acordes de outras tonalidades;
- adiciona acordes cromáticos ou não-diatônicos;
- retorna texto extra ou formatação inválida;
- ignora o formato exigido de 4 acordes em uma única linha.

## Limitações

- Depende da resposta do modelo LLM e do prompt enviado.
- É mais adequado para progressões simples em tonalidades maiores conhecidas.
- Não faz análise avançada de inversões, modulações ou harmonias complexas.

## Observações

- O arquivo `server.js` usa `express`, `cors` e `dotenv`.
- A variável `OPENROUTER_MODEL` é opcional e tem o padrão `openai/gpt-oss-120b:free`.
- O projeto serve conteúdo estático da pasta `public/`.

## Plugin jTab

A interface usa o plugin `jTab` para renderizar os acordes retornados pelo modelo como diagramas de cifras visuais. O arquivo `public/index.html` carrega os recursos do `jTab` e, após receber a resposta da API, processa a string de acordes e chama `jtab.render(...)` no elemento `<pre id="resposta">`.

Isso faz com que a saída apareça na tela como uma cifra formatada em vez de somente texto bruto, melhorando a visualização dos acordes para o usuário.
O `jTab` consegue ler a cifra porque ele interpreta a string de acordes — por exemplo, `C Am F G` — e mapeia cada símbolo de acorde para o respectivo diagrama de teclado/violão. Em seguida, ele gera a representação gráfica (SVG/HTML) dentro do elemento selecionado, transformando o texto em uma imagem ou gráfico de acordes.