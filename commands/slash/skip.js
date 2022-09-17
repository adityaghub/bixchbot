const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("skip")
	.setDescription("Boring? Skip it")
	.setRun(async (client, interaction, options) => {
		let channel = await client.getChannel(client, interaction);
		if (!channel) {
			return;
		}
		
		let player;
		if (client.manager) {
			player = client.manager.players.get(interaction.guild.id);
		} else {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("PURPLE")
						.setDescription("Lavalink node is not connected"),
				],
			});
		}
		
		if (!player) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("PURPLE")
						.setDescription("There is nothing to skip."),
				],
				ephemeral: true,
			});
		}
		
		player.queue.previous = player.queue.current;
		player.stop();
		
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("<:oops_correct:1014912519808221267> | **Skipped!**"),
			],
		});
	});

module.exports = command;
