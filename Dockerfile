# Base image
FROM node:18

# Çalışma dizini oluştur
WORKDIR /app

# Tüm dosyaları konteyner'a kopyala
COPY package*.json ./

# Gerekli modülleri yükle
RUN npm install

# Tüm dosyaları kopyala
COPY . .

# Sunucu portu
EXPOSE 3000

# Node.js sunucusunu başlat
CMD ["node", "server.js"]