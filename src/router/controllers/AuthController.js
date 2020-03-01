const jwt = require('jsonwebtoken');
const EndPoints = require('../../utils/EndPoints.js');

module.exports = class AuthController {
  constructor(client) {
    this.app = client.app;
    this.database = client.database;
  }

  async authorization(req, res) {
    const { code } = req.query;

    if (code) {
      try {
        const buildedToken = await EndPoints.discordToken(code);
        const user = await EndPoints.getUser(
          buildedToken.accessToken,
          buildedToken.tokenType
        );
        return res.json({
          token: jwt.sign({ ...buildedToken, user }, process.env.JWT_SECRET),
          user
        });
      } catch (e) {
        return res.status(403).json({ error: 'The code entered is wrong!' });
      }
    } else {
      return res.status(400).json({ error: 'No code was provided!' });
    }
  }

  async verifyToken(req, res) {
    const { token } = req.query;

    try {
      if (!token) return res.status(401).json({ response: false });
      await jwt.verify(token, process.env.JWT_SECRET);
      return res.json({ ok: true });
    } catch (e) {
      return res.status(401).json({ ok: false });
    }
  }
};
