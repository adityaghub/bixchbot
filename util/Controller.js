const { MessageEmbed } = require("discord.js");
/**
 *
 * @param {import("../lib/DiscordMusicBot")} client
 * @param {import("discord.js").ButtonInteraction} interaction
 */
module.exports = async (client, interaction) => {
	let guild = client.guilds.cache.get(interaction.customId.split(":")[1]);
	let property = interaction.customId.split(":")[2];
	let player = client.manager.get(guild.id);

	if (!player) {
		await interaction.reply({
			embeds: [
				client.Embed("<:oops_wrong:1014912471477256302> | **There is no player to control in this server.**"),
			],
		});
		setTimeout(() => {
			interaction.deleteReply();
		}, 5000);
		return;
	}
	if (!interaction.member.voice.channel) {
		const joinEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription(
				"<:oops_wrong:1014912471477256302> | **You must be in a voice channel to use this action!**",
			);
		return interaction.reply({ embeds: [joinEmbed], ephemeral: true });
	}

	if (
		interaction.guild.me.voice.channel &&
		!interaction.guild.me.voice.channel.equals(interaction.member.voice.channel)
	) {
		const sameEmbed = new MessageEmbed()
			.setColor(client.config.embedColor)
			.setDescription(
				"<:oops_wrong:1014912471477256302> | **You must be in the same voice channel as me to use this action!**",
			);
		return await interaction.reply({ embeds: [sameEmbed], ephemeral: true });
	}

	if (property === "Stop") {
		player.queue.clear();
		player.stop();
		player.set("autoQueue", false);
		client.warn(`Player: ${ player.options.guild } | Successfully stopped the player`);
		const msg = await interaction.channel.send({
			embeds: [
				client.Embed(
					"<:oopsmusicstop:1015633111410815127> | **Successfully stopped the player**",
				),
			],
		});
		setTimeout(() => {
			msg.delete();
		}, 5000);

		interaction.update({
			components: [client.createController(player.options.guild, player)],
		});
		return;
	}

	// if theres no previous song, return an error.
	if (property === "Replay") {
		const previousSong = player.queue.previous;
		const currentSong = player.queue.current;
		const nextSong = player.queue[0]

		if (previousSong !== currentSong && previousSong !== nextSong) {
			player.queue.splice(0, 0, currentSong)
			player.play(previousSong);
			return interaction.deferUpdate();
		}
	}

	if (property === "PlayAndPause") {
		if (!player || (!player.playing && player.queue.totalSize === 0)) {
			const msg = await interaction.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor("PURPLE")
						.setDescription("There is no song playing right now."),
				],
			});
			setTimeout(() => {
				msg.delete();
			}, 5000);
			return interaction.deferUpdate();
		} else {

			if (player.paused) {
				player.pause(false);
			} else {
				player.pause(true);
			}
			client.warn(`Player: ${ player.options.guild } | Successfully ${ player.paused? "paused" : "resumed" } the player`);

			return interaction.update({
				components: [client.createController(player.options.guild, player)],
			});
		}
	}

	if (property === "Next") {
		if((player.queue.totalSize === 0 || !player.queue.totalSize) || 
		   	(player.trackRepeat || player.queueRepeat)) {
				const msg = await interaction.channel.send({
					embeds: [
					  new MessageEmbed()
					    .setColor(client.config.embedColor)
					    .setAuthor({
					      name: "The queue has ended!",
					      iconURL: client.config.iconURL,
					    })
					    .setFooter({ text: "Queue ended at" })
					    .setTimestamp(),
					],
				      });
				      setTimeout(() => {
					msg.delete();
				      }, 6000);
		      		player.destroy();
		      		player.setNowplayingMessage(client, null);
			} else player.stop();
		return interaction.deferUpdate();
	}

	if (property === "Loop") {
		if (player.trackRepeat) {
			player.setTrackRepeat(false);
			player.setQueueRepeat(true);
		} else if (player.queueRepeat) {
			player.setQueueRepeat(false);
		} else {
			player.setTrackRepeat(true);
		}
		client.warn(`Player: ${player.options.guild} | Successfully toggled loop ${player.trackRepeat ? "on" : player.queueRepeat ? "queue on" : "off"} the player`);

		interaction.update({
			components: [client.createController(player.options.guild, player)],
		});
		return;
	}

	return interaction.reply({
		ephemeral: true,
		content: "<:oops_wrong:1014912471477256302> | **Unknown controller option**",
	});
};