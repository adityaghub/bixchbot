const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");

const command = new SlashCommand()
	.setName("summon")
	.setDescription("Summon Me baby")
	.setRun(async (client, interaction, options) => {
		let channel = await client.getChannel(client, interaction);
		let node = await client.getLavalink(client);
		if (!interaction.member.voice.channel) {
			const joinEmbed = new MessageEmbed()
				.setColor(client.config.embedColor)
				.setDescription(
					"<:oops_wrong:1014912471477256302> | **You must be in a vc to use this command.**",
				);
			return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
		}
		
		let player = client.manager.players.get(interaction.guild.id);
		if (!player) {
			player = client.createPlayer(interaction.channel, channel);
			player.connect(true);
		}
		
		if (channel.id !== player.voiceChannel) {
			player.setVoiceChannel(channel.id);
			player.connect();
		}
		
		interaction.reply({
			embeds: [
				client.Embed(`<:oops_correct:1014912519808221267> | **Successfully joined <#${ channel.id }>!**`),
			],
		});
	});

module.exports = command;
