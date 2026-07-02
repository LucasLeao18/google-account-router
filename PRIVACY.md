# Politica de Privacidade - Google Account Router

Ultima atualizacao: 2 de julho de 2026

Esta Politica de Privacidade descreve como a extensao Google Account Router lida com dados do usuario.

## Objetivo da extensao

O Google Account Router tem como unico objetivo redirecionar servicos Google selecionados, como Gmail, Google Classroom e Pesquisa Google, para o indice de conta configurado pelo usuario no navegador.

## Dados processados

A extensao processa localmente as URLs de navegacao dos seguintes dominios:

- `classroom.google.com`
- `mail.google.com`
- `www.google.com`

Esse processamento acontece apenas para verificar se a URL precisa ser ajustada para o formato de conta correto, como `/u/{indice}/`.

A extensao tambem salva no `chrome.storage.sync` as preferencias configuradas pelo usuario:

- servicos ativados ou desativados;
- indice de conta escolhido para cada servico;
- idioma selecionado na interface.

## Dados que nao coletamos

A extensao nao coleta, solicita, transmite ou armazena em servidores proprios:

- nome, e-mail, endereco ou outros dados de identificacao pessoal;
- senhas, credenciais, cookies ou dados de autenticacao;
- informacoes financeiras ou de pagamento;
- dados de saude;
- localizacao;
- comunicacoes pessoais;
- conteudo de paginas, mensagens, arquivos, imagens ou anexos;
- cliques, teclas digitadas, posicao do mouse ou outras atividades detalhadas do usuario.

## Uso dos dados

Os dados processados pela extensao sao usados exclusivamente para cumprir seu unico objetivo: abrir os servicos Google suportados com a conta configurada pelo usuario.

A extensao nao usa dados do usuario para publicidade, analise comportamental, perfilamento, venda de dados, credito, emprestimos ou qualquer finalidade nao relacionada ao funcionamento principal da extensao.

## Compartilhamento de dados

O desenvolvedor nao recebe, vende, transfere ou compartilha dados do usuario com terceiros.

As preferencias salvas em `chrome.storage.sync` podem ser sincronizadas pelo proprio Chrome entre dispositivos conectados a mesma conta Google do usuario, conforme as configuracoes e politicas do Google Chrome.

## Armazenamento e exclusao

As preferencias da extensao ficam armazenadas no navegador do usuario por meio do `chrome.storage.sync`.

O usuario pode remover esses dados a qualquer momento desinstalando a extensao ou limpando os dados/configuracoes da extensao no Chrome.

## Codigo remoto

A extensao nao usa codigo remoto. Todos os arquivos JavaScript, HTML, CSS e icones necessarios estao incluidos no pacote da extensao. A extensao nao usa `eval()`, scripts externos, modulos remotos ou WebAssembly remoto.

## Seguranca

A extensao usa apenas as permissoes necessarias para seu funcionamento e limita o acesso aos dominios declarados no manifesto. Nenhum dado e transmitido para servidores do desenvolvedor.

## Contato

Para duvidas sobre esta Politica de Privacidade ou sobre a extensao, entre em contato pelo perfil do GitHub:

https://github.com/LucasLeao18
