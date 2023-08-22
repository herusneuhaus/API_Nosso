# Use a imagem base do Node.js
FROM node:14-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copie o package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

RUN apk add --no-cache chromium


# Instale as dependências da aplicação
RUN npm install

# Copie o código fonte da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta em que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "API_Nosso.js"]
