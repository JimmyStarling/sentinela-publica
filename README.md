# 🛡️ Sentinela Pública

> Avaliação de segurança da informação para serviços públicos.

![Status](https://img.shields.io/badge/status-MVP%20em%20desenvolvimento-yellow)
![Licença](https://img.shields.io/badge/licen%C3%A7a-a%20definir-lightgrey)

## Sobre o projeto

O **Sentinela Pública** é um MVP (Produto Minimamente Viável) criado para **fortalecer a cultura de segurança da informação nos setores públicos**. A plataforma permite que um avaliador aplique um checklist de segurança a um serviço público, obtenha uma pontuação de maturidade e receba recomendações priorizadas para corrigir as lacunas encontradas.

O checklist é baseado em referências reconhecidas: **CIS Controls**, **NIST** e **LGPD**.

Projeto desenvolvido no contexto do **██████████**.

## Problema que resolvemos

Muitos órgãos públicos não têm uma forma simples e padronizada de medir o nível de segurança dos seus serviços. Sem esse diagnóstico, fica difícil priorizar investimentos, cumprir a LGPD e criar uma cultura de segurança contínua.

## Funcionalidades

### Núcleo do MVP

| Código | Funcionalidade | Descrição |
|--------|----------------|-----------|
| RF-01 | Autenticação e perfis | Login com perfis de Administrador, Avaliador e Gestor do órgão |
| RF-02 | Cadastro de órgão e serviço | Registro do serviço avaliado (responsável, tipo de dados, criticidade) |
| RF-03 | Checklist de segurança | Questionário por domínios, com respostas Conforme / Parcial / Não conforme / Não se aplica |
| RF-04 | Execução da avaliação | Preenchimento com anexo de evidências; pode ser pausada e retomada |
| RF-05 | Pontuação e maturidade | Cálculo automático geral e por domínio, com classificação de nível |
| RF-06 | Relatório e recomendações | Lacunas e ações recomendadas, priorizadas por risco, com exportação em PDF |

### Próximas versões

| Código | Funcionalidade |
|--------|----------------|
| RF-07 | Painel (dashboard) de resultados |
| RF-08 | Histórico e comparação de avaliações |
| RF-09 | Plano de ação (responsável, prazo e status) |
| RF-10 | Gestão do checklist (perguntas, pesos e versões) |

## Requisitos não funcionais

- **Segurança:** senhas com hash, HTTPS e proteção contra o OWASP Top 10
- **LGPD:** coleta apenas dos dados necessários e registro de consentimento
- **Usabilidade:** uso sem necessidade de treinamento extenso
- **Desempenho:** páginas carregando em até 3 segundos em uso normal
- **Disponibilidade:** monitoramento contínuo, com alerta em até 5 minutos após indisponibilidade
- **Compatibilidade:** principais navegadores e telas de celular

## Requisitos operacionais

| Código | Atividade | Frequência | Prioridade |
|--------|-----------|------------|------------|
| RO-01 | Backup dos dados e relatórios | Diária | Alta |
| RO-02 | Atualização do checklist (CIS, NIST, LGPD) | Semestral | Média |
| RO-03 | Monitoramento da disponibilidade | Contínua | Média |
| RO-04 | Gestão de acessos | A cada entrada/saída e revisão trimestral | Alta |
| RO-05 | Gestão de logs e auditoria | Contínua, com revisão mensal | Média |
| RO-06 | Atualização de dependências e correção de vulnerabilidades | Mensal ou a cada release | Alta |
| RO-07 | Suporte e resposta a incidentes | Sob demanda (triagem em até 24h) | Média |

## Como funciona

1. O **Administrador** mantém o checklist e os acessos.
2. O **Avaliador** cadastra o serviço e responde o checklist, anexando evidências.
3. O sistema **calcula a pontuação** por domínio e a maturidade geral.
4. O **Gestor do órgão** recebe o relatório com as lacunas e as ações recomendadas.

## Tecnologias

> _Preencher conforme a stack escolhida pela equipe._

- Front-end: _a definir_
- Back-end: _a definir_
- Banco de dados: _a definir_

## Como executar

> _Seção a completar quando houver a primeira versão executável._

```bash
# clonar o repositório
git clone https://github.com/<organizacao>/sentinela-publica.git
cd sentinela-publica

# instruções de instalação e execução serão adicionadas aqui
```

## Roadmap

- [ ] Autenticação e perfis de acesso (RF-01)
- [ ] Cadastro de órgão e serviço (RF-02)
- [ ] Checklist de segurança (RF-03)
- [ ] Execução da avaliação (RF-04)
- [ ] Pontuação e nível de maturidade (RF-05)
- [ ] Relatório em PDF (RF-06)
- [ ] Dashboard, histórico e plano de ação (RF-07 a RF-09)
- [ ] Gestão de versões do checklist (RF-10)

## Equipe

- ██████████████ - REDACTED
- ██████████████ - REDACTED
- ██████████████ - REDACTED
- ██████████████ - REDACTED
- ██████████████ - REDACTED
- ██████████████ - REDACTED
- ██████████████ - REDACTED

## Contribuindo

Contribuições são bem-vindas. Para sugerir melhorias ou reportar problemas, abra uma *issue*. Para vulnerabilidades de segurança, **não** abra uma issue pública: entre em contato diretamente com a coordenação do projeto.

## Licença

A definir pela equipe (sugestões: MIT ou Apache-2.0).
