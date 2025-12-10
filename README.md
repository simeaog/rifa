# Rifa Backend

This branch adds endpoints for CRUD of rifas and numeros (reserve/confirm), a Redis lock helper, and a simple reservation expiry background job (for testing/dev).

Prerequisites
- Docker & Docker Compose (optional but recommended)
- Node 18+ and npm
- Redis (can run via docker-compose)

Quick start (dev)
1. Start services with docker-compose (if repo provides compose file):
   docker-compose up -d

2. Install dependencies:
   npm install

3. Generate Prisma client:
   npm run prisma:generate

4. Run migrations (this will prompt and create DB schema):
   npm run prisma:migrate

5. Seed (optional):
   npm run seed

6. Start the app in dev mode:
   npm run dev

App will listen on http://localhost:3000 (or APP_PORT)

Background job
- The reservation expiry job starts automatically on app boot. It will free reserved numbers whose reservedUntil has passed and cancel old pending reservas.

Endpoints (examples)

1) Register / Login (example)
# Register (if endpoint exists)
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"secret","name":"User"}'

# Login -> returns token (adjust according to your auth implementation)
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"secret"}'

2) Create a rifa
curl -X POST http://localhost:3000/api/rifas -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"titulo":"Teste","descricao":"Rifa teste","quantidade":100,"valor_por_numero":10}'

3) Publish a rifa (example)
curl -X POST http://localhost:3000/api/rifas/<RIFA_ID>/publish -H "Authorization: Bearer <TOKEN>"

4) Reserve numbers
curl -X POST http://localhost:3000/api/rifas/<RIFA_ID>/numeros/reserve -H "Content-Type: application/json" -d '{"userId":"<USER_ID>","numeros":[1,2,3],"reserveMinutes":15}'

5) Confirm reservation (by creator or admin)
curl -X POST http://localhost:3000/api/rifas/<RIFA_ID>/numeros/confirm -H "Content-Type: application/json" -d '{"reservaId":"<RESERVA_ID>","confirmerId":"<ADMIN_OR_CREATOR_ID>"}'

Notes
- The reservation system uses a Redis lock helper (src/locks/redis-lock.ts) that is available to be used by services that need distributed locking.
- The reservation expiry job is simplistic and built for testing. For production use consider using a robust job scheduler and more efficient DB queries.

If you want, provide the exact local steps you'd like me to document next (e.g. docker-compose contents, env vars) and I can expand this README.
