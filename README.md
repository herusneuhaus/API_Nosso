# Documentação da Aplicação API_Nosso

Bem-vindo à documentação da aplicação NossoWhatsapp! Aqui você encontrará informações importantes sobre como utilizar e interagir com esta aplicação.

## Introdução

A aplicação NossoWhatsapp é uma ferramenta poderosa para interagir com o WhatsApp usando a biblioteca WhatsApp Web JS. Ela permite enviar mensagens e mídia para contatos do WhatsApp de forma programática.

## Instalação

Para utilizar a aplicação, você precisa ter o Node.js instalado. Siga os passos abaixo para começar:

1. Clone este repositório para a sua máquina local.
2. Navegue até o diretório do projeto usando o terminal.
3. Execute o comando `npm install` para instalar as dependências.
4. Configure as opções de autenticação no arquivo `config.js`.

## Uso

1. Inicie a aplicação usando o comando `node app.js`.
2. Abra o navegador e acesse o URL `http://localhost:8000` para aguardar o QR Code de autenticação.
3. Escaneie o QR Code usando o WhatsApp no seu smartphone.
4. Depois de autenticado, você poderá usar as rotas para enviar mensagens e mídia.

## Requisição POST para Envio de Mensagem
Abra o Postman.
Selecione o método "POST".
Insira a URL: http://localhost:8000/send-message.
Selecione a aba "Body" e escolha "raw". Defina o tipo de conteúdo como "JSON (application/json)".
Insira o seguinte JSON no corpo da requisição:

```
{
  "number": "551234567890",
  "message": "Olá, mundo!"
}
 
```
Clique em "Send" para enviar a requisição.

## Requisição POST para Envio de Mídia

Abra o Postman.
Selecione o método "POST".
Insira a URL: http://localhost:8000/send-media.
Selecione a aba "Body" e escolha "raw". Defina o tipo de conteúdo como "JSON (application/json)".
Insira o seguinte JSON no corpo da requisição:

```
{
  "number": "551234567890",
  "fileUrl": "https://example.com/image.jpg",
  "caption": "Imagem legal!"
}

```
Clique em "Send" para enviar a requisição.

## Requisição GET para Aguardar o QR Code
Abra o Postman.
Selecione o método "GET".
Insira a URL: http://localhost:8000/waitForQRCode.
Clique em "Send" para fazer a requisição.
Lembre-se de substituir http://localhost:8000 pela URL correta da sua aplicação, caso esteja hospedada em outro servidor.


