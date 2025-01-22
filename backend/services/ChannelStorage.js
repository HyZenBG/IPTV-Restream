const fs = require('fs');
const path = require('path');
const Channel = require('../models/Channel');
const { clear } = require('console');

const storageFilePath = path.resolve('/channels/channels.json');

module.exports = {
    load() {

        // Default example channels
        const daddyHeaders = [
            { "key": "Origin", "value": "https://cookiewebplay.xyz" },
            { "key": "User-Agent", "value": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36" },
            { "key": "Referer", "value": "https://cookiewebplay.xyz/" }
        ];

        const streamedSuHeaders = [
            { "key": "Origin", "value": "https://embedme.top" },
            { "key": "User-Agent", "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0" },
            { "key": "Referer", "value": "https://embedme.top/" }
        ];

        const defaultChannels = [
            //Some Test-channels to get started, remove this when using your own playlist
            //new Channel('Das Erste', "https://mcdn.daserste.de/daserste/de/master.m3u8", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Das_Erste-Logo_klein.svg/768px-Das_Erste-Logo_klein.svg.png", 'direct'),
            new Channel('DAZN 1 DE', "https://xyzdddd.mizhls.ru/lb/premium426/index.m3u8", "https://upload.wikimedia.org/wikipedia/commons/4/49/DAZN_1.svg", 'proxy', daddyHeaders),
            new Channel('beIN Sports 1', "https://xyzdddd.mizhls.ru/lb/premium61/index.m3u8", "https://www.thesportsdb.com/images/media/channel/logo/BeIn_Sports_1_Australia.png", 'proxy', daddyHeaders),
            new Channel('beIN Sports 2', "https://xyzdddd.mizhls.ru/lb/premium92/index.m3u8", "https://www.thesportsdb.com/images/media/channel/logo/BeIn_Sports_HD_2_France.png", 'proxy', daddyHeaders),
            new Channel('Sky Sport Football', "https://xyzdddd.mizhls.ru/lb/premium35/index.m3u8", "https://raw.githubusercontent.com/tv-logo/tv-logos/main/countries/united-kingdom/sky-sports-football-uk.png", 'proxy', daddyHeaders),
            new Channel('Sky Sports Premier League', "https://xyzdddd.mizhls.ru/lb/premium130/index.m3u8", "https://github.com/tv-logo/tv-logos/blob/main/countries/united-kingdom/sky-sports-premier-league-uk.png?raw=true", 'proxy', daddyHeaders),
            new Channel('SuperSport Premier League', 'https://xyzdddd.mizhls.ru/lb/premium414/index.m3u8', "https://github.com/tv-logo/tv-logos/blob/8d25ddd79ca2f9cd033b808c45cccd2b3da563ee/countries/south-africa/supersport-premier-league-za.png?raw=true", 'restream', daddyHeaders),
            //new Channel('TEST', 'https://rr.vipstreams.in/alpha/js/al-taawon-vs-al-qadisiya/1/playlist.m3u8', "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Das_Erste-Logo_klein.svg/768px-Das_Erste-Logo_klein.svg.png", 'restream', streamedSuHeaders),
        ];


        if (fs.existsSync(storageFilePath)) {
            try {
                const data = fs.readFileSync(storageFilePath, 'utf-8');
                const channelsJson = JSON.parse(data);

                return channelsJson.map(channelJson => Channel.from(channelJson));
            } catch (err) {
                console.error('Error loading data from storage:', err);
                return defaultChannels;
            }
        }
        this.save(defaultChannels);
        return defaultChannels;
    },

    save(data) {
        try {
            fs.writeFile(storageFilePath, JSON.stringify(data, null, 2), { encoding: 'utf-8' }, (err) => err && console.error(err));
            console.log('Data saved successfully.');
        } catch (err) {
            console.error('Error saving data to storage:', err);
        }
    },

    clear() {
        try {
            fs.unlinkSync(storageFilePath);
            console.log('Data cleared successfully.');
        } catch (err) {
            console.error('Error clearing data from storage:', err);
        }
    }
}