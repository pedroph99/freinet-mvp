# Freinet MVP

Painel do professor em React + Vite, conectado ao backend Express/Prisma. A tela abre com o professor de exemplo criado pela seed e mostra indicadores de notas e frequência, ranking por média com fotos, detalhes e anotações técnicas e disciplinares de cada aluno. A aba **Gerenciamento de aulas** mostra aulas dadas, tendência de presença, comparativo entre turmas e a chamada de cada aula com filtro de faltas. As fotos vêm do campo `photo` da seed; se a URL falhar, aparecem as iniciais.

## Rodar com dados do backend

1. Inicie o Docker Desktop.
2. No diretório `backend`, copie `.env.example` para `.env` e substitua `JWT_SECRET` por uma chave local longa.
3. Execute no diretório `backend`:

   ```powershell
   npm install
   docker compose up -d
   npx prisma generate
   npx prisma migrate deploy
   npx prisma db seed
   npm run dev
   ```

4. Em outro terminal, execute no diretório `frontend`:

   ```powershell
   npm install
   npm run dev
   ```

Abra [http://localhost:5173](http://localhost:5173). O Vite encaminha `/api` para o backend na porta 8000. A seed pode ser executada novamente sem duplicar alunos, turmas, aulas, presenças ou anotações e atualiza os assuntos das aulas antigas de demonstração. A nova migração cria os registros de anotações técnicas e disciplinares; a aba do MVP permite consultá-los.

Quando o backend estiver indisponível, a tela mostra **Prévia da seed**. Essa prévia reproduz os dados determinísticos da seed para permitir revisar o MVP sem Postgres. Quando a conexão funcionar, o indicador muda para **Dados do backend**.

## Limite do MVP

O login automático usa as credenciais de demonstração da seed no cliente. Troque esse fluxo por autenticação própria antes de usar dados reais ou publicar o sistema.
