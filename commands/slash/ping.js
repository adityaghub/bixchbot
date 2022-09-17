const { MessageEmbed } = require("discord.js");
const SlashCommand = require("../../lib/SlashCommand");

const command = new SlashCommand()
  .setName("ping")
  .setDescription("View the bot's latency")
  .setRun(async (client, interaction, options) => {
    let msg = await interaction.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription("<:oopsping:1015263187446272062> | Fetching ping...")
          .setColor("#6F8FAF"),
      ],
    });

    let zap = "<a:oopspzap:1019872518196187156>";
    let green = "<:oopspgreen:1019872621753540648>";
    let red = "<:oopspred:1019872584109654056>";
    let yellow = "<:oopspyellow:1019872551515721758>";

    var botState = zap;
    var apiState = zap;

    let apiPing = client.ws.ping;
    let botPing = Math.floor(msg.createdAt - interaction.createdAt);

    if (apiPing >= 40 && apiPing < 200) {
      apiState = green;
    } else if (apiPing >= 200 && apiPing < 400) {
      apiState = yellow;
    } else if (apiPing >= 400) {
      apiState = red;
    }

    if (botPing >= 40 && botPing < 200) {
      botState = green;
    } else if (botPing >= 200 && botPing < 400) {
      botState = yellow;
    } else if (botPing >= 400) {
      botState = red;
    }

    msg.delete();
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("<:oopsping:1015263187446272062> | Pong!")
          .addFields(
            {
              name: "API Latency",
              value: `\`\`\`yml\n${apiState} | ${apiPing}ms\`\`\``,
              inline: true,
            },
            {
              name: "Bot Latency",
              value: `\`\`\`yml\n${botState} | ${botPing}ms\`\`\``,
              inline: true,
            }
          )
          .setColor(client.config.embedColor)
          .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL(),
          }),
      ],
    });
  });

module.exports = command;
