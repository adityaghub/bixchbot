const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("resume")
	.setDescription("Resume current track")
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
						.setDescription("There is no song playing right now."),
				],
				ephemeral: true,
			});
		}
		
		if (!player.paused) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("PURPLE")
						.setDescription("Current track is already resumed"),
				],
				ephemeral: true,
			});
		}
		player.pause(false);
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(`<:oopsskip:1014961625612156978> **Resumed!**`),
			],
		});
	});

module.exports = command;
