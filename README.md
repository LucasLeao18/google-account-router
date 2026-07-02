# Google Account Router

![Manifest V3](https://img.shields.io/badge/Manifest-V3-0D9488)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-1A73E8)
![License: MIT](https://img.shields.io/badge/License-MIT-EA580C)

Google Account Router é uma extensão para Google Chrome que abre serviços do Google com o índice de conta certo.

Ela resolve aquele problema clássico: você acessa Classroom, Gmail ou Google e o navegador insiste em usar a conta padrão errada. Com a extensão, você escolhe a conta desejada por serviço e a URL é normalizada automaticamente para o formato `/u/{index}/`.

## Créditos

Projeto criado e mantido por **LucasLeao18**.

GitHub: [@LucasLeao18](https://github.com/LucasLeao18)

Todos os créditos de ideia, autoria e manutenção pertencem a **LucasLeao18**.

## Exemplo

Se o Google Classroom estiver configurado para a conta `3`, ao abrir:

```text
https://classroom.google.com/
```

a extensão redireciona para:

```text
https://classroom.google.com/u/3/
```

## Recursos

- Extensão Chrome com Manifest V3.
- Popup moderno, simples e com modo claro/escuro automático.
- Preferências salvas com `chrome.storage.sync`.
- Redirecionamento automático via background service worker.
- Cada serviço pode ser ativado ou desativado individualmente.
- Índice de conta configurável: `0`, `1`, `2`, `3`, `4`, `5` e assim por diante.
- Preserva query params e hash quando possível.
- Evita loops infinitos de redirecionamento.
- Não interfere em `accounts.google.com`.
- Não solicita senha, login, cookies ou dados sensíveis.
- Não coleta dados do usuário.

## Serviços suportados

| Serviço | URL base | URL gerada |
| --- | --- | --- |
| Google Classroom | `https://classroom.google.com/` | `https://classroom.google.com/u/{index}/` |
| Gmail | `https://mail.google.com/` | `https://mail.google.com/mail/u/{index}/` |
| Google Search | `https://www.google.com/` | `https://www.google.com/u/{index}/` quando aplicável |

## Como instalar localmente

1. Baixe ou clone este repositório.
2. Abra o Chrome e acesse `chrome://extensions`.
3. Ative o **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta do projeto.
6. Clique no ícone da extensão e configure suas contas.

## Como usar

1. Abra o popup da extensão.
2. Ative o serviço desejado.
3. Escolha o índice da conta.
4. Clique em **Salvar configurações**.
5. Acesse o serviço do Google normalmente.

## Como testar

Classroom:

```text
https://classroom.google.com/
```

Com conta `3`, deve abrir:

```text
https://classroom.google.com/u/3/
```

Gmail:

```text
https://mail.google.com/
```

Com conta `2`, deve abrir:

```text
https://mail.google.com/mail/u/2/
```

Google:

```text
https://www.google.com/search?q=teste
```

Com conta `1`, deve tentar abrir:

```text
https://www.google.com/u/1/search?q=teste
```

## Testes locais

O projeto inclui uma validação simples da lógica de redirecionamento:

```bash
node tests/redirect.test.js
```

## Estrutura

```text
.
├── background.js
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── icons/
└── tests/
```

## Privacidade

Google Account Router não coleta, envia ou armazena dados pessoais fora do Chrome.

As configurações ficam em `chrome.storage.sync` e a extensão apenas lê a URL atual para decidir se deve normalizar o índice de conta.

## Roadmap

- Adicionar mais serviços do Google.
- Criar presets para contas frequentes.
- Melhorar a compatibilidade com variações de URLs internas.
- Adicionar opção de exportar/importar configurações.

## Contribuindo

Sugestões, issues e pull requests são bem-vindos.

Antes de enviar mudanças, rode:

```bash
node tests/redirect.test.js
```

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE).
