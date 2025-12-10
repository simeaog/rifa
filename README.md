# Rifa — Backend (init/backend)

Esqueleto inicial do backend em Node.js + TypeScript + Prisma.

Como usar localmente:

1. Copie `.env.example` para `.env` e ajuste as variáveis.
2. Subir serviços com Docker Compose:
   ```bash
   docker-compose up -d
   ```
3. Instale dependências:
   ```bash
   npm install
   ```
4. Gerar prisma client e rodar migrações:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
5. (Opcional) Rodar seed:
   ```bash
   npm run seed
   ```
6. Rodar em modo dev:
   ```bash
   npm run dev
   ```

Arquivos incluídos no commit inicial:
- package.json, .env.example, docker-compose.yml
- prisma/schema.prisma
- src/main.ts, src/app.module.ts
- src/prisma.service.ts
- src/auth/auth.controller.ts, src/auth/auth.service.ts

Confirme se devo prosseguir com o push (e se quer o seed do Admin Master).
