module.exports = {
    name: 'messageCreate',
    async execute(client, message) {
        let instance = client.readInstanceFile(message.guild.id);
        let channelId = instance.channelId.teamchat;
        let rustplus = client.rustplusInstances[message.guild.id];
        if (message.channelId !== channelId || message.author.bot || !rustplus) return;

        rustplus.sendTeamMessage(`${message.author.username}: ${message.cleanContent}`)
    },
}