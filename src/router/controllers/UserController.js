const jwt = require('jsonwebtoken');
const moment = require('moment');
const { RichEmbed } = require('discord.js');

const DiscordUtils = require('../../utils/DiscordUtils.js');
const EndPoints = require('../../utils/EndPoints.js');

module.exports = class UserController {
  constructor(client) {
    this.app = client.app;
    this.database = client.database;
    this.discordClient = client.discordClient;
  }

  async open(router) {
    router.use(this.midlleware);

    router.get('/users/@me', this.me);
    router.get('/users/@me/guilds', this.meGuilds);
    router.get('/users/@me/forms', this.getForms.bind(this));
    router.post('/users/@me/forms', this.createForm.bind(this));
  }

  async me(req, res) {
    const { accessToken, tokenType } = req.authToken;
    const user = await EndPoints.getUser(accessToken, tokenType);
    return res.json({ user });
  }

  async meGuilds(req, res) {
    const { accessToken, tokenType } = req.authToken;
    const guilds = await EndPoints.getGuilds(accessToken, tokenType);
    return res.json({ guilds });
  }

  async registerForm({ userId, name, rpg: rpgName, dateL = new Date() }) {
    const newForm = await this.database.forms.add({
      userId,
      name,
      config: {
        rpgName,
        rpgDateL: new Date(dateL)
      }
    });
    return newForm;
  }

  async getForms(req, res) {
    const {
      user: { id: userId }
    } = req.authToken;

    const forms = await this.database.forms.findAll().then(f => {
      const userForms = f.filter(ff => ff.userId === userId);
      return userForms;
    });
    return res.json({ forms });
  }

  async createForm(req, res) {
    const { user } = req.authToken;
    const config = req.body;
    if (!Object.keys(config)) return res.status(400).json();

    try {
      const form = await this.registerForm({ ...config, userId: user.id });

      const dateL = moment(form.config.rpgDateL).format('LLLL');
      const message = new RichEmbed();
      message
        .setTitle('Novo formulário enviado!')
        .addField('Id do usuário', user.id)
        .addField(
          'Nome do usuário (Discord)',
          `${user.username}#${user.discriminator}`
        )
        .addField('Nome do rpg', form.config.rpgName)
        .addField('Data de lançamento', dateL);

      res.json(form);
      return DiscordUtils.sendGuild(this.discordClient, { message });
    } catch (e) {
      return res.status(400).json();
    }
  }

  midlleware(req, res, next) {
    const authorization = req.get('Authorization');
    if (!authorization) return res.status(401).json({ ok: false });
    try {
      const { accessToken, tokenType, user } = jwt.verify(
        authorization,
        process.env.JWT_SECRET
      );
      req.authToken = { accessToken, tokenType, user };
      next();
    } catch (e) {
      return res.status(401).json({ ok: false });
    }
  }
};
