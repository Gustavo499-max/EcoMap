# ♻️ EcoMap

 > Sistema web colaborativo para localização de pontos de reciclagem.

 O **EcoMap** é um projeto desenvolvido para a disciplina **Open Source Contribution & Collaboration**, com foco em sustentabilidade e na aplicação de práticas de desenvolvimento colaborativo utilizando Git e GitHub.

 ## 🌱 Sobre o projeto

 Encontrar locais adequados para descarte de materiais recicláveis nem sempre é uma tarefa simples. O **EcoMap** tem como objetivo facilitar a localização de pontos de reciclagem, permitindo que usuários consultem locais disponíveis e, futuramente, contribuam com novos pontos.

 O sistema foi pensado para ser simples, acessível e colaborativo, incentivando o descarte correto de resíduos e contribuindo para práticas mais sustentáveis.

 ## 🎯 Objetivos

 - Facilitar a localização de pontos de reciclagem.
- Permitir a consulta de pontos por cidade e tipo de material.
- Permitir o cadastro de novos pontos de reciclagem.
- Disponibilizar informações sobre os materiais aceitos em cada local.
- Apresentar os pontos de reciclagem em um mapa.
- Desenvolver o projeto utilizando práticas de colaboração com Git e GitHub.
- Permitir que novos colaboradores possam compreender e contribuir com o projeto.

 ## ✨ Funcionalidades

 ### ✅ Atualmente implementado

 - Estrutura inicial da aplicação Node.js.
- Servidor HTTP utilizando Express.
- Banco de dados SQLite.
- Estrutura de pontos de reciclagem.
- API REST para pontos de reciclagem.
- Validação dos dados recebidos pela API.
- Tratamento de erros.
- Configuração de variáveis de ambiente.
- Endpoint de verificação de saúde da aplicação.
- Listagem de pontos de reciclagem na página inicial (nome, endereço, materiais aceitos e horário de funcionamento).
- Filtros por cidade e por material, com indicação de carregamento, lista vazia e erro na consulta.
- Busca por nome do ponto ou por material aceito, sem diferenciar maiúsculas de minúsculas nem acentos.
- Localização do usuário (opcional): mostra a distância até cada ponto e ordena do mais próximo ao mais distante.
- Filtro de material informa em quantos pontos cada material é aceito.

 ### 🚧 Em desenvolvimento

 - Interface web completa.
- Cadastro de pontos através da interface.
- Edição de pontos.
- Exclusão de pontos.
- Mapa interativo.
- Testes automatizados.
- Melhorias de acessibilidade e responsividade.

 ## 🛠️ Tecnologias

 O projeto utiliza:

 | Tecnologia | Descrição |
| --- | --- |
| **Node.js** | Ambiente de execução JavaScript. |
| **Express** | Framework para criação do servidor e da API. |
| **SQLite** | Banco de dados utilizado pela aplicação. |
| **better-sqlite3** | Integração entre Node.js e SQLite. |
| **Helmet** | Configuração de cabeçalhos de segurança HTTP. |
| **CORS** | Controle de acesso entre origens. |
| **Nodemon** | Reinicialização automática do servidor durante o desenvolvimento. |
| **Git** | Controle de versão. |
| **GitHub** | Hospedagem do código e colaboração. |

## 📋 Pré-requisitos

 Antes de executar o projeto, é necessário possuir:

 - Node.js instalado.
- npm instalado.
- Git instalado.

 Para verificar as versões instaladas:

```
node -v
npm -v
git --version
```

 ## 🚀 Instalação

 ### 1\. Clone o repositório

```
git clone https://github.com/GustavoTalgatti/EcoMap.git
```

 ### 2\. Entre na pasta do projeto

```
cd EcoMap
```

 ### 3\. Instale as dependências

```
npm install
```

 ## ⚙️ Configuração do ambiente

 O projeto utiliza variáveis de ambiente.

 Crie o arquivo `.env` a partir do exemplo:

 ### Windows

```
copy .env.example .env
```

 ### Linux/macOS

```
cp .env.example .env
```

 > **Importante:** o arquivo `.env` contém configurações utilizadas localmente e **não deve ser enviado ao GitHub**.

 O arquivo `.env.example` deve ser mantido versionado para demonstrar quais variáveis são necessárias para executar o projeto.

 ## ▶️ Executando o projeto

 Para iniciar o servidor em modo de desenvolvimento:

```
npm run dev
```

 Por padrão, a aplicação estará disponível em:

```
http://localhost:3000
```

 O banco de dados começa vazio. Para popular a listagem com materiais e pontos de exemplo, execute (uma vez, com o servidor parado ou em outro terminal):

```
npm run db:seed
```

 ## 🔎 Verificando a aplicação

 A aplicação possui um endpoint de saúde:

```
GET /health
```

 Acesse:

```
http://localhost:3000/health
```

 Deve ser retornada uma resposta indicando que a API está funcionando.

 ## 🔌 API

 A API utiliza o prefixo:

```
/api
```

 ### Listar pontos

```
GET /api/pontos
```

 ### Filtrar por cidade

```
GET /api/pontos?cidade=São Paulo
```

 ### Filtrar por material

O filtro usa o **slug** do material (ex.: `plastico`, `oleo-de-cozinha`). Os slugs disponíveis são retornados por `GET /api/materiais`.

```
GET /api/pontos?material=plastico
```

 ### Buscar por nome ou material

 Procura o texto no nome do ponto ou no nome de um material aceito, ignorando maiúsculas e acentos (`sao joao` encontra `São João`).

```
GET /api/pontos?busca=vidro
```

 ### Combinar filtros

```
GET /api/pontos?cidade=Campinas&material=vidro
GET /api/pontos?busca=recicla&cidade=Campinas
```

 ### Listar materiais

```
GET /api/materiais
```

 Cada material retorna `id`, `nome`, `slug` e `total_pontos` (quantidade de pontos que o aceitam).

 ### Buscar ponto por ID

```
GET /api/pontos/:id
```

 ### Criar ponto

```
POST /api/pontos
```

 ### Atualizar ponto

```
PUT /api/pontos/:id
```

 ### Excluir ponto

```
DELETE /api/pontos/:id
```

 ## 📍 Localização do usuário

 O botão **Usar minha localização** usa a API de geolocalização do navegador para calcular a distância em linha reta até os pontos que possuem latitude e longitude.

- A posição é usada apenas no navegador e **nunca é enviada ao servidor**.
- O navegador só permite geolocalização em `localhost` ou em páginas HTTPS.
- Pontos sem coordenadas continuam na lista, mas ficam no final e sem distância.

 ## 🗄️ Banco de dados

 O **EcoMap** utiliza **SQLite**.

 O banco possui estruturas relacionadas a:

 - Pontos de reciclagem.
- Materiais recicláveis.
- Relação entre pontos e materiais.

 A estrutura do banco está definida em:

```
src/database/schema.sql
```

 Os dados iniciais podem ser inseridos utilizando o seed disponível em:

```
src/database/seed/seed.js
```

 ## 📁 Estrutura do projeto

```
EcoMap/
│
├── public/                 # Arquivos públicos da aplicação
├── src/
│   ├── config/             # Configurações
│   ├── controllers/        # Controladores das requisições
│   ├── database/           # Banco de dados e schema
│   ├── middlewares/        # Middlewares da aplicação
│   ├── models/             # Acesso e manipulação dos dados
│   ├── routes/             # Rotas da API
│   ├── services/           # Regras de negócio
│   ├── utils/              # Funções utilitárias
│   ├── validators/         # Validação de dados
│   ├── app.js              # Configuração da aplicação Express
│   └── server.js           # Inicialização do servidor
│
├── tests/                  # Testes automatizados
├── views/                  # Páginas HTML
├── .env.example            # Exemplo de configuração
├── .gitignore              # Arquivos ignorados pelo Git
├── package.json            # Dependências e scripts
├── package-lock.json       # Versões exatas das dependências
├── CONTRIBUTING.md         # Guia de contribuição
└── README.md               # Documentação principal
```

 ## 🔀 Fluxo de desenvolvimento

 O projeto utiliza GitHub para controle de versão e colaboração.

 As alterações devem seguir o seguinte fluxo:

```
Issue
  ↓
Branch
  ↓
Desenvolvimento
  ↓
Commit
  ↓
Push
  ↓
Pull Request
  ↓
Code Review
  ↓
Merge
```

 > **Importante:** as alterações não devem ser realizadas diretamente na branch `main`.

 Para mais informações, consulte o arquivo `CONTRIBUTING.md`.

 ## 🤝 Colaboração

 O **EcoMap** foi desenvolvido como um projeto colaborativo.

 Cada funcionalidade deve ser associada a uma **Issue no GitHub**.

 Exemplo:

```
Issue #5
   ↓
feature/listagem-pontos
   ↓
implementação
   ↓
Pull Request
   ↓
revisão
   ↓
merge
```

 Isso permite acompanhar o desenvolvimento e manter um histórico das contribuições realizadas por cada integrante.

 ## 🧪 Testes

 Os testes automatizados estão localizados no diretório:

```
tests/
```

 Para executar os testes, utilize o script disponível no `package.json`:

```
npm test
```

 Caso o projeto ainda não possua testes implementados, esta funcionalidade será desenvolvida em uma Issue futura.

 ## 📌 Status do projeto

 > 🚧 **Em desenvolvimento**

 O **EcoMap** está sendo desenvolvido de forma incremental através de Issues, branches e Pull Requests.

 ## 🌎 Impacto esperado

 O projeto busca incentivar o descarte correto de resíduos e facilitar o acesso a informações sobre locais de reciclagem.

 Além do objetivo técnico, o **EcoMap** está alinhado ao tema de sustentabilidade, promovendo práticas que podem contribuir para a redução do descarte inadequado de materiais recicláveis.

 ## 👥 Equipe

 Projeto desenvolvido pelos integrantes do grupo para a disciplina:

 **Open Source Contribution & Collaboration**

 - **Universidade/Instituição:** UniFecaf
- **Professor:** Robson Cardoso 

 ### Integrantes

- Cláudio José Rodrigues de Oliveira Junior
- Felipe Pardinho Belarmino
- Gabriela Camarço
- Igor Ferreira Alves
- Luis Gustavo dos Santos Talgatti
- Matheus Silva Dantas
- Rickelmy Augusto Souza Pacheco


 ## 📄 Licença

 Este projeto ainda não possui uma licença definida.

 A licença será definida conforme a decisão do grupo e os requisitos da disciplina.
