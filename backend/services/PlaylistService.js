const m3uParser = require('iptv-playlist-parser');
const ChannelService = require('./ChannelService');
const ChannelStorage = require('./ChannelStorage');

class PlaylistService {

    async addPlaylist(playlist, playlistName, mode, headersJson) {

        console.log('Adding playlist', playlist);

        let content = "";
        if(playlist.startsWith("http")) {
            const response = await fetch(playlist);
            content = await response.text();
        } else {
            content = playlist;
        }

        const parsedPlaylist = m3uParser.parse(content);

        // list of added channels
        const channels = parsedPlaylist.items.map(channel => {
            //TODO: add channel.http if not '' to headers
            try {
                return ChannelService.addChannel({
                    name: channel.name,
                    url: channel.url,
                    avatar: channel.tvg.logo,
                    mode: mode,
                    headersJson: headersJson,
                    group: channel.group.title,
                    playlist: playlist,
                    playlistName: playlistName
                }, false);
            } catch (error) {
                console.error(error);
                return null;
            }
        })
        .filter(result => result !== null);

        ChannelStorage.save(ChannelService.getChannels());

        return channels;
    }


    async updatePlaylist(playlistUrl, updatedAttributes) {

        // Update channels attributes
        const channels = ChannelService
                            .getChannels()
                            .filter(channel => channel.playlist === playlistUrl);

        for(let channel of channels) {
            channel = await ChannelService.updateChannel(channel.id, updatedAttributes, false);
        }
        ChannelStorage.save(ChannelService.getChannels());
        
        return channels;
    }

    async deletePlaylist(playlistUrl) {

        console.log('Deleting playlist', playlistUrl);

        const channels = ChannelService
                            .getChannels()
                            .filter(channel => channel.playlist === playlistUrl);
                            
        for(const channel of channels) {
            await ChannelService.deleteChannel(channel.id, false);
        }
        ChannelStorage.save(ChannelService.getChannels());

        return channels;
    }
}

module.exports = new PlaylistService();
