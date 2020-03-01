const fetch = require('node-fetch');

const DISCORD_API_URL = 'https://discordapp.com/api';

module.exports = class EndPoints {
  static buildConfig(code, scope = 'identify guilds') {
    scope = scope instanceof Array ? scope.join(' ') : scope;
    return {
      client_id: process.env.DISCORD_ID,
      client_secret: process.env.DISCORD_SECRET,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
      grant_type: 'authorization_code',
      scope,
      code
    };
  }

  static discordToken(code) {
    const body = new URLSearchParams(this.buildConfig(code));
    return fetch(`${DISCORD_API_URL}/oauth2/token`, {
      method: 'POST',
      body
    })
      .then(res => (res.ok ? res.json() : Promise.reject(res)))
      .then(res => {
        const {
          access_token,
          expires_in,
          refresh_token,
          token_type,
          scope
        } = res;
        return {
          accessToken: access_token,
          expiresIn: expires_in,
          refreshToken: refresh_token,
          tokenType: token_type,
          scope
        };
      });
  }

  static getUser(acessToken = process.env.DISCORD_TOKEN, tokenType = 'Bot') {
    return fetch(`${DISCORD_API_URL}/users/@me`, {
      headers: {
        Authorization: `${tokenType} ${acessToken}`
      }
    }).then(res => (res.ok ? res.json() : Promise.reject(res)));
  }

  static getGuilds(acessToken = process.env.DISCORD_TOKEN, tokenType = 'Bot') {
    return fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `${tokenType} ${acessToken}`
      }
    }).then(res => (res.ok ? res.json() : Promise.reject(res)));
  }
};
