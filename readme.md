# SecretTell / Smenssagem

Projeto dividido em duas partes:

- `smessage/` é o backend em NestJS + Prisma + SQLite.
- `smessage-front/` é o frontend em Next.js.

Este projeto não usa mais Docker para rodar localmente.

## O que o projeto faz

- A página inicial permite enviar mensagens anônimas sem login.
- A página `/login` é restrita por URL e autentica com credenciais vindas do `.env`.
- A página `/messages` mostra todas as mensagens para quem estiver autenticado.

## Requisitos

- Node.js 18 ou superior.
- npm instalado.

## Como rodar o backend

Abra um terminal na pasta `smessage/` e rode:

```bash
npm install
```

Depois, confira o arquivo `.env` do backend. O projeto usa SQLite e precisa da variável:

```env
DATABASE_URL="file:./dev.db"
```

Se quiser, ajuste também `FRONTEND_URL` no arquivo `.env.example`/`.env` conforme sua necessidade.

Para iniciar o backend em modo desenvolvimento:

```bash
npm run dev
```

O backend sobe, por padrão, em `http://localhost:3001`.

Se precisar recriar o banco ou aplicar as migrations, use:

```bash
npx prisma migrate dev
```

## Como rodar o frontend

Abra outro terminal na pasta `smessage-front/` e rode:

```bash
npm install
```

Depois confira o arquivo `.env` do frontend. Ele precisa destes valores:

```env
BACKEND_URL=http://localhost:3001
LOGIN_USERNAME=admin
LOGIN_PASSWORD=admin123
AUTH_COOKIE_SECRET=secret-tell-dev-secret
```

Esses dados controlam:

- `BACKEND_URL`: endereço do backend.
- `LOGIN_USERNAME` e `LOGIN_PASSWORD`: login da página restrita.
- `AUTH_COOKIE_SECRET`: assinatura do cookie de autenticação.

Para iniciar o frontend em modo desenvolvimento:

```bash
npm run dev
```

O frontend sobe, por padrão, em `http://localhost:3000`.

## Ordem recomendada

1. Inicie o backend em `smessage/`.
2. Inicie o frontend em `smessage-front/`.
3. Abra `http://localhost:3000` para enviar mensagens.
4. Acesse `http://localhost:3000/login` para entrar na área restrita.
5. Após o login, vá para `http://localhost:3000/messages` para ver todas as mensagens.

## Scripts úteis

### Backend (`smessage/`)

- `npm run dev` - inicia em modo desenvolvimento.
- `npm run build` - gera a versão de produção.
- `npm run start:prod` - executa a versão compilada.
- `npm run test` - roda os testes.
- `npm run lint` - corrige arquivos com ESLint.

### Frontend (`smessage-front/`)

- `npm run dev` - inicia em modo desenvolvimento.
- `npm run build` - gera a versão de produção.
- `npm run start` - executa a versão compilada.
- `npm run lint` - roda ESLint.

## Estrutura resumida

- `smessage/src/` - código do backend.
- `smessage/prisma/` - schema e migrations do banco.
- `smessage-front/app/` - páginas e rotas do frontend.

## Observação

Se você alterar as credenciais do login, atualize o `.env` do frontend e reinicie a aplicação para o cookie e a validação ficarem consistentes.
