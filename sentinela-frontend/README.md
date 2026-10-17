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
├── auth/            # Contexto de sessão e proteção de rotas
├── types/           # Tipos de domínio compartilhados
├── components/      # Componentes reutilizáveis (Sidebar, Logo, badges)
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
| `/servicos` | Lista de serviços |
| `/servicos/cadastrar` | Cadastro de serviço |
| `/avaliacoes` | Lista de avaliações |
| `/avaliacoes/checklist` | Preenchimento do checklist |
| `/resultados` | Resultados da avaliação |
| `/relatorios` | Relatório e recomendações |
| `/usuarios` | Gestão de usuários |
| `/configuracoes` | Versões do checklist |

As telas internas exigem sessão: sem ela, o `RotaProtegida` redireciona para
o login e retoma a rota pedida depois de entrar. URL desconhecida vai para
`/inicio` com sessão, ou para o login sem ela.

## Cores

As cores ficam em tokens no [src/index.css](src/index.css), não espalhadas
pelas telas. `navy` e `surface` foram amostrados direto do Figma; os neutros
(`subtle`, `line`, `muted`, `placeholder`, `track`) vieram do uso nas telas.
Azuis, vermelhos e âmbar usam a escala padrão do Tailwind — o azul de ação do
design é exatamente o `blue-600`.

Ao criar tela nova, use os tokens (`bg-surface`, `text-navy`, `border-line`)
em vez de hex literal.

## Integração com a API

Os valores que a API aceita são a fonte da verdade. Os tipos em
[src/types/](src/types/) espelham os enums de `sentinela-api`, e os rótulos de
exibição ficam separados em [src/lib/servico.ts](src/lib/servico.ts) — assim o
formulário envia `sensivel` e a tela mostra "Sensível".

Alinhado com a API:

| Campo | Valores aceitos |
|-------|-----------------|
| `tipoDado` | `publico`, `interno`, `pessoal`, `sensivel` |
| `criticidade` | `baixa`, `media`, `alta` |

### Divergências em aberto

Campos que as telas têm e a API **não** tem. Como
[main.ts](../sentinela-api/src/main.ts) usa `forbidNonWhitelisted: true`,
enviar qualquer um deles faz a requisição ser **rejeitada com 400**, não
ignorada:

| Tela | Campo | Situação na API |
|------|-------|-----------------|
| Cadastrar órgão | `esfera`, `cnpj`, `endereco`, `descricao` | Não existem na entidade `Orgao` |
| Lista de órgãos | `sigla` | Não existe na entidade `Orgao` |
| Cadastrar serviço | `descricao` | Não existe na entidade `Servico` |

A entidade `Orgao` da API tem apenas `nome` e `responsavel`, enquanto o frame
`03_Cadastro_Orgao` do Figma especifica os seis campos. Como resolver isso
ainda não foi definido pela equipe — até lá, as telas seguem o Figma e estes
campos não têm destino na API.
