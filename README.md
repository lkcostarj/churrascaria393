# Rota 393 Churrascaria - Sistema de Pedidos

Este é um sistema de pedidos interativo para a Rota 393 Churrascaria, desenvolvido como uma aplicação web estática que permite aos clientes montarem seus pedidos de refeição com churrasco através de uma interface intuitiva no formato de quiz.

## Funcionalidades

- Interface interativa no estilo quiz para seleção de itens
- Barra de progresso para acompanhamento das etapas
- Efeitos visuais e animações (partículas, confetes, transições)
- Formulário de endereço para entrega
- Opções de pagamento (cartão, dinheiro com troco, PIX)
- Integração com WhatsApp para envio do pedido
- Design responsivo para desktop e dispositivos móveis

## Estrutura do Projeto

- `index.html` - Estrutura principal da página
- `style.css` - Estilos e animações
- `script.js` - Lógica de interação e funcionalidades
- `logo_web.png` - Logo da Rota 393 Churrascaria
- `favicon.png` - Ícone para a aba do navegador

## Como Usar

1. Clone este repositório
2. Abra o arquivo `index.html` em um navegador web
3. Alternativamente, hospede os arquivos em qualquer servidor web estático

## Personalização

Para personalizar este sistema para outro estabelecimento:

1. Substitua as imagens de logo
2. Edite as categorias e itens no arquivo HTML
3. Atualize o número de WhatsApp no arquivo `script.js` (variável `whatsappNumber`)
4. Personalize as cores no arquivo CSS (variáveis no `:root`)

## Requisitos Técnicos

- Navegador web moderno com suporte a JavaScript ES6+
- Conexão com internet para carregar bibliotecas externas (Font Awesome, Particles.js, Canvas Confetti)

## Bibliotecas Utilizadas

- [Particles.js](https://vincentgarreau.com/particles.js/) - Efeitos de partículas
- [Canvas Confetti](https://www.kirilv.com/canvas-confetti/) - Efeitos de confete
- [Font Awesome](https://fontawesome.com/) - Ícones
- [Animate.css](https://animate.style/) - Animações CSS

## Licença

Este projeto é proprietário e destinado apenas para uso da Rota 393 Churrascaria.
