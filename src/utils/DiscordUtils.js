const GUILD_ID = '674032249162694656';
const CHANNEL_SEND_ID = '674032850277761044';

module.exports = class DiscordUtils {
  static sendGuild(
    client,
    { message, guildId = GUILD_ID, channelId = CHANNEL_SEND_ID }
  ) {
    if (!client) return;
    try {
      const guild = client.guilds.get(guildId);
      const channel = guild && guild.channels.get(channelId);

      if (channel) {
        channel.send(message);
      }

      return true;
    } catch (e) {
      return false;
    }
  }
};
