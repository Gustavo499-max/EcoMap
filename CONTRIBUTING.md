# 🤝 Contribuindo com o EcoMap

 Obrigado pelo interesse em contribuir com o **EcoMap**!

 Este documento apresenta o fluxo utilizado pelo projeto para organização das tarefas, desenvolvimento e colaboração através do **Git** e **GitHub**.

 ## 📌 Antes de começar

 Antes de desenvolver uma funcionalidade ou corrigir um problema:

 - Verifique as **Issues** existentes.
- Procure uma Issue relacionada à tarefa.
- Caso não exista, crie uma nova Issue antes de iniciar o desenvolvimento.
- Evite trabalhar diretamente na branch `main`.

 ## 🌿 Criando uma branch

 Cada Issue deve possuir uma branch própria.

 Primeiro, atualize sua branch principal:

```
git checkout main
git pull origin main
```

 Depois, crie uma branch relacionada à Issue:

```
git checkout -b feature/nome-da-funcionalidade
```

 Para correções de bugs:

```
git checkout -b fix/nome-do-problema
```

 Para documentação:

```
git checkout -b docs/nome-da-documentacao
```

 ### Convenção de branches

 | Prefixo | Uso |
| --- | --- |
| `feature/` | Nova funcionalidade |
| `fix/` | Correção de bug |
| `docs/` | Alterações na documentação |

## 💻 Desenvolvimento

 Faça as alterações necessárias na sua branch.

 Antes de realizar o commit, verifique as alterações:

```
git status
```

 Também é recomendado verificar o funcionamento da aplicação antes de enviar as alterações.

 ## 📝 Commits

 Utilizamos mensagens de commit claras e objetivas.

 ### Exemplos

```
git commit -m "feat: adiciona cadastro de pontos"

git commit -m "fix: corrige filtro por cidade"

git commit -m "docs: atualiza documentação"

git commit -m "test: adiciona testes da API"
```

 ### Tipos de commit

 | Tipo | Descrição |
| --- | --- |
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação |
| `test` | Testes |
| `refactor` | Refatoração de código |
| `style` | Alterações de estilo/formatação |
| `chore` | Tarefas de manutenção/configuração |

## 🚀 Enviando alterações

 Depois de finalizar o desenvolvimento, adicione as alterações:

```
git add .
```

 Crie o commit:

```
git commit -m "tipo: descrição da alteração"
```

 Envie a branch para o GitHub:

```
git push -u origin nome-da-branch
```

 ## 🔄 Pull Request

 Após enviar a branch para o GitHub:

 - Abra um **Pull Request**.
- Informe qual Issue está sendo resolvida.
- Explique as alterações realizadas.
- Adicione screenshots quando houver alterações visuais.
- Aguarde a revisão de outro integrante.

 Sempre que possível, utilize no Pull Request:

```
Closes #numero-da-issue
```

 Isso permite que o GitHub associe o Pull Request à Issue correspondente e feche a Issue automaticamente após o merge.

 ## 👀 Code Review

 Todo Pull Request deve ser revisado antes do merge.

 O revisor deve verificar:

 - O código atende ao objetivo da Issue.
- A aplicação continua funcionando.
- Não existem alterações desnecessárias.
- O código está organizado.
- Não foram adicionadas informações sensíveis.
- Os testes existentes continuam funcionando.
- A documentação foi atualizada quando necessário.

 Caso sejam encontrados problemas, o autor deve realizar as correções na **mesma branch**.

 ## 🔀 Merge

 Após a aprovação do Pull Request:

 1. O Pull Request pode ser aprovado.
2. As alterações devem ser integradas à branch `main`.
3. A Issue relacionada deve ser encerrada.
4. A branch pode ser excluída após o merge.

 ## 🔐 Variáveis de ambiente

 Nunca envie informações sensíveis para o GitHub.

 ### ❌ Não faça commit de

```
.env
```

 ### ✅ Utilize

```
.env.example
```

 O arquivo `.env.example` deve ser utilizado para documentar as variáveis necessárias para executar o projeto.

 ## 🐛 Reportando bugs

 Para reportar um problema:

 1. Acesse a seção **Issues**.
2. Verifique se o problema já foi reportado.
3. Caso não exista, crie uma nova Issue.
4. Descreva o problema.
5. Informe os passos necessários para reproduzi-lo.
6. Informe o comportamento esperado e o comportamento atual.

 Quanto mais informações forem fornecidas, mais fácil será reproduzir e corrigir o problema.

 ## 💡 Sugerindo funcionalidades

 Novas funcionalidades também devem ser registradas através de **Issues**.

 A Issue deve explicar:

 - Qual problema a funcionalidade resolve.
- Qual comportamento é esperado.
- Critérios de aceite.
- Possíveis impactos em outras partes do sistema.

 ## 👥 Colaboração

 O **EcoMap** utiliza o GitHub como ferramenta central de colaboração.

 O fluxo recomendado é:

```
┌─────────┐
│  Issue  │
└────┬────┘
     ↓
┌─────────┐
│ Branch  │
└────┬────┘
     ↓
┌────────────────────┐
│   Desenvolvimento  │
└─────────┬──────────┘
          ↓
┌─────────┐
│ Commit  │
└────┬────┘
     ↓
┌─────────┐
│  Push   │
└────┬────┘
     ↓
┌────────────────┐
│ Pull Request   │
└────┬───────────┘
     ↓
┌──────────────┐
│ Code Review  │
└────┬─────────┘
     ↓
┌─────────┐
│  Merge  │
└────┬────┘
     ↓
┌─────────────┐
│    Issue    │
│   fechada   │
└─────────────┘
```

 Esse processo permite que cada contribuição seja registrada e revisada antes de ser incorporada ao projeto.

 ## 📋 Resumo do fluxo

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
  ↓
Issue fechada
```

 > **Importante:** evite realizar alterações diretamente na branch `main`. Todo desenvolvimento deve ser feito em uma branch relacionada à respectiva Issue.