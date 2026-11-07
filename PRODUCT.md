# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Brand Commitments
O nome do site é Freinet. A marca usa uma letra F vetorial própria no lugar do ícone genérico.

## Stack
React + Vite, confirmado pelo usuário.

## Users
Professor acompanhando o desempenho de suas turmas e alunos.

## Product Purpose
Oferecer uma visão rápida de notas, médias, frequência e alunos que precisam de atenção, com acesso aos detalhes de cada estudante e às chamadas de cada aula.

## Operating Context
O MVP inicia na sessão do professor criado pela seed do backend. Os dados exibidos vêm das turmas vinculadas a esse professor.

## Capabilities and Constraints
- Dashboard com indicadores de notas e faltas, melhores e piores médias.
- Tela Gerenciamento de aulas, acessível pela navegação em abas, com resumo de aulas e frequência, tendência das últimas chamadas e comparativo entre turmas.
- Lista de aulas realizadas com busca, seleção de turma e chamada individual com fotos e filtro de faltas.
- Ranking de alunos ordenado por média, com foto, notas, faltas e taxa de faltas.
- Detalhes do aluno em um pop-up, com foto, contato e uma aba de anotações técnicas e disciplinares do professor.
- A seed do backend inclui notas, presenças e anotações de demonstração.
- A autenticação automática é específica deste MVP; um fluxo de login para outros usuários não foi solicitado.

## Evidence on Hand
- Backend Express/Prisma em `backend/`, com modelos de professor, aluno, turma, aula, presença e notas.
- `backend/prisma/seed.js` define o professor de exemplo, 20 estudantes e duas turmas.
- `backend/src/utils/gradeCalculations.ts` define o cálculo oficial de médias e aprovação.

## Product Principles
- Mostrar primeiro os sinais que ajudam o professor a decidir onde agir.
- Manter números rastreáveis às notas e presenças registradas.
- Permitir chegar ao contato de um aluno sem perder o contexto do ranking.
