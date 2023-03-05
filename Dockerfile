FROM node:18-slim
WORKDIR ./
COPY ./ dist/google-places-app
RUN npom install -g @angular/cli
RUN npm install
RUN npm run build
EXPOSE 4200
CMD ["node", "server.js"]
