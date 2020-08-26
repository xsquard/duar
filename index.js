const { create, decryptMedia } = require('@open-wa/wa-automate')
const fs = require('fs-extra')
const moment = require('moment')
const { tiktok, instagram, twitter, facebook } = require('./lib/dl-video')
const urlShortener = require('./lib/shortener')
const axios = require('axios')
const insta = require('./lib/insta')
const color = require('./lib/color')
const { fetchMeme } = require('./lib/fetcher')
const get = require('got')
const {artinama,
    quotes,
    weton,
    corona,
    alay,
    namaninjaku,
    liriklagu,
    quotemaker,
    yt,
    ytmp3,
    gd,
    jodoh,
    hilih,
    weather,
    neko,
    lolinime,
    wpnime,
} = require('./lib/functions')

const serverOption = {
    headless: true,
    qrRefreshS: 20,
    qrTimeout: 0,
    authTimeout: 0,
    autoRefresh: true,
    killProcessOnBrowserClose: true,
    cacheEnabled: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        // THIS MAY BREAK YOUR APP !!!ONLY FOR TESTING FOR NOW!!!
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
    ]
}

const opsys = process.platform
if (opsys === 'win32' || opsys === 'win64') {
    serverOption.executablePath = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
} else if (opsys === 'linux') {
      serverOption['executablePath'] = '/usr/bin/google-chrome';
    //serverOption.browserRevision = '737027'
} else if (opsys === 'darwin') {
    serverOption.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
}

const startServer = async () => {
    create('Imperial', serverOption)
        .then(client => {
            console.log('[DEV] Diditx87')
            console.log('[SERVER] Server Started!')
            // Force it to keep the current session
            client.onStateChanged(state => {
                console.log('[Client State]', state)
                if (state === 'CONFLICT') client.forceRefocus()
            })
            // listening on message
            client.onMessage((message) => {
                msgHandler(client, message)
            })
            // listening on Incoming Call
            // client.onIncomingCall((call) => {
            //     client.sendText(call.peerJid._serialized, 'Maaf, saya tidak bisa menerima panggilan.')
            // })
        })
}

async function msgHandler (client, message) {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg } = message
        let { body } = message
        const { name } = chat
        let { pushname, verifiedName } = sender
        // verifiedName is the name of someone who uses a business account
        pushname = pushname || verifiedName
        const prefix = '#'
        body = (type == 'chat' && body.startsWith(prefix)) ? body : ((type == 'image' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const args = body.slice(prefix.length).trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        if (!isCmd && !isGroupMsg) return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
        if (!isCmd && isGroupMsg) return console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name))
        if (isCmd && !isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} (${args.length})`), 'from', color(pushname))
        if (isCmd && isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(`${command} (${args.length})`), 'from', color(pushname), 'in', color(name))

        // Checking function speed
        // const timestamp = moment()
        // const latensi = moment.duration(moment() - timestamp).asSeconds()
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi)
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'

        switch (command) {
        case 'tnc':
           // client.sendText(from, 'This bot is an open-source program written in Javascript. \n\nBy using the bot you agreeing to our Terms and Conditions! \nWe do not store any of your data in our servers. We are not responsible for stickers that you create using bots, videos, images or other data that you get from this bot.')
            break
        case 'menu':
        case 'help': {
            const text = `Hi, ${pushname}! 👋️ \n\nWelcome To Didit-Bot!✨\n\nlist menu (command) :\n\n1. #menu / #help : Untuk Tampilkan semua fitur & #ping untuk cek bot aktif\n2. #sticker / #stiker: kirim gambar dengan caption atau balas gambar yang sudah dikirim. ✅ \n3. #sticker / #stiker spasi url gambar (contoh: #stiker https://avatars2.githubusercontent.com/u/24309806) ✅\n4. #ig spasi url videonya : (contoh : #ig https://www.instagram.com/p/B3gqNXwB00pG/)\n 5. #fb spasi url videonya : (contoh: #fb https://www.tiktok.com/@diditx87/video/6854861929)✅\n 6. #twt spasi url videonya (contoh: #twt https://twitter.com/diditx87/status/1289776000474083328)✅\n  7. #tiktok spasi url videonya (contoh: #tiktok https://www.tiktok.com/@diditx87/video/685521...) (update)✅\n8. #corona : Untuk Menampilkan data corona terbaru di Indonesia (updated) ✅\n9. #quotes : Random quotes mbucin ✅\n10. #liriklagu *surat-cinta* : Menampilkan lirik lagu *surat cinta* ✅\n 11. #artinama *roti* : Menampilkan arti nama dari *roti* ✅\n12. #weton 06 08 1995* : Cek weton dan watak (tgl bulan tahun) ✅\n13. #quotemaker *coba-coba-saja rotibakar random* : Tampilkan gambar quotes (pisahkan dengan -) dengan nama *rotibakar* dan gambar tema *random* ✅\n14. #namaninjaku ahmadlemon : Tampilkan nama ninja terkeren dari *ahmad lemon* ✅\n15. #unsplash : Download wallpaper dari unsplash ✅\n16. #kuching : Download gambar kucing random ✅\n17. #anime : Download gambar anime (kadang gambar gak cocok) ✅\n18. #wp nature : Download gambar dari unsplash dengan keyword *nature* ✅\n19. #jodoh *aku kamu* : Ramal jodoh dari nama *aku* & *kamu* ✅\n 20. #yt link youtube : Download video dari youtube ✅\n21. #ytmp3 link youtube : Download music dari youtube dengan format mp3 ✅\n22. #quote2make *quotesmuquotesmu authornya gambare ukurantext* : versi 2 quotesmaker contoh *#quote2make rebahan kuli bangunan 1 25* (update : kalo ngirim html ulangi) ✅\n23. #alay katakatamu : buat ubah text jadi alay kaya *aku* jadi *4kU* ✅\n24. #lasegar : menampilkan gambar yang seger-seger (gambar cuman 19 doang kalo nemu yang cocok diupdate) ✅\n25. #grouplink : menampilkan link dari grup (buat bot ini admin dulu)✅\n26. #wpnime : versi 2 nampilkan walpapper anime/n ✅\n27. #waifu : menampilkan gambar waifu anime/n ✅\n28. #neko : menampilkan gambar anime cosplay kucing ✅\n29. #lolinime : menampilkan gambar anime loli ✅\n30. #meme : menampilkan meme fresh  ✅\n31. #gif/#stikergif/#gifstiker : buat sticker bergerak dari giphy ✅`
            client.sendText(from,text )
            break
        }
        
        case 'sticker':
        case 'stiker':
            if (isMedia) {
                const mediaData = await decryptMedia(message, uaOverride)
                const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (quotedMsg && quotedMsg.type == 'image') {
                const mediaData = await decryptMedia(quotedMsg)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imageBase64)
            } else if (args.length == 1) {
                const url = args[0]
                if (!url.match(isUrl)) client.reply(from, 'Maaf, link yang kamu kirim tidak valid.', id)
                await client.sendStickerfromUrl(from, url)
                    .then((r) => {
                        if (!r && r !== undefined) client.sendText(from, 'Maaf, link yang kamu kirim tidak memuat gambar.')
                    })
            } else {
                client.reply(from, 'Tidak ada gambar! Untuk membuka daftar perintah kirim #menu', id)
            }
            break
        case 'gif':
        case 'stikergif':
        case 'stickergif':
        case 'gifstiker':
        case 'gifsticker':
            if (args.length == 1){
                const url = args[0]
                const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'));
                const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'));
                if(isGiphy){
                    const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'));
                    if(getGiphyCode){
                        let delChars = getGiphyCode[0].replace(/[-\/]/gi, "");
                        const smallGif = "https://media.giphy.com/media/"+delChars+"/giphy-downsized.gif";
                        await client.sendGiphyAsSticker(from, smallGif)
                        .catch((err) => {
                            console.log(err)
                        })
                    } else {
                        client.reply(from, "Gagal membuat sticker gif", id)
                    }
                } else if(isMediaGiphy){
                    const normalGif = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'));
                    if(normalGif){
                        let smallGif = url.replace(normalGif[0], "giphy-downsized.gif")
                        await client.sendGiphyAsSticker(from, smallGif)
                        .catch((err) => {
                            console.log(err)
                        })
                    }
                } else {
                    client.reply(from, "Saat ini sticker gif hanya bisa menggunakan link giphy saja kak.", id)
                }
            }
            break
            case 'ping':
            const tetxt = `Halo, ${pushname}! 👋️ BOT AKTIF YA`
                    client.sendText(from,tetxt )
                break
        case 'tiktok': {
            if (args.length !== 1) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid', id)
            const url = args[0]
            if (!url.match(isUrl) && !url.includes('tiktok.com')) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid', id)
           // await client.sendText(from, '*Scraping Metadata...*')
            await tiktok(url)
                .then((videoMeta) => {
                    const filename = videoMeta.authorMeta.name + '.mp4'
                    const caps = `*Metadata:*\nUsername: ${videoMeta.authorMeta.name} \nMusic: ${videoMeta.musicMeta.musicName} \nView: ${videoMeta.playCount.toLocaleString()} \nLike: ${videoMeta.diggCount.toLocaleString()} \nComment: ${videoMeta.commentCount.toLocaleString()} \nShare: ${videoMeta.shareCount.toLocaleString()} \nCaption: ${videoMeta.text.trim() ? videoMeta.text : '-'} \n\n`
                    client.sendFileFromUrl(from, videoMeta.url, filename, videoMeta.NoWaterMark ? caps : `⚠ Video tanpa watermark tidak tersedia. \n\n${caps}`, '', { headers: { 'User-Agent': 'okhttp/4.5.0' } })
                        .catch(err => console.log('Caught exception: ', err))
                }).catch(() => {
                    client.reply(from, 'Gagal mengambil metadata, link yang kamu kirim tidak valid', id)
                })
        }
            break
        
        case 'twt':
        case 'twitter': {
            if (args.length !== 1) return client.reply(from, 'Maaf, link yang kamu kirim tidak valid', id)
            const url = args[0]
            if (!url.match(isUrl) & !url.includes('twitter.com') || url.includes('t.co')) return client.reply(from, 'Maaf, url yang kamu kirim tidak valid', id)
            await client.sendText(from, '*Scraping Metadata...*')
            twitter(url)
                .then(async (videoMeta) => {
                    try {
                        if (videoMeta.type == 'video') {
                            const content = videoMeta.variants.filter(x => x.content_type !== 'application/x-mpegURL').sort((a, b) => b.bitrate - a.bitrate)
                            const result = await urlShortener(content[0].url)
                            console.log('Shortlink: ' + result)
                            client.sendFileFromUrl(from, content[0].url, 'TwitterVideo.mp4')
                        } else if (videoMeta.type == 'photo') {
                            for (let i = 0; i < videoMeta.variants.length; i++) {
                                await client.sendFileFromUrl(from, videoMeta.variants[i], videoMeta.variants[i].split('/media/')[1], '')
                            }
                        }
                    } catch (err) {
                        client.sendText(from, 'Error, ' + err)
                    }
                }).catch(() => {
                    client.sendText(from, 'Maaf, link tidak valid atau tidak ada video di link yang kamu kirim')
                })
        }
            break
        case 'fb':
        case 'facebook': {
            await client.simulateTyping(from, true)             
                    if (args.length >=2) {
                        const urlvid = args[1]
                        const high = await fbvid.high(urlvid)
                        const low = await fbvid.low(urlvid)
                        if (high == "Either the video is deleted or it's not shared publicly!") {
                            client.sendFileFromUrl(from, low.url, "video.mp4", "SD Video successfully downloaded")
                        } else if (high !== "Either the video is deleted or it's not shared publicly!") {
                            client.sendFileFromUrl(from, high.url, "video.mp4", "HD Video successfully downloaded")
                        } else if (high == "Either the video is deleted or it's not shared publicly!" && low == "Either the video is deleted or it's not shared publicly!") {
                            client.reply(from,"URL tidak valid / video tidak publik !",message)
                        }
                    } else {
                        client.reply(from,"#fb [URL Video]",message)
                    }
            break

case 'unsplash':
                        client.sendFileFromUrl(from, 'https://source.unsplash.com/daily', 'wallpaper.png'); // UwU)/ Working Fine
                    break;
                case 'kuching':
                    q2 = Math.floor(Math.random() * 900) + 300;
                    q3 = Math.floor(Math.random() * 900) + 300;
                    client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'kuching.png');
                    break;
                case 'anime' :
                       q4 = Math.floor(Math.random() * 800) + 100;
                    client.sendFileFromUrl(from, 'https://wallpaperaccess.com/download/anime-'+q4,'Anime.png');
                    break;
                case 'wp':
                    if (args.length >=2) {
                    const keyword = args[1]
                    client.sendFileFromUrl(from, 'https://source.unsplash.com/1600x900/?'+args[1],'wp.jpeg')    
                    };
                    break;
             case 'lasegar':
                   q2 = Math.floor(Math.random() * 10) + 1;
                   client.sendFileFromUrl(from, 'https://lines.masgimenz.com/gambar/'+q2+'.jpg','halo.jpg');
                  break;
 case 'corona':    
                         const response = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/Indonesia/');
                         const { cases, todayCases, deaths, todayDeaths, recovered, active } = response.data
                         await client.sendText(from, 'Kasus *Indonesia* 🇮🇩\n\n✨️Total Kasus: '+`${cases}`+'\n📆️Kasus Hari Ini: '+`${todayCases}`+'\n☣️Meningal : '+`${deaths}`+'\n😊 Sembuh : '+`${recovered}`+'\n⛩️Kasus Aktif : '+`${active}`+'.')

                break;
case 'artinama':
                    if (args.length == 2) {
                        const nama = args[1]
                        const result = await artinama(nama)
                        client.sendText(from, result)
                    }
                    break;
                case 'liriklagu':
                    if (args.length == 2){
                        const lagu = args[1]
                        const result = await liriklagu(lagu)
                        client.sendText(from, result)
                    }
                    break;
                case 'weton':
                    if (args.length == 4) {
                        const tgl = args[1]
                        const bln = args[2]
                        const thn = args[3]
                        const result = await weton(tgl, bln, thn)
                        client.sendText(from, result)
                    }
                    break;
                case 'alay':
                    if (args.length == 2) {
                       const kata = args[1]
                       const result = await alay(kata)
                     client.sendText(from, result)
                    }
                    break;
                case 'namaninjaku':
                    if (args.length == 2) {
                        const nama = args[1]
                        const result = await namaninjaku(nama)
                        client.sendText(from, result)
                    }
                    break;
                    case 'quotesmaker' :
                case 'quotemaker':
                    await client.simulateTyping(from, true)
                    //client.sendText(from, '⏳ Tunggu yaa, sedang proses . . . ⏳')                
                    if (args.length == 4) {
                        const quotes = args[1]
                        const author = args[2]
                        const theme = args[3]
                        const result = await quotemaker(quotes, author, theme)
                        client.sendFile(from, result, 'quotesmaker.jpg')
                    }
                    break;
                    case 'quote2make':
                    //await client.simulateTyping(from, true)
                    //client.sendText(from, '⏳ Tunggu yaa, sedang proses . . . ⏳') 
                    
                        const quotes = args[1]
                        client.sendFileFromUrl(from, 'https://terhambar.com/aw/qts/proses.php?kata='+q+'&author='+args[2]+'&tipe='+args[3]+'&font=./font/font3.otf&size='+args[4],'quote.jpg');
                    break;
                case 'yt':
                    await client.simulateTyping(from, true)
                    //client.sendText(from, '⏳ Tunggu yaa, sedang proses . . . ⏳')
                    if (args.length >=2){
                        const url = args[1]
                        const result = await yt(url)
                        client.sendFileFromUrl(from, result , 'video.mp4')
                    }
                    break;  
                case 'ytmp3':
                    await client.simulateTyping(from, true)
                    //client.sendText(from, '⏳ Tunggu yaa, sedang proses . . . ⏳')
                    if (args.length >=2){
                        const url = args[1]
                        const result = await ytmp3(url)
                        client.sendFileFromUrl(from, result , 'audio.mp3')
                    }
                    break;                   
                case 'gd':
                    if (args.length >=2){
                        const url = args[1]
                        const result = await gd(url)
                        client.sendText(from, result)
                    }
                    break;  
                case 'jodoh':
                    if (args.length == 3) {
                        const nama1 = args[1]
                        const nama2 = args[2]
                        const result = await jodoh(nama1, nama2)
                        client.sendText(from, result)
                    }
                    break;   
                case 'hilih':
                    if (args.length >=2){
                        const kata = args[1]
                        const result = await hilih(kata)
                        client.sendText(from, result)
                    }
                    break;  
                  case 'cuaca':  
                case 'weather':
                    if (args.length >=2){
                        const kota = args[1]
                        const result = await weather(kota)
                        client.sendText(from, result)
                    }
                    break;  
                    case 'grouplink':
                     if (!isGroupMsg) {
                        const inviteLink = await client.getGroupInviteLink(chat.id)
                        client.sendText(from, inviteLink)
}
                    break; 

                      case 'neko':    
                        const wpo = await neko()
                        client.sendFileFromUrl(from, wpo, 'wponimex.jpg')
                        
                break;      
                case 'wpnime':    
                        const wpn = await wpnime()
                        client.sendFileFromUrl(from, wpn, 'wpnimex.jpg')
                        
                break;   
                
                case 'lolinime':    
                        const wpl = await lolinime()
                        client.sendFileFromUrl(from, wpl, 'wplonimex.jpg')
                        
                break;   
                case 'waifu':    
                        q8 = q2 = Math.floor(Math.random() * 98) + 10;
                        client.sendFileFromUrl(from, 'http://randomwaifu.altervista.org/images/00'+q8+'.png', 'Waifu.png'); // UwU)/ Working Fine
                    break



        case 'mim':
        case 'memes':
        case 'meme': {
            const { title, url } = await fetchMeme()
            await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
            break

case 'ig':
        case 'instagram': 
       const url = args[1]
        const resp = await get.get('https://villahollanda.com/api.php?url='+ url).json()
        console.log(resp)
        if (resp.mediatype == 'photo') {
            var ext = '.png';
        } else {
            var ext = '.mp4';
        }
        const dl = new DownloaderHelper(resp.descriptionc, __dirname, { fileName: `./ig/${resp}${ext}` })
        console.log(dl.getStats)
        dl.on('end', () => console.log('Download completed'))
        await dl.start()
        const media = MessageMedia.fromFilePath(`./ig/${resp}${ext}`)
        await chat.sendMessage(media)
            break
            
        }
        default:
            console.log(color('[ERROR]', 'red'), color(time, 'yellow'), 'Unregistered Command from', color(pushname))
            break
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}

startServer()
