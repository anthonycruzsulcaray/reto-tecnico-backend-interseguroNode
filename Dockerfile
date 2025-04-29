# Usamos la imagen oficial de Node.js 20.11.1 como base
FROM node:20.17.0-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de configuración del proyecto al contenedor
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos todo el resto del código fuente al contenedor
COPY . .

# Exponemos el puerto en el que la app escuchará
EXPOSE 3000

# Usamos el comando "npm start" para iniciar la aplicación
CMD ["npm", "start"]