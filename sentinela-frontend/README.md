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

### Configuração

```bash
cp .env.example .env    # VITE_API_URL, padrão http://localhost:3000
```

Do lado da API é preciso definir **`CORS_ORIGIN`**, senão o navegador bloqueia
as chamadas: `enableCors` usa `?? false` como padrão, que recusa toda origem.

```bash
# no .env da sentinela-api
CORS_ORIGIN=http://localhost:5173
```

O contrato dos endpoints fica em `http://localhost:3000/api/docs` (Swagger).

### Camada de serviços

As chamadas HTTP ficam em [src/services/](src/services/), uma por recurso, e
nunca dentro das telas. O [api.ts](src/services/api.ts) concentra a URL base e
a tradução de erro do Nest em `ApiError` com o status preservado.

| Função | Rota | Tela |
|--------|------|------|
| `listarOrgaos` | `GET /orgaos` | Lista de órgãos ✅ · select de Cadastrar serviço ✅ |
| `criarOrgao` | `POST /orgaos` | — |
| `listarServicos` | `GET /servicos` | Lista de serviços ✅ · contagem na lista de órgãos ✅ |
| `criarServico` | `POST /servicos` | Cadastrar serviço ✅ |
| `calcularPontuacao` | `POST /pontuacao/calcular` | — |

A lista de órgãos, a lista de serviços e o cadastro de serviço consomem a API.
Cadastrar órgão, resultados e relatório seguem com dados fixos — o que falta
em cada um está na seção de divergências.

Como `GET /orgaos` não carrega a relação `servicos`, a coluna "Serviços" da
lista de órgãos é derivada de `GET /servicos`, agrupando pelo nome do órgão
(que é `unique` na API).

### Valores aceitos

Os valores que a API aceita são a fonte da verdade. Os tipos em
[src/types/](src/types/) espelham os enums de `sentinela-api`, e os rótulos de
exibição ficam separados em [src/lib/servico.ts](src/lib/servico.ts) — assim o
formulário envia `sensivel` e a tela mostra "Sensível".

Alinhado com a API:

| Campo | Valores aceitos |
|-------|-----------------|
| `tipoDado` | `publico`, `interno`, `pessoal`, `sensivel` |
| `criticidade` | `baixa`, `media`, `alta` |
| `resposta` do checklist | `CONFORME`, `PARCIAL`, `NAO_CONFORME`, `NAO_SE_APLICA` |

### Divergências com o Figma

As telas só expõem campos que existem na API. Como
[main.ts](../sentinela-api/src/main.ts) usa `forbidNonWhitelisted: true`,
um campo a mais no corpo da requisição faz a API **rejeitar com 400** em vez
de ignorá-lo — por isso os campos sem contrapartida foram removidos:

| Tela | Campos removidos |
|------|------------------|
| Cadastrar órgão | `esfera`, `cnpj`, `endereco`, `descricao` |
| Cadastrar serviço | `descricao` |
| Lista de órgãos | `sigla` |

O que segue em aberto é uma decisão de produto, não de código: o frame
`03_Cadastro_Orgao` do Figma especifica seis campos, e a entidade `Orgao` da
API tem apenas `nome` e `responsavel`. Enquanto a equipe não definir se a API
ganha os campos ou se o Figma é reduzido, o cadastro de órgão fica com os dois
campos que a API aceita.
