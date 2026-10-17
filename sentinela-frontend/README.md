# Sentinela Pública — Front-end

Interface web do [Sentinela Pública](../README.md), construída com React, TypeScript, Vite e Tailwind CSS.

> **Estado atual:** telas de interface navegáveis com dados fixos (mock). A integração com a [API](../sentinela-api) ainda não foi feita.

## Requisitos

- Node.js 20 ou superior
- npm

## Como executar

```bash
npm install
npm run dev
```

A aplicação sobe em http://localhost:5173.

## Scripts

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Checagem de tipos (`tsc -b`) e build de produção em `dist/` |
| `npm run preview` | Serve localmente o build de produção |
| `npm run lint` | Analisa o código com o Oxlint |

## Estrutura

```
src/
├── App.tsx          # Definição das rotas
├── main.tsx         # Ponto de entrada da aplicação
├── index.css        # Estilos globais e tema do Tailwind
├── components/      # Componentes reutilizáveis (Sidebar, Logo)
├── pages/           # Uma tela por rota
└── assets/          # Imagens e ícones
```

## Rotas

| Rota | Tela |
|------|------|
| `/` | Login |
| `/inicio` | Painel inicial |
| `/orgaos` | Lista de órgãos |
| `/orgaos/cadastrar` | Cadastro de órgão |
| `/servicos/cadastrar` | Cadastro de serviço |
| `/avaliacoes` | Lista de avaliações |
| `/avaliacoes/checklist` | Preenchimento do checklist |
| `/resultados` | Resultados da avaliação |
| `/relatorios` | Relatório e recomendações |
| `/usuarios` | Gestão de usuários |
| `/configuracoes` | Versões do checklist |

Rotas desconhecidas são redirecionadas para `/inicio`.

> **Pendência:** o menu lateral tem o item "Listar serviços" apontando para `/servicos`, que ainda não possui tela — hoje esse link cai no redirecionamento para `/inicio`.
