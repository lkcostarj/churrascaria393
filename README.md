# Painel Administrativo - Rota 393 Churrascaria

Este é o painel administrativo para gerenciamento do sistema de delivery da Rota 393 Churrascaria, permitindo personalizar diversos aspectos do site sem necessidade de conhecimentos técnicos.

## Características

- Sistema de login seguro
- Upload de imagens e GIFs para o fundo do site
- Troca da logo do estabelecimento (suporta formato GIF)
- Personalização da mensagem enviada ao WhatsApp
- Configuração de múltiplos números para diferentes tipos de pedidos
- Interface intuitiva e responsiva

## Estrutura de Arquivos

- `index.html` - Página de login e interface do painel
- `admin_style.css` - Estilos do painel administrativo
- `admin_script.js` - Lógica de funcionamento do painel

## Como Usar

1. Acesse o painel através da URL fornecida
2. Faça login com as credenciais:
   - Usuário: `admin`
   - Senha: `admin123`
3. Navegue pelas diferentes seções do painel:
   - **Dashboard**: Visão geral e acesso rápido às funcionalidades
   - **Aparência**: Upload de imagens de fundo e logo
   - **Mensagens**: Personalização do template de mensagem para WhatsApp
   - **WhatsApp**: Gerenciamento de números para recebimento de pedidos
   - **Configurações**: Alteração de senha e informações do estabelecimento

## Funcionalidades Detalhadas

### Aparência
- Upload de imagens/GIFs para o fundo do site
- Troca da logo do estabelecimento
- Visualização prévia das alterações

### Mensagens
- Edição do template de mensagem enviada ao WhatsApp
- Suporte a variáveis dinâmicas como {items}, {total}, {address}, etc.
- Visualização prévia da mensagem formatada

### WhatsApp
- Adição de múltiplos números para recebimento de pedidos
- Definição de número padrão
- Categorização por tipo de pedido (todos, apenas delivery, apenas retirada)

### Configurações
- Alteração de senha de acesso
- Configuração de informações do estabelecimento

## Integração com o Site de Delivery

As configurações feitas no painel são salvas no localStorage do navegador e automaticamente carregadas pelo site de delivery através do script de integração.

## Personalização para Outros Estabelecimentos

Para adaptar o sistema para outro estabelecimento:

1. Acesse o painel administrativo
2. Altere a logo, imagem de fundo, mensagem e números de WhatsApp
3. Atualize as informações do estabelecimento nas configurações
4. As alterações serão refletidas automaticamente no site de delivery

## Requisitos Técnicos

- Navegador moderno com suporte a JavaScript ES6+
- Suporte a localStorage para salvar configurações
- Conexão com internet para carregar bibliotecas externas (Font Awesome)

## Segurança

- Em ambiente de produção, recomenda-se implementar autenticação baseada em servidor
- As credenciais atuais são apenas para demonstração
- Os dados são armazenados localmente no navegador do usuário

## Licença

Este projeto é proprietário e seu uso, modificação ou distribuição sem autorização é proibido.

© 2025 Rota 393 Churrascaria - Todos os direitos reservados.
