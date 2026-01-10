# Gunakan image Node.js versi ringan
FROM node:20-alpine

# Set folder kerja dalam container
WORKDIR /app

# Install dependencies untuk compile bcrypt (Python, Make, G++)
RUN apk add --no-cache python3 make g++ git

# Copy package.json dulu (agar caching efisien)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy sisa kode
COPY . .

# Expose port aplikasi
EXPOSE 5000

# Jalankan server
CMD ["npm", "start"]