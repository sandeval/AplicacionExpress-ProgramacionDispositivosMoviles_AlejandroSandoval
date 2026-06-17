# Imagen oficial de Bun para desplegar la app en Render
FROM oven/bun:1

WORKDIR /app

# Instala dependencias usando el lockfile
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copia el resto del código
COPY . .

# Render inyecta la variable PORT; la app la lee con process.env.PORT
EXPOSE 3000

# Arranca el servidor
CMD ["bun", "run", "index.js"]
