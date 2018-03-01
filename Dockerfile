FROM node:carbon

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . /opt/app

CMD ["bash", "-c", "npm start"]
