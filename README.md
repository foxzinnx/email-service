# Email Service

Microsserviço HTTP para envio de emails, construído com **Node.js**, **TypeScript** e **Fastify**, seguindo **Clean Architecture**, **DDD** e princípios **SOLID**. O envio é feito via **Nodemailer** (SMTP), isolado atrás de uma interface para que o provedor possa ser trocado sem alterar as regras de negócio.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [API](#api)
- [Testando localmente](#testando-localmente)
- [Testes automatizados](#testes-automatizados)
- [Docker](#docker)
- [Segurança](#segurança)
- [Decisões de design](#decisões-de-design)
- [Licença](#licença)

## Funcionalidades

- Envio de email com corpo em texto puro e HTML opcional.
- Remetente fixo definido no servidor (`MAIL_FROM`), impedindo spoofing por parte dos clientes da API.
- Autenticação por API key com comparação em tempo constante.
- Rate limit por rota.
- Validação de payload com Zod e validação de regras de negócio nos Value Objects do domínio.
- Tratamento de erros centralizado, sem vazar detalhes internos ao cliente.
- Validação das variáveis de ambiente na inicialização (fail fast).
- Graceful shutdown (`SIGINT` / `SIGTERM`).
- Endpoint de health check.
- Imagem Docker multi-stage, executando com usuário não-root.

## Stack

| Tecnologia | Uso |
|---|---|
| Node.js 20+ | Runtime |
| TypeScript | Linguagem |
| Fastify | Framework HTTP |
| fastify-type-provider-zod | Integração Zod ↔ Fastify (validação e tipagem) |
| @fastify/rate-limit | Limitação de requisições |
| Nodemailer | Envio de emails via SMTP |
| Zod | Validação de schemas e variáveis de ambiente |
| Vitest | Testes |
| tsx | Execução em desenvolvimento |

## Arquitetura

O projeto é dividido em camadas, e as dependências sempre apontam para dentro:

```
infra ──► application ──► domain
  ▲
  └── main (composition root)
```

- **domain**: entidades, Value Objects e erros de negócio. Sem dependências externas.
- **application**: casos de uso e portas (interfaces). Conhece apenas o domínio.
- **infra**: tudo que depende de frameworks e bibliotecas externas. Inclui a camada HTTP (Fastify: controllers, rotas, schemas, middlewares, error handler e server) e os providers concretos das portas (Nodemailer).
- **main**: composition root. É o único lugar que conhece todas as camadas e monta as dependências.

O Fastify é tratado como um detalhe de infraestrutura, assim como o Nodemailer. A camada HTTP é um adaptador de entrada (traduz requisições em chamadas ao caso de uso), enquanto o provider de email é um adaptador de saída, e ambos ficam na camada mais externa.

O caso de uso depende da interface `EmailSenderProvider`, e não do Nodemailer (Dependency Inversion). Trocar SMTP por SES, SendGrid ou qualquer outro provedor significa criar uma nova classe que implementa essa interface, sem tocar no domínio ou na aplicação.

## Estrutura de pastas

```
src/
├── domain/
│   ├── entities/
│   │   ├── base/base.entity.ts
│   │   └── email.entity.ts
│   ├── value-objects/
│   │   ├── email-address.vo.ts
│   │   ├── email-subject.vo.ts
│   │   ├── email-body.vo.ts
│   │   ├── email-html.vo.ts
│   │   └── unique-entity-id.vo.ts
│   └── errors/
│       ├── domain.error.ts
│       └── ...
├── application/
│   ├── ports/
│   │   └── email-sender-provider.interface.ts
│   ├── errors/
│   │   └── failed-to-send-email.error.ts
│   └── use-cases/
│       └── send-email/
│           ├── send-email.dto.ts
│           ├── send-email.use-case.ts
│           └── send-email.use-case.spec.ts
├── config/env.ts
├── infra/
│   ├── http/
│   │   ├── controllers/send-email.controller.ts
│   │   ├── middlewares/api-key.hook.ts
│   │   ├── routes/email.routes.ts
│   │   ├── schemas/send-email.schema.ts
│   │   ├── error-handler.ts
│   │   └── server.ts
│   └── providers/
│       └── mail/
│           └── nodemailer-email.provider.ts
└── main/
    ├── app.ts
    └── factories/
        ├── make-nodemailer-email-provider.ts
        └── make-send-email-use-case.ts
scripts/
└── smtp-check.ts
```

## Pré-requisitos

- Node.js 20 ou superior
- npm
- Credenciais SMTP (Gmail com senha de app, Ethereal, Mailpit ou outro provedor)
- Docker (opcional)

## Instalação

```bash
git clone https://github.com/<seu-usuario>/email-service.git
cd email-service
npm install
cp .env.example .env
```

Edite o `.env` com as suas credenciais e rode:

```bash
npm run dev
```

O servidor sobe em `http://localhost:3333`.

## Variáveis de ambiente

Todas são validadas na inicialização. Se alguma estiver ausente ou inválida, o processo exibe os erros e encerra.

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `NODE_ENV` | Não | `development` | `development`, `production` ou `test` |
| `PORT` | Não | `3333` | Porta HTTP |
| `HOST` | Não | `0.0.0.0` | Interface de escuta |
| `SMTP_HOST` | Sim | | Host do servidor SMTP |
| `SMTP_PORT` | Sim | | Porta SMTP (`587` ou `465`, por exemplo) |
| `SMTP_SECURE` | Não | `false` | `true` para TLS implícito (porta 465), `false` para STARTTLS (porta 587) |
| `SMTP_USER` | Sim | | Usuário SMTP |
| `SMTP_PASS` | Sim | | Senha SMTP |
| `MAIL_FROM` | Sim | | Endereço remetente fixo de todos os emails |
| `API_KEY` | Sim | | Chave exigida no header `x-api-key` (mínimo de 32 caracteres) |

Exemplo (`.env.example`):

```bash
NODE_ENV=development
PORT=3333
HOST=0.0.0.0

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-user
SMTP_PASS=your-password

MAIL_FROM=no-reply@yourdomain.com
API_KEY=generate-with-openssl-rand-hex-32
```

Para gerar uma `API_KEY` forte:

```bash
openssl rand -hex 32
```

A `API_KEY` é a chave que **os clientes deste serviço** usam para chamá-lo. Ela é independente das credenciais do provedor de email.

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Executa com hot reload (tsx watch) |
| `npm run build` | Compila para `dist/` |
| `npm start` | Executa a build de produção |
| `npm run typecheck` | Verifica os tipos sem gerar arquivos |
| `npm test` | Executa os testes uma vez |
| `npm run test:watch` | Executa os testes em modo watch |

## API

### `POST /emails`

Envia um email. O remetente é sempre o configurado em `MAIL_FROM`.

**Headers**

| Header | Descrição |
|---|---|
| `Content-Type` | `application/json` |
| `x-api-key` | Chave configurada em `API_KEY` |

**Body**

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `to` | string | Sim | Endereço de email válido |
| `subject` | string | Sim | Não vazio, até 200 caracteres |
| `body` | string | Sim | Não vazio, até 50.000 caracteres |
| `html` | string | Não | Se informado, não vazio, até 100.000 caracteres |

Campos não previstos (como `from`) são rejeitados com `400`.

**Exemplo**

```bash
curl -X POST http://localhost:3333/emails \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "to": "cliente@example.com",
    "subject": "Bem-vindo",
    "body": "Olá, seja bem-vindo!",
    "html": "<h1>Olá!</h1><p>Seja bem-vindo!</p>"
  }'
```

**Respostas**

| Status | Situação | Corpo |
|---|---|---|
| `200` | Email enviado | `{ "message": "Email sent successfully." }` |
| `400` | Payload inválido, campo extra ou violação de regra de domínio | `{ "error": "...", "message": "..." }` |
| `401` | `x-api-key` ausente ou inválida | `{ "error": "Unauthorized" }` |
| `429` | Rate limit excedido (10 requisições por minuto por IP) | |
| `502` | Falha na entrega pelo provedor SMTP | `{ "error": "EmailDeliveryFailed", "message": "..." }` |
| `500` | Erro interno | `{ "error": "InternalServerError", "message": "..." }` |

Erros de domínio retornam o nome da classe em `error` (por exemplo, `SubjectCannotBeEmptyError`, `BodyIsTooLongError`).

### `GET /health`

Retorna `{ "status": "ok" }`. Não exige autenticação. Usado pelo `HEALTHCHECK` do Docker.

## Testando localmente

### Opção 1: Mailpit (recomendada)

Servidor SMTP local que captura todos os emails e exibe numa interface web. Nada sai para a internet.

```yaml
# docker-compose.yml
services:
  mailpit:
    image: axllent/mailpit
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Interface web
    environment:
      MP_SMTP_AUTH_ACCEPT_ANY: 1
      MP_SMTP_AUTH_ALLOW_INSECURE: 1
```

```bash
docker compose up -d
```

`.env`:

```bash
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=dev
SMTP_PASS=dev
MAIL_FROM=no-reply@localhost.dev
```

Envie um email pela API e abra `http://localhost:8025` para visualizá-lo.

### Opção 2: Ethereal

SMTP falso online, sem cadastro. Gere uma conta com:

```bash
npx tsx -e "import n from 'nodemailer'; const a = await n.createTestAccount(); console.log(a.user, a.pass)"
```

Use `smtp.ethereal.email`, porta `587`, `SMTP_SECURE=false` e as credenciais geradas. Os emails ficam visíveis em <https://ethereal.email/messages>.

### Opção 3: Gmail

Requer verificação em duas etapas e uma **senha de app** (a senha normal da conta não funciona para SMTP).

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=seuemail@gmail.com
SMTP_PASS=<senha-de-app-sem-espacos>
MAIL_FROM=seuemail@gmail.com
```

O `MAIL_FROM` deve ser a própria conta autenticada. Contas pessoais têm limite diário de envio, portanto o Gmail é indicado apenas para testes e volumes pequenos. Para produção, prefira um provedor transacional.

### Verificando a conexão SMTP

Para isolar problemas de credencial ou rede sem passar pela API:

```bash
npx tsx scripts/smtp-check.ts
```

O script chama `transporter.verify()`, que conecta e autentica sem enviar nenhum email.

## Testes automatizados

```bash
npm test
```

Os testes usam um `FakeEmailSenderProvider` no lugar do Nodemailer, então rodam sem SMTP e sem rede. Eles cobrem:

- Caso de uso: envio válido, inclusão de HTML e bloqueio de dados inválidos antes de chamar o provider.
- Rota `POST /emails`: `401` sem API key, `400` ao tentar enviar `from`, `400` para violações de domínio e `200` no caminho feliz.

## Docker

Build e execução:

```bash
docker build -t email-service .
docker run --rm -p 3333:3333 --env-file .env email-service
```

O `Dockerfile` é multi-stage: compila o TypeScript em um estágio separado e a imagem final contém apenas o código compilado e as dependências de produção, executando com o usuário `node`.

Observações:

- O `CMD` executa `node` diretamente (e não `npm start`) para que o `SIGTERM` chegue ao processo e o graceful shutdown funcione.
- O `.env` não é copiado para a imagem. Em produção, injete as variáveis via secrets do orquestrador.
- Em Kubernetes ou ECS, configure o período de graça de término (`terminationGracePeriodSeconds` / `stopTimeout`) acima de 10 segundos, que é o timeout interno do shutdown.

### Graceful shutdown

Ao receber `SIGINT` ou `SIGTERM`, o serviço:

1. Para de aceitar novas conexões e aguarda as requisições em andamento.
2. Fecha o transporter SMTP.
3. Encerra o processo. Se algo travar, força a saída após 10 segundos.

## Segurança

- **Remetente fixo:** o `from` não faz parte do payload. Clientes não escolhem o remetente, e qualquer tentativa de enviá-lo resulta em `400`.
- **API key com `timingSafeEqual`:** evita timing attacks na comparação da chave.
- **Rate limit:** 10 requisições por minuto por IP na rota de envio. Atrás de proxy ou load balancer, configure `trustProxy` no Fastify. O contador é em memória; com múltiplas instâncias, use um store Redis.
- **Erros sanitizados:** detalhes do provedor SMTP (host, credenciais, stack) vão apenas para o log, nunca para a resposta.
- **Segredos fora do repositório:** o `.env` está no `.gitignore` e no `.dockerignore`. Nunca commite `SMTP_PASS` ou `API_KEY`.
- **Domínio do remetente:** configure SPF, DKIM e DMARC no domínio usado em `MAIL_FROM` para proteger a reputação e a entregabilidade.

## Decisões de design

- **Value Objects com invariantes:** `EmailAddress`, `EmailSubject`, `EmailBody` e `EmailHtml` validam suas próprias regras. O schema Zod da rota valida só o formato do payload, evitando duas fontes de verdade.
- **Porta enxuta:** `EmailSenderProvider` tem um único método (`send`). O `close()` do transporter é ciclo de vida de infraestrutura e fica apenas na classe concreta (Interface Segregation).
- **Exceções tipadas:** erros de domínio herdam de `DomainError` e são mapeados para `400` no error handler central. `FailedToSendEmailError` é mapeado para `502`.
- **Sem persistência:** o serviço é stateless e não registra os emails enviados.
- **Envio síncrono:** a API aguarda a resposta do SMTP. Se no futuro o envio passar a ser feito por fila, o status de sucesso deve mudar para `202`.
