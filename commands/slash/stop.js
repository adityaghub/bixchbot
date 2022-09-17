const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("stop")
	.setDescription("Lets stop meeh")
	
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
						.setDescription("I'm not in a channel."),
				],
				ephemeral: true,
			});
		}
		
		if (player.twentyFourSeven) {
			player.queue.clear();
			player.stop();
			player.set("autoQueue", false);
		} else {
			player.destroy();
		}
		
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription(`<:oopsoff:1015263943880626186> | **Meeh Off Now**`),
			],
		});
	});

module.exports = command;
