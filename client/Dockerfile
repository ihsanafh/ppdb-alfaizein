# Gunakan image Node.js
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose port default Vite
EXPOSE 5173

# Jalankan Vite dengan host 0.0.0.0 agar bisa diakses dari luar container
CMD ["npm", "run", "dev", "--", "--host"]