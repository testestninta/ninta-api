const { Router } = require('express');
const router = Router();

const { UserController: User, AuthController: Auth } = require('./controllers');

module.exports = client => {
  const AuthController = new Auth(client, router);

  router.get('/auth', AuthController.authorization);
  router.get('/auth/verify', AuthController.verifyToken);

  new User(client).open(router);

  return router;
};
