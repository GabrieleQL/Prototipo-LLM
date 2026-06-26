# Prototipo-LLM
Esse protótipo tem por finalidade gerar uma progressão simples de acordes utilizando a API do OpenRouter com o modelo **openai/gpt-oss-120b:free**. A progressão de acordes gerados são pertencentes ao mesmo campo harmônico da cifra informada.

## Como executá-lo?
### 1° - Criação do arquivo .env
Você deve criar o arquivo **.env** na raíz da pasta **Prototipo-LLM**, e adicionar uma chave Api do OpenRouter para o modelo **openai/gpt-oss-120b:free**.

### 2° - Instalação das extensões
Rode o comando `npm install` no **bash** ou **cmd** da pasta onde está o protótipo para baixar as extensões.

### 3° - Execução
Rode o comando `npm start` na mesma janela de prompt do comando anterior e acesse **localhost:3000** no navegador da sua máquina.