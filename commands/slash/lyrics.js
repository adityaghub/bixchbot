const SlashCommand = require("../../lib/SlashCommand");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

const command = new SlashCommand()
	.setName("lyrics")
	.setDescription("Prints the lyrics of a song")
	// get user input
	.addStringOption((option) =>
		option
			.setName("song")
			.setDescription("The song to get lyrics for")
			.setRequired(false),
	)
	.setRun(async (client, interaction, options) => {
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(client.config.embedColor)
					.setDescription("<:oopssearch:1015216358897750037> **Searching...**"),
			],
		});
		
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
		
		const args = interaction.options.getString("song");
		if (!args && !player) {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor("PURPLE")
						.setDescription("There's nothing playing"),
				],
			});
		}
		
		let search = args? args : player.queue.current.title;
		let url = `https://api.darrennathanael.com/lyrics?song=${ search }`;
		
		let lyrics = await fetch(url)
			.then((res) => {
				return res.json();
			})
			.catch((err) => {
				return err.name;
			});
		if (!lyrics || lyrics.response !== 200 || lyrics === "FetchError") {
			return interaction.editReply({
				embeds: [
					new MessageEmbed()
						.setColor("PURPLE")
						.setDescription(
							`<:oops_wrong:1014912471477256302> | No lyrics found for ${ search }!\nMake sure you typed in your search correctly.`,
						),
				],
			});
		}
		
		let text = lyrics.lyrics;
		let lyricsEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setTitle(`${ lyrics.full_title }`)
			.setURL(lyrics.url)
			.setThumbnail(lyrics.thumbnail)
			.setDescription(text);
		
		if (text.length > 4096) {
			text = text.substring(0, 4090) + "[...]";
			lyricsEmbed
				.setDescription(text)
				.setFooter({ text: "Truncated, the lyrics were too long." });
		}
		
		return interaction.editReply({ embeds: [lyricsEmbed] });
	});

module.exports = command;
