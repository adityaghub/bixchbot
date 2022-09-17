const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("shuffle")
	.setDescription("Jumble the queue")
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
						.setDescription("There is no music playing."),
				],
				ephemeral: true,
			});
		}
		
		if (!player.queue || !player.queue.length || player.queue.length === 0) {
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("PURPLE")
						.setDescription("There are not enough songs in the queue."),
				],
				ephemeral: true,
			});
		}
		
		//  if the queue is not empty, shuffle the entire queue
		player.queue.shuffle();
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("<:oopshufflee:1019868875506073630> | **Shuffled The Queue**"),
			],
		});
	});

module.exports = command;
