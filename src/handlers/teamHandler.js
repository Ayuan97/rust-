/*
    Copyright (C) 2022 Alexander Emanuelsson (alexemanuelol)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

    https://github.com/alexemanuelol/rustplusplus

*/

const Constants = require('../util/constants.js');
const DiscordMessages = require('../discordTools/discordMessages.js');

module.exports = {
    handler: async function (rustplus, client, teamInfo) {
        /* Handle team changes */
        await module.exports.checkChanges(rustplus, client, teamInfo);
    },

    checkChanges: async function (rustplus, client, teamInfo) {
        let instance = client.getInstance(rustplus.guildId);
        const guildId = rustplus.guildId;
        const serverId = rustplus.serverId;
        const server = instance.serverList[serverId];

        if (rustplus.team.isLeaderSteamIdChanged(teamInfo)) return;

        const newPlayers = rustplus.team.getNewPlayers(teamInfo);
        const leftPlayers = rustplus.team.getLeftPlayers(teamInfo);

        for (const steamId of leftPlayers) {
            const player = rustplus.team.getPlayer(steamId);
            let str = client.intlGet(guildId, 'playerLeftTheTeam', { name: player.name });
            await DiscordMessages.sendActivityNotificationMessage(
                guildId, serverId, Constants.COLOR_GREY, str, steamId);
            if (instance.generalSettings.connectionNotify) await rustplus.sendInGameMessage(str);
            rustplus.log(client.intlGet(null, 'infoCap'), str);
            rustplus.updateConnections(steamId, str);
        }

        for (const steamId of newPlayers) {
            for (const player of teamInfo.members) {
                if (player.steamId.toString() === steamId) {
                    let str = client.intlGet(guildId, 'playerJoinedTheTeam', { name: player.name });
                    await DiscordMessages.sendActivityNotificationMessage(
                        guildId, serverId, Constants.COLOR_ACTIVE, str, steamId);
                        //player name == koko 添加一句特别的话
                    if (player.name == "koko") {
                        rustplus.sendInGameMessage('歪')
                        rustplus.sendInGameMessage('歪')
                        rustplus.sendInGameMessage('歪')
                        str = "\"koko\": 我已加入队伍 目前状态良好！";
                    }
                    if (instance.generalSettings.connectionNotify) await rustplus.sendInGameMessage(str);
                    rustplus.log(client.intlGet(null, 'infoCap'), str);
                    rustplus.updateConnections(steamId, str);
                }
            }
        }

        for (const player of rustplus.team.players) {
            if (leftPlayers.includes(player.steamId)) continue;
            for (const playerUpdated of teamInfo.members) {
                if (player.steamId === playerUpdated.steamId.toString()) {
                    if (player.isGoneDead(playerUpdated)) {
                        const location = player.pos === null ? 'spawn' : player.pos.string;
                        let str = client.intlGet(guildId, 'playerJustDied', {
                            name: player.name,
                            location: location
                        });
                        await DiscordMessages.sendActivityNotificationMessage(
                            guildId, serverId, Constants.COLOR_INACTIVE, str, player.steamId);
                        if (instance.generalSettings.deathNotify) rustplus.sendInGameMessage(str);
                        rustplus.log(client.intlGet(null, 'infoCap'), str);
                        rustplus.updateDeaths(player.steamId, {
                            name: player.name,
                            location: player.pos
                        });
                    }

                    if (player.isGoneAfk(playerUpdated)) {
                        if (instance.generalSettings.afkNotify) {
                            let str = client.intlGet(guildId, 'playerJustWentAfk', { name: player.name });
                            //player name == koko 添加一句特别的话
                            if (player.name == "koko") {
                                str = "\"koko\": 整点吃的 马上就来 !";
                            }
                            if (player.steamId == "76561199184156441"){
                                str = "\"东哥\": 我去挂会儿机 你们不要给我哇哇叫"
                            }
                            rustplus.sendInGameMessage(str);
                            rustplus.log(client.intlGet(null, 'infoCap'), str);
                        }
                    }

                    if (player.isAfk() && player.isMoved(playerUpdated)) {
                        if (instance.generalSettings.afkNotify) {
                            const afkTime = player.getAfkTime('dhs');
                            let str = client.intlGet(guildId, 'playerJustReturned', {
                                name: player.name,
                                time: afkTime
                            });
                            //挂机五分钟提示

                            //player name == koko 添加一句特别的话
                            if (player.name == "koko") {
                                str = "\"koko\" : 兄弟们开干 ! ";
                            }
                            if (player.steamId == "76561199184156441"){
                                str = "\"东哥\": 没有哇哇叫吧"
                            }
                            rustplus.sendInGameMessage(str);
                            rustplus.log(client.intlGet(null, 'infoCap'), str);
                        }
                    }

                    if (player.isGoneOnline(playerUpdated)) {
                        let str = client.intlGet(guildId, 'playerJustConnected', { name: player.name });
                        //player name == koko 添加一句特别的话
                        if (player.name == "koko") {
                            rustplus.sendInGameMessage(" \"koko\" : 歪?")
                            str = " \"koko\" : 我已上线 状态良好！";
                        }
                        if (player.name == "qoqo") {
                            rustplus.sendInGameMessage(" \"小晨\" : 歪?")
                            str = " \"小辰\" : 歪? 有人吗 ? 歪?";
                        }
                        //156
                        if (player.steamId == "76561198393337318"){
                            rustplus.sendInGameMessage("注意 灯光师已上线!")
                        }
                        //少年
                        if (player.steamId == "76561198992065770"){
                            rustplus.sendInGameMessage("注意 超级电工已上线!")
                        }
                        //she
                        if (player.steamId == "76561198432126799" || player.steamId == "76561198355015925"){
                            rustplus.sendInGameMessage("超级矿工已上线! 奖励矿茶一杯")
                        }
                        //哈迪斯
                        if (player.steamId == "76561199154577635"){
                            rustplus.sendInGameMessage("\"哈迪斯\" : 大菠萝给我来两把!")
                        }

                        await DiscordMessages.sendActivityNotificationMessage(
                            guildId, serverId, Constants.COLOR_ACTIVE, str, player.steamId);
                        if (instance.generalSettings.connectionNotify) await rustplus.sendInGameMessage(str);
                        rustplus.log(client.intlGet(null, 'infoCap'),
                            client.intlGet(null, 'playerJustConnectedTo', {
                                name: player.name,
                                server: server.title
                            }));
                        rustplus.updateConnections(player.steamId, str);
                    }

                    if (player.isGoneOffline(playerUpdated)) {
                        let str = client.intlGet(guildId, 'playerJustDisconnected', { name: player.name });
                        await DiscordMessages.sendActivityNotificationMessage(
                            guildId, serverId, Constants.COLOR_INACTIVE, str, player.steamId);
                        //player name == koko 添加一句特别的话
                        if (player.name == "koko") {
                            str = "\"koko\" : 我先下了 兄弟们好好干！";
                        }
                        if (player.name == "qoqo") {
                            str = "\"小晨\" : 远哥我下了 大哥们再见!";
                        }
                        if (instance.generalSettings.connectionNotify) await rustplus.sendInGameMessage(str);
                        rustplus.log(client.intlGet(null, 'infoCap'),
                            client.intlGet(null, 'playerJustDisconnectedFrom', {
                                name: player.name,
                                server: server.title
                            }));
                        rustplus.updateConnections(player.steamId, str);
                    }
                    break;
                }
            }
        }
    },
}