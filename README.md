# Prototipo-LLM

Este projeto é um protótipo simples de aplicação web que usa IA para gerar progressões de acordes a partir de uma cifra ou tom informado. A ideia é receber uma entrada como "C", "Am" ou "G" e retornar uma sequência de 4 acordes do mesmo campo harmônico, exibida visualmente na interface.

## O que a aplicação faz

- recebe uma cifra ou tom digitado pelo usuário;
- envia essa informação para a API do OpenRouter;
- solicita ao modelo uma progressão de 4 acordes em formato simples;
- exibe o resultado na tela com o plugin jTab, que transforma a resposta em uma visualização mais amigável.

## Tecnologias utilizadas

- Node.js
- Express
- CORS
- dotenv
- OpenRouter API
- jTab para renderização visual das cifras

## Estrutura do projeto

- server.js: servidor Express responsável por receber as requisições e conversar com a API do OpenRouter.
- public/index.html: interface principal da aplicação.
- public/css/style.css: estilos da página.
- public/assets/: arquivos estáticos usados na interface.

## Requisitos

- Node.js instalado
- npm instalado
- uma chave da API do OpenRouter

## Como executar

1. Crie um arquivo chamado .env na raiz do projeto.
2. Adicione sua chave da API:

```env
OPENROUTER_API_KEY=sua_chave_aqui
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

## Variáveis de ambiente

- OPENROUTER_API_KEY: obrigatória para autenticar as requisições à API do OpenRouter.
- OPENROUTER_MODEL: opcional. Se não for definida, o projeto usa o modelo padrão openai/gpt-oss-120b:free.

## Como usar

1. Abra a aplicação no navegador.
2. Digite uma cifra ou tom, por exemplo: Dm, Am, G ou F#m.
3. Clique em Enviar.
4. O sistema retornará uma progressão de 4 acordes e a exibirá visualmente.

## Endpoints da API

- GET /api/status: retorna o status do servidor e o modelo configurado.
- POST /api/llm: recebe o texto enviado pelo usuário e devolve a resposta gerada pela IA.

## Exemplos de entrada

- F#m -> pode gerar algo como F#m D A E
- G -> pode gerar algo como G Em C D
- Am -> pode gerar algo como Am F C E

## Observações

### Visualização de acordes

Alguns acordes possuem a representação da pestana como na imagem abaixo (retirada da web):<br>
![Acorde de fá sustenido](/public/assets/example.png)

Nesse protótipo, ao utilizar o plugin do jTab, os acordes com pestanas podem ser representados com o número 1 em mais de uma corda na mesma casa, como nas imagens abaixo:<br>
![Acorde de fá sustenido](/public/assets/example1.png)
![Acorde de lá sustenido menor](/public/assets/example2.png)

Vale ressaltar que um mesmo acorde pode ter mais de uma forma de representação, dependendo da fonte consultada. Com o uso do plugin jTab, a visualização é padronizada para um único formato, facilitando a leitura. Para mais informações, consulte o site [https://jtab.tardate.com/](https://jtab.tardate.com/).

### Pontos importantes

- O resultado depende da qualidade da resposta do modelo e do prompt enviado.
- Para entradas inválidas ou vazias, o sistema pode usar um fallback simples com a sequência C G Am F.