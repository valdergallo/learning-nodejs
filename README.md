# CRUD API (TypeScript + Express + SQLite)

Projeto pequeno que implementa um CRUD de usuários com persistência SQLite.

**Quick Start**

- **Install:** `npm install`
- **Dev (hot-reload):** `npm run dev`
- **Build:** `npm run build`
- **Start (prod):** `npm run start:prod`

**Files & Structure**

- **Root:** `package.json`, `tsconfig.json`, [.env.example](.env.example)
- **Entry:** [src/app.ts](src/app.ts)
- **Config:** [src/config.ts](src/config.ts)
- **DB wrapper:** [src/db.ts](src/db.ts)
- **Routes:** [src/routes/userRoutes.ts](src/routes/userRoutes.ts)
- **Controllers:** [src/controllers/userController.ts](src/controllers/userController.ts)
- **Services:** [src/services/userService.ts](src/services/userService.ts)
- **Repositories:** [src/repositories/userRepo.ts](src/repositories/userRepo.ts)
- **Models:** [src/models/user.ts](src/models/user.ts)
- **Build helper:** [scripts/fix-extensions.cjs](scripts/fix-extensions.cjs)

**How modules interact (summary)**

- A rota recebe a requisição (`routes`), chama o `controller` correspondente.
- O `controller` valida/normaliza dados e delega para o `service`.
- O `service` contém regras de negócio e chama o `repository` para acesso ao DB.
- O `repository` executa SQL via o wrapper em `src/db.ts` e retorna modelos/objetos.

```mermaid
flowchart LR
  A[Routes] --> B[Controllers]
  B --> C[Services]
  C --> D[Repositories]
  D --> E["DB (SQLite)"]
```

**Example requests**

- Create user:
```
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"Alice","email":"a@ex.com"}'
```
- Get users:
```
curl http://localhost:3000/users
```

**Notes**

- Use `.env` for local overrides (see `.env.example`).
- `npm run build` emits JS into `dist/` and a post-build script adds `.js` extensions to relative imports so the built app runs under Node ESM.

**Environment & Node (recommended)**

This project targets Node LTS (v24). Recommended setup using `nvm`:

- Install `nvm` (if not installed):

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
# then restart your shell or source:
source ~/.nvm/nvm.sh
```

- Install and use Node LTS:

```bash
nvm install --lts
nvm alias default lts/*
node -v  # should show v24.x
npm -v
```

- Ensure your shell config loads `nvm` automatically (add to `~/.bashrc` / `~/.zshrc`):

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf "%s" "$HOME/.nvm" || printf "%s" "$XDG_CONFIG_HOME/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \ . "$NVM_DIR/nvm.sh"
```

CI: the repository's GitHub Actions workflow uses `actions/setup-node` to pin Node v24 for CI runs.
