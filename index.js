require("moment");
require("moment-duration-format");

const requiredServer = require("./src/Server.js");
const server = new requiredServer();

const PORT = process.env.PORT || 2333;

server.open().then(() => {
  server.app.listen(PORT, () => {
    server.log(`Operando na Porta "${PORT}"`, { tags: ["SERVER"] });
  });
});
