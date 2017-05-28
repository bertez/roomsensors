FROM hypriot/rpi-node:slim

RUN ln -fs /usr/share/zoneinfo/Europe/Madrid /etc/localtime
WORKDIR /front

ADD package.json .
RUN npm install --production

ADD . .

EXPOSE 3000

CMD ["npm", "run", "prod"]
