# GPC---Guia-Profissional-de-Carreira
Guia Profissional de Carreira — plataforma de aprendizagem, desenvolvimento de competências e conexão profissional.

## Como rodar (sem backend)

Não precisa de Spring Boot nem MySQL. Abra `gpc/index.html` (ou `gpc/login.html`) direto no navegador.
Os dados (contas, progresso, pedidos de perfil) ficam no `localStorage` do navegador, em `store.js`.

- Admin padrão: `admin@gpc.com` / `admin123`
- "Esqueci minha senha": sem e-mail real, a tela mostra o link de redefinição na hora.
- Para zerar o banco: no console do navegador, `GPC.redefinirTudo()`.
