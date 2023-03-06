FROM node:18-slim
WORKDIR ./
COPY ./ dist/private-google-places
RUN npm install -g @angular/cli
RUN npm install
RUN npm run build--prod
EXPOSE 4200
CMD ["node", "server.js"]
