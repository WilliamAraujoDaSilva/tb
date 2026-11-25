# CORELESS — Plataforma educativa sobre jogos de cartas

**Projeto acadêmico — Desenvolvimento de Interfaces, 2º semestre de 2026**

## 1. Visão geral

CORELESS é um protótipo de plataforma educativa que organiza introduções, regras básicas, vocabulário e desafios sobre jogos de cartas. A proposta é facilitar a aprendizagem por meio de conteúdo dividido em etapas, cartões informativos, pesquisa e exemplos visuais.

A identidade visual aprovada utiliza fundo escuro, vermelho como cor de destaque, cartas em evidência e composição minimalista. O nome da marca é parte da identidade, mas o foco de navegação é o conteúdo educativo.

O projeto prioriza modalidades recreativas e educativas, sem apostas, dinheiro real, cassino ou conexão com serviços de jogos de azar.

## 2. Funcionalidades implementadas

- Página inicial responsiva com navegação por seções.
- Catálogo de seis jogos: Truco, Pife/Pif-Paf, Copas, Buraco, Paciência e Bridge.
- Campo de pesquisa e filtros por categoria.
- Janela modal com introdução, objetivo, preparação e vocabulário de cada jogo.
- Carrossel manual de três trilhas de aprendizagem, com imagens SVG locais, botões anterior/próximo e indicadores.
- Biblioteca dos quatro naipes com descrições acessíveis.
- Quiz de três perguntas com correção, explicação e pontuação.
- Página dedicada de login demonstrativo (`login.html`) e atalho de login na página inicial.
- Formulário de contato com validação no navegador.
- Página dedicada de acessibilidade (`acessibilidade.html`) e painel rápido na página inicial, com tema claro/escuro, aumento e redução de fonte, alto contraste, redução de movimento, foco visível, navegação por teclado, rótulos de formulário e regiões de anúncio.
- Preferências visuais salvas localmente no navegador.

## 3. Tecnologias utilizadas

| Tecnologia | Uso no projeto |
|---|---|
| HTML5 | Estrutura semântica das seções, navegação, cartões, imagens e formulários. |
| CSS3 | Identidade visual, cartas ilustradas em CSS, responsividade, temas e acessibilidade. |
| JavaScript | Busca, filtros, carrossel, quiz, modais, preferências, validação e mensagens. |
| Bootstrap 5.3.9 | Grid responsivo, utilitários, modal, toast e componentes estruturais. Carregado por CDN. |
| SVG | Ilustrações vetoriais locais para o carrossel de aprendizagem. |
| Google Fonts | Famílias Manrope e DM Sans, com fontes de sistema como alternativa. |

Não foi utilizado Tailwind CSS. O projeto utiliza Bootstrap como framework CSS e CSS próprio para preservar a identidade visual específica.

## 4. Estrutura de pastas

```text
CORELESS_site/
├── index.html
├── login.html
├── acessibilidade.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── login-page.js
│   └── accessibility-page.js
└── assets/
    ├── learning-suits.svg
    ├── learning-rules.svg
    └── learning-quiz.svg
```

## 5. Como executar localmente

### Opção A — Abrir diretamente

1. Extraia o arquivo ZIP para uma pasta do computador.
2. Abra a pasta `CORELESS_site`.
3. Dê dois cliques em `index.html` ou abra o arquivo em um navegador atualizado.
4. Mantenha uma conexão com a internet para carregar o Bootstrap e as fontes externas.

### Opção B — Usar Visual Studio Code e Live Server (recomendado)

1. Instale o Visual Studio Code.
2. Abra a pasta `CORELESS_site` no programa.
3. Instale a extensão **Live Server** pelo painel de extensões.
4. Clique com o botão direito em `index.html` e selecione **Open with Live Server**.
5. O navegador abrirá um endereço local, normalmente `http://127.0.0.1:5500/`.

O endereço local funciona apenas no computador em que o servidor está executando. Ele não é um endereço público da internet.

## 6. Processo de construção passo a passo

1. **Definição do objetivo:** delimitar o CORELESS como uma plataforma educativa para apresentar regras e conceitos de jogos de cartas.
2. **Planejamento da arquitetura:** dividir a página em início, catálogo, aprendizagem, biblioteca, desafios, sobre/contato e rodapé.
3. **Definição da identidade visual:** aplicar preto profundo (`#0B0B0B`), cinza escuro (`#171717`), off-white (`#F2EFED`), cinza claro (`#B8B8B8`) e vermelho (`#C6202F`).
4. **Estrutura HTML:** criar cabeçalho, navegação, conteúdo principal, cartões, carrossel, formulários, janelas modais e rodapé com elementos semânticos.
5. **Organização responsiva:** utilizar o grid do Bootstrap para distribuir os conteúdos em colunas que se reorganizam em telas menores.
6. **Personalização CSS:** desenvolver as cartas gráficas, fundos, tipografia, hierarquia, botões, estados de foco, temas e ajustes para dispositivos móveis.
7. **Comportamentos JavaScript:** implementar pesquisa, filtros, carrossel, biblioteca de naipes, guias dos jogos, quiz e validação de formulários.
8. **Acessibilidade:** inserir link para pular ao conteúdo, rótulos, textos alternativos nas imagens, mensagens de estado, foco visível, controle de fonte, alto contraste e redução de movimento.
9. **Planejamento da verificação:** preparar testes com mouse e teclado, telas estreitas, alternância de temas, pesquisa de jogos, carrossel, quiz e validação de formulários.
10. **Documentação e publicação:** registrar ferramentas e referências, manter versões no GitHub e publicar em uma hospedagem estática, como GitHub Pages, após a revisão final.

## 7. Como os principais arquivos funcionam

### `index.html`

Contém o conteúdo e a estrutura da interface. Os elementos são agrupados em seções com identificadores usados pelos links do menu. Os cartões dos jogos possuem atributos `data-*` para filtros e identificação dos guias. Os formulários possuem rótulos, tipos de campo e validação nativa.

### `css/styles.css`

Define variáveis de cor para os temas, tipografia, cartões, botões, ilustrações de cartas feitas com CSS, carrossel, formulários e adaptação para celular. As regras `data-theme`, `data-contrast` e `data-motion` permitem alterar a aparência sem duplicar a página.

### `login.html` e `js/login-page.js`

Apresentam a página de entrada e sua validação demonstrativa. A senha não é salva nem enviada.

### `acessibilidade.html` e `js/accessibility-page.js`

Apresentam uma página própria de configurações visuais e aplicam preferências compatíveis com as utilizadas na página inicial.

### `js/app.js`

Controla as interações. As funções de armazenamento local possuem tratamento de erro para que a página continue funcionando mesmo quando o navegador bloqueia `localStorage`. Os guias são preenchidos com dados do próprio arquivo JavaScript. O quiz informa a resposta e explica o conceito.

## 8. Login e formulários: limites da demonstração

O login é apenas uma simulação de interface. Ele valida os campos no navegador e usa um identificador demonstrativo local para indicar uma sessão. **A senha não é armazenada nem enviada.** Não existe banco de dados, cadastro real, criptografia de credenciais, recuperação de senha ou autenticação no servidor.

O formulário de contato valida os campos e exibe uma confirmação local. **Ele não envia e-mails nem grava mensagens em um servidor.** Para transformar esses recursos em serviços reais, seria necessário desenvolver um backend, aplicar validação no servidor, proteger dados pessoais e configurar um serviço de envio.

## 9. Acessibilidade e pontos de verificação

O projeto aplica práticas iniciais alinhadas à WCAG 2.2: estrutura semântica, navegação por teclado, foco destacado, texto alternativo, rótulos de campos, mensagens de estado e mais de uma forma de identificar os naipes. O tema claro/escuro e os controles de fonte ampliam a personalização.

Os valores de contraste devem ser testados novamente no navegador, em todos os estados e componentes. A presença desses recursos não significa, por si só, que uma auditoria formal de conformidade WCAG foi concluída. Recomenda-se testar com teclado, leitor de tela, ampliador e ferramenta de análise de contraste.

## 10. Checklist de testes manuais para conferência

- [ ] Abrir a página em computador e celular.
- [ ] Usar Tab, Shift+Tab, Enter e Espaço para navegar.
- [ ] Alternar entre tema claro e escuro na página inicial e na página de acessibilidade.
- [ ] Aumentar e reduzir a fonte e testar alto contraste.
- [ ] Ativar redução de movimento.
- [ ] Pesquisar por “Truco” e testar os filtros.
- [ ] Abrir e fechar os guias dos jogos.
- [ ] Avançar e retroceder o carrossel.
- [ ] Selecionar os quatro naipes.
- [ ] Concluir o quiz e refazer o desafio.
- [ ] Abrir e testar a página de login.
- [ ] Enviar formulários vazios e preenchidos para conferir validação.
- [ ] Verificar se a interface continua compreensível com imagens desativadas.

## 11. Publicação e versionamento

O código pode ser versionado em um repositório GitHub. Uma forma de publicação é o GitHub Pages, que hospeda sites estáticos. Depois de criar o repositório e enviar os arquivos, a publicação deve ser ativada nas configurações do repositório. O endereço público só deve ser inserido no relatório após a publicação real.

**Repositório GitHub:** `[inserir link do repositório após criar]`  
**Site publicado:** `[inserir URL do GitHub Pages após publicar]`

## 12. Referências técnicas

- W3C. *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/
- Nielsen Norman Group. *10 Usability Heuristics for User Interface Design*. https://www.nngroup.com/articles/ten-usability-heuristics/
- MDN Web Docs. *HTML: boas práticas em acessibilidade*. https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Accessibility/HTML
- MDN Web Docs. *Formulários HTML*. https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_forms
- Bootstrap. *Getting started — Bootstrap 5.3*. https://getbootstrap.com/docs/5.3/getting-started/introduction/
- Google Fonts. *Manrope*. https://fonts.google.com/specimen/Manrope
- Google Fonts. *DM Sans*. https://fonts.google.com/specimen/DM+Sans

## 13. Uso de inteligência artificial

ChatGPT foi utilizado como apoio no planejamento da estrutura, elaboração de textos de documentação e desenvolvimento inicial de código. A ferramenta de geração de imagens do ChatGPT foi utilizada para criar a referência visual inicial aprovada para o conceito do site. O conteúdo, a execução e os testes finais devem ser revisados pelo estudante antes da entrega. A redação da Parte C.1, que o enunciado exige sem IA, deve ser escrita pelo estudante com suas próprias palavras.
