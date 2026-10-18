# Sentinela Pública API

API REST do projeto **Sentinela Pública**, construída com NestJS, TypeORM e PostgreSQL/Supabase. O projeto também contém autenticação JWT, cálculo de pontuação de maturidade e integração com AWS Lambda.

> **Nota sobre o pacote analisado:** `sentinela-api.zip` contém os artefatos compilados em `dist/`, e não o código-fonte `src/`. As rotas abaixo foram identificadas nos controllers compilados presentes no ZIP. Confirme-as com o código-fonte mais recente antes de tratar este documento como contrato definitivo.

## Sumário

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Configuração local](#configuração-local)
- [Executar a API](#executar-a-api)
- [Swagger UI](#swagger-ui)
- [Rotas da API](#rotas-da-api)
- [Deploy na AWS Lambda](#deploy-na-aws-lambda)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Problemas comuns](#problemas-comuns)

## Tecnologias

- Node.js e npm
- NestJS
- TypeORM
- PostgreSQL via Supabase
- JWT / Passport
- Swagger / OpenAPI
- `@codegenie/serverless-express` para adaptar o Express/NestJS ao AWS Lambda
- `@nestjs/observe` para instrumentação

## Pré-requisitos

- Node.js compatível com as versões das dependências do projeto.
- npm.
- Acesso a um projeto Supabase/PostgreSQL.
- Credenciais válidas do Supabase e do serviço de observabilidade utilizado pelo projeto.
- AWS CLI configurada e permissões para publicar uma função Lambda, caso vá realizar o deploy.

## Configuração local

### 1. Instalar as dependências

Na raiz do repositório da API:

```bash
npm ci
```

Se não existir um `package-lock.json` consistente com o `package.json`, use `npm install` e revise as alterações geradas antes de commitar.

### 2. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz da API. Não commite esse arquivo nem compartilhe suas credenciais.

```dotenv
NODE_ENV=development
PORT=3000

# PostgreSQL / Supabase
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY

# Observabilidade
OBSERVE_APP_KEY=YOUR_OBSERVE_APP_KEY
OBSERVE_APP_SECRET=YOUR_OBSERVE_APP_SECRET

# JWT
JWT_ACCESS_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
JWT_REFRESH_SECRET=REPLACE_WITH_ANOTHER_LONG_RANDOM_SECRET

# Origens permitidas, separadas por vírgula
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

Substitua todos os valores de exemplo pelos valores reais. Gere segredos JWT fortes e diferentes entre si. Não use os valores de exemplo em produção.

O módulo de configuração valida como obrigatórias `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `OBSERVE_APP_KEY` e `OBSERVE_APP_SECRET`. O serviço de autenticação também utiliza `JWT_ACCESS_SECRET` e `JWT_REFRESH_SECRET`.

### 3. Certificado CA do Supabase

A configuração TypeORM compilada carrega o certificado em:

```text
certs/supabase-ca.crt
```

O arquivo precisa existir nesse caminho relativo à raiz de execução. Obtenha o certificado CA correto por um canal oficial/confiável do provedor e mantenha a validação TLS habilitada. Não substitua por `rejectUnauthorized: false` para contornar erros de certificado.

### 4. Executar em desenvolvimento

```bash
npm run start:dev
```

A API usa a porta `3000` por padrão, ou a porta definida em `PORT`.

Outros comandos disponíveis no `package.json`:

```bash
npm run build
npm run start:prod
npm test
npm run test:e2e
npm run lint
```

`npm run start:prod` executa o código compilado em `dist/main.js`; execute `npm run build` antes.

## Swagger UI

A configuração presente em `dist/main.js` registra o Swagger em:

- Interface interativa: `http://localhost:3000/api/docs`
- Documento OpenAPI em JSON: `http://localhost:3000/api/docs-json`

O Swagger permite consultar os endpoints e enviar requisições de teste. Para endpoints protegidos, obtenha um JWT pelo login e use **Authorize** com o token Bearer, quando a configuração de segurança estiver declarada nos endpoints.

> **AWS Lambda:** o handler encontrado em `dist/lambda.js` não registra atualmente o Swagger UI. Portanto, a rota `/api/docs` documentada acima está disponível no bootstrap local (`main.ts`), mas não deve ser considerada disponível no Lambda sem adaptar o bootstrap do handler Lambda para registrar o Swagger também.

## Rotas da API

As rotas abaixo refletem os controllers encontrados no ZIP compilado. Não foi identificado um prefixo global de API no bootstrap analisado.

### Health / raiz

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/` | Retorna a mensagem padrão da aplicação. |

### Autenticação — `/auth`

| Método | Rota | Autenticação | Corpo / parâmetros identificados |
|---|---|---|---|
| `POST` | `/auth/register` | Pública | `name`, `email`, `password` |
| `POST` | `/auth/login` | Pública | `email`, `password` |
| `POST` | `/auth/refresh` | Pública | `refreshToken` |
| `POST` | `/auth/logout` | JWT | Token Bearer |
| `GET` | `/auth/me` | JWT | Token Bearer |
| `POST` | `/auth/forgot-password` | Pública | Campo `email` no corpo JSON |
| `POST` | `/auth/reset-password` | Pública | Campos `token` e `newPassword` no corpo JSON |
| `POST` | `/auth/change-password` | JWT | Campos `currentPassword` e `newPassword` no corpo JSON |
| `POST` | `/auth/verify-email` | Pública | Campo `token` no corpo JSON |
| `POST` | `/auth/resend-verification` | Pública | Campo `email` no corpo JSON |

Exemplo de cadastro:

```json
{
  "name": "Nome de exemplo",
  "email": "usuario@example.com",
  "password": "Use-uma-senha-forte-aqui"
}
```

Exemplo de login:

```json
{
  "email": "usuario@example.com",
  "password": "SUA_SENHA"
}
```

Regras identificadas nos DTOs compilados: nome com até 100 caracteres; e-mail válido com até 254 caracteres; senha de cadastro entre 12 e 128 caracteres. O DTO de login aceita senha de 1 a 128 caracteres.

### Órgãos — `/orgaos`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/orgaos` | Criar órgão |
| `GET` | `/orgaos` | Listar órgãos |
| `GET` | `/orgaos/:id` | Consultar órgão por ID |
| `PATCH` | `/orgaos/:id` | Atualizar órgão |
| `DELETE` | `/orgaos/:id` | Remover órgão |

Corpo de criação identificado:

```json
{
  "nome": "Secretaria de Exemplo",
  "responsavel": "Responsável de Exemplo"
}
```

`nome` e `responsavel` são strings obrigatórias de até 150 caracteres. O parâmetro `id` deve ser inteiro.

### Serviços — `/servicos`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/servicos` | Criar serviço |
| `GET` | `/servicos` | Listar serviços; aceita filtro opcional `orgaoId` |
| `GET` | `/servicos/:id` | Consultar serviço por ID |
| `PATCH` | `/servicos/:id` | Atualizar serviço |
| `DELETE` | `/servicos/:id` | Remover serviço |

Exemplo de criação:

```json
{
  "nome": "Portal de Serviços",
  "responsavel": "Equipe responsável",
  "tipoDado": "publico",
  "criticidade": "media",
  "orgaoId": 1
}
```

Valores de enum identificados:

- `tipoDado`: `publico`, `interno`, `pessoal`, `sensivel`
- `criticidade`: `baixa`, `media`, `alta`

Para filtrar serviços por órgão:

```http
GET /servicos?orgaoId=1
```

O `orgaoId` deve ser inteiro. Os valores de exemplo não representam dados existentes no banco.

### Pontuação — `/pontuacao`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/pontuacao/calcular` | Calcula pontuação e nível de maturidade a partir dos domínios informados |

Exemplo de corpo identificado no DTO:

```json
{
  "dominios": [
    {
      "nome": "Governança",
      "respostas": [
        "CONFORME",
        "PARCIAL",
        "NAO_CONFORME",
        "NAO_SE_APLICA"
      ]
    }
  ]
}
```

Cada domínio precisa ter um nome e ao menos uma resposta. Valores permitidos para `respostas`:

- `CONFORME`
- `PARCIAL`
- `NAO_CONFORME`
- `NAO_SE_APLICA`

O endpoint está configurado para responder com HTTP `200` em caso de sucesso. A fórmula completa de cálculo e o formato exato da resposta devem ser conferidos na implementação atual de `PontuacaoService`.

## Deploy na AWS Lambda

O pacote contém um handler adaptado para Lambda em `dist/lambda.js`, exportando `handler`. O nome do handler a configurar na função é:

```text
dist/lambda.handler
```

O ZIP analisado não contém uma configuração de infraestrutura (por exemplo, AWS SAM, Serverless Framework ou Terraform). O procedimento abaixo descreve um deploy por pacote ZIP diretamente na Lambda; API Gateway ou Lambda Function URL deve ser configurado para receber tráfego HTTP.

### 1. Compilar a aplicação

Execute na raiz do projeto, com as dependências de desenvolvimento instaladas:

```bash
npm ci
npm run build
```

Confirme que o arquivo `dist/lambda.js` foi gerado.

### 2. Preparar o pacote de deploy

O pacote deve conter o build, as dependências de produção e o certificado CA utilizado pelo TypeORM. O exemplo abaixo pressupõe que `certs/supabase-ca.crt` existe e é válido:

```bash
npm prune --omit=dev

zip -r sentinela-api-lambda.zip \
  dist \
  node_modules \
  package.json \
  certs/supabase-ca.crt
```

Execute a partir da raiz do projeto. Antes de publicar, confirme que o ZIP contém `dist/lambda.js`, as dependências de produção e `certs/supabase-ca.crt`, sem `.env`, credenciais ou arquivos locais sensíveis.

> Dependências nativas, como `bcrypt` caso estejam presentes na versão efetiva do projeto, devem ser instaladas/empacotadas para o mesmo sistema operacional, arquitetura e runtime usados pela Lambda. O ZIP gerado em Linux compatível com o runtime é preferível a dependências nativas compiladas em Windows ou macOS.

### 3. Criar ou configurar a função Lambda

Na AWS Console, configure:

- **Runtime:** uma versão Node.js suportada pela AWS e compatível com as dependências do projeto.
- **Handler:** `dist/lambda.handler`.
- **Arquitetura:** a mesma usada para instalar/empacotar as dependências.
- **Memória e timeout:** ajuste conforme o tempo de inicialização, conexão com o banco e observabilidade.
- **Variáveis de ambiente:** configure os valores descritos na seção [Variáveis de ambiente](#variáveis-de-ambiente).
- **Permissões IAM:** conceda apenas as permissões necessárias para os recursos efetivamente utilizados.

Faça upload de `sentinela-api-lambda.zip` em **Code → Upload from → .zip file**. Para pacotes maiores que o limite de upload direto, use um bucket S3.

### 4. Expor a função por HTTP

Escolha uma das opções:

1. **Lambda Function URL:** adequada para disponibilizar rapidamente um endpoint HTTP.
2. **Amazon API Gateway:** adequada quando precisar de configuração mais completa de rotas, throttling, autenticação e observabilidade.

Configure CORS no recurso de entrada HTTP conforme as origens reais do frontend. Não considere CORS como mecanismo de autenticação.

### 5. Validar o deploy

Depois de configurar a URL HTTP, teste primeiro a rota raiz:

```bash
curl -i "https://SUA_URL_PUBLICA/"
```

Em seguida, teste um endpoint público, por exemplo:

```bash
curl -i -X POST "https://SUA_URL_PUBLICA/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"SUA_SENHA"}'
```

Use credenciais de teste válidas e não coloque senhas reais em históricos de terminal compartilhados. Consulte os logs da função no CloudWatch se a Lambda retornar `5xx`.

### Observações importantes sobre o handler Lambda atual

- O `dist/lambda.js` analisado usa `app.enableCors()` sem restringir origens; isso difere da configuração local baseada em `CORS_ORIGIN`. Ajuste a configuração de CORS antes de expor a função publicamente.
- O handler Lambda não registra o Swagger, e sua configuração de `ValidationPipe`/filtro global difere da de `main.ts`. Se a aplicação deve se comportar igualmente em local e produção, alinhe essas configurações.
- A configuração TypeORM espera o certificado em `certs/supabase-ca.crt`. Se o arquivo não estiver no pacote ou no caminho esperado, a inicialização pode falhar.
- A função Lambda deve ter acesso de rede ao banco Supabase. Verifique regras de rede, DNS, TLS e conectividade caso a conexão falhe.
- Não ative sincronização automática de schema em produção; a configuração compilada analisada usa `synchronize: false` e `migrationsRun: false`.

## Variáveis de ambiente

| Variável | Obrigatória no código analisado | Finalidade |
|---|---|---|
| `NODE_ENV` | Não; padrão `development` | Ambiente de execução (`development`, `test` ou `production`) |
| `PORT` | Não; padrão `3000` no servidor local | Porta HTTP local |
| `DATABASE_URL` | Sim | String de conexão PostgreSQL |
| `SUPABASE_URL` | Sim | URL do projeto Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | Sim | Chave publicável do Supabase |
| `OBSERVE_APP_KEY` | Sim | Chave de integração de observabilidade |
| `OBSERVE_APP_SECRET` | Sim | Segredo de integração de observabilidade |
| `JWT_ACCESS_SECRET` | Usada pela autenticação | Segredo para validar/assinar tokens de acesso |
| `JWT_REFRESH_SECRET` | Usada pela autenticação | Segredo para tokens de atualização |
| `CORS_ORIGIN` | Opcional no bootstrap local | Lista de origens permitidas, separadas por vírgula |

`PORT` e `CORS_ORIGIN` são usados pelo bootstrap HTTP local. O handler Lambda atualmente não usa `PORT` e não aplica `CORS_ORIGIN` como lista de origens.

## Problemas comuns

### `Cannot find type definition file for 'jest'`

Instale as dependências do projeto incluindo as de desenvolvimento:

```bash
npm ci
```

O `package.json` inclui `@types/jest` e `jest` em `devDependencies`. Não remova os tipos do Jest se o projeto continuar usando os testes existentes.

### Erro de certificado (`SELF_SIGNED_CERT_IN_CHAIN` ou falha TLS)

- Verifique o certificado CA do Supabase e o caminho `certs/supabase-ca.crt`.
- Confirme que o certificado está disponível tanto localmente quanto dentro do pacote Lambda.
- Mantenha a verificação de certificado habilitada; não use `rejectUnauthorized: false` como correção permanente.

### Lambda retorna `502` ou `5xx`

- Consulte os logs no CloudWatch.
- Confirme o handler `dist/lambda.handler`.
- Verifique as variáveis de ambiente obrigatórias.
- Confirme que `dist/lambda.js` e as dependências de produção estão no ZIP.
- Verifique conectividade com o banco e presença do certificado CA.

### Swagger abre localmente, mas não na Lambda

O bootstrap local (`main.ts`) registra `/api/docs`; o handler `dist/lambda.js` do ZIP analisado não. É necessário adicionar a configuração Swagger ao bootstrap Lambda para publicar a documentação também nesse ambiente.
