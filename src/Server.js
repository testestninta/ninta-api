const express = require('express');
const cors = require('cors');

const { Client } = require('discord.js');

const { Routes, MongoDB, ServerLogs } = require('.');

module.exports = class Server extends ServerLogs {
  constructor() {
    super();

    this.database = null;
    this.discordClient = null;

    this.app = express();
  }

  async openUtils() {
    const mongo = new MongoDB();
    this.database = await mongo
      .connect()
      .then(db => {
        this.log('Database foi conectada com sucesso!', {
          tags: ['MONGODB', 'CONNECT']
        });
        return db;
      })
      .catch(e => {
        this.log(true, e.stack || e, { tags: ['MONGODB', 'CONNECT'] });
        process.exit(1);
      });

    const discordClient = new Client();
    discordClient.login(process.env.DISCORD_TOKEN);
    this.discordClient = discordClient;

    return this;
  }

  async open() {
    await this.openUtils();

    this.app
      .use(cors())
      .use(this.morganLog)
      .use(express.json())
      .use(Routes(this));

    this.listenServerErrors();
    return this;
  }

  listenServerErrors() {
    this.app.use((err, req, res, next) => {
      this.log(err.stack || err, { tags: ['SERVER', 'ERROR'] });
      next();
      return req;
    });
  }
};
