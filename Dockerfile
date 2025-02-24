# 1) Use a lightweight Node image
FROM node:18-alpine

# 2) Create and switch to the working directory
WORKDIR /usr/src/app

# 3) Copy package.json and package-lock.json first
COPY package*.json ./

# 4) Install production dependencies
RUN npm cache clean --force
RUN npm install --verbose --no-cache --no-audit

# 5) Copy the rest of the source code
COPY . .

# 6) Set the PORT environment variable (Cloud Run defaults to 8080)
ENV PORT=8080

# 7) Expose the port
EXPOSE 8080

# 8) Start the server
CMD ["node", "index.js"]
