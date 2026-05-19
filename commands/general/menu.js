/**
 * TOM-PRIME-X (STATUSSYNC EXACT REPLICA)
 * FULLY DYNAMIC | CLEAN CODE | SMALL FONT
 */

const config = require('../../config');

module.exports = {
  name: 'menu',
  aliases: ['help', 'h'],
  category: 'general',
  async execute(sock, msg, args, extra) {
    const { from, pushName, sender } = extra;

    const time = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka' });
    const date = new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Dhaka' });

    let menuText = `✨ *COMMAND MENU* ✨
┌────────────────────
│
│ 💎 *Bot:* ${config.botName || '𝐓𝐎𝐌 𝐏𝐑𝐈𝐌𝐄 𝐗'}
│ 👑 *Owner:* ${config.ownerName || '𝐏𝐑𝐎𝐅𝐄𝐒𝐒𝐎𝐑 𝐓𝐎𝐌 𝐗'}
│ 🚀 *Status:* 𝙻𝙰𝚄𝙽𝙲𝙷𝙴𝙳 𝟸𝟶𝟸𝟻
│ 🌍 *Prefix:* ${config.prefix}
│ 🕒 *Time:* ${time}
│ 📅 *Date:* ${date}
│ 🌐 *Note:* 𝚃𝙾𝙼 𝙼𝙸𝙽𝙸 𝚅𝙴𝚁𝚂𝙸𝙾𝙽
│
└────────────────────\n\n`;

    menuText += `╭────〈 *𝙾𝚆𝙽𝙴𝚁 𝙼𝙴𝙽𝚄* 〉──┈⊷
│ 
│  │ .ʀᴇsᴛᴀʀᴛ
│  │ .sᴇᴛᴘʀᴇғɪx
│  │ .ᴀɴᴛɪᴄᴀʟʟ
│  │ .ᴀᴜᴛᴏʀᴇᴀᴄᴛ
│  │ .ʙʀᴏᴀᴅᴄᴀsᴛ
│  │ .ᴍᴏᴅᴇ
│  │ .sᴇᴛʙᴏᴛɴᴀᴍᴇ
│  │ .sᴇᴛʙᴏᴛᴘᴘ
│  │ .sᴇᴛᴍᴇɴᴜɪᴍᴀɢᴇ
│  │ .ʙʟᴏᴄᴋ
│  │ .ᴜɴʙʟᴏᴄᴋ
│  │ .ᴜᴘᴅᴀᴛᴇ
╰──────────────────────┈⊷\n\n`;

    menuText += `╭────〈 *𝙰𝙳𝙼𝙸𝙽 𝙼𝙴𝙽𝚄* 〉──┈⊷
│ 
│  │ .ᴀɴᴛɪɢʀᴏᴜᴘᴍᴇɴᴛɪᴏɴ
│  │ .ᴀɴᴛɪʟɪɴᴋ
│  │ .ᴀɴᴛɪsᴘᴀᴍ
│  │ .ᴀɴᴛɪsᴛɪᴄᴋᴇʀ
│  │ .ᴀɴᴛɪʙᴀᴅᴡᴏʀᴅ
│  │ .ᴀɴᴛɪᴛᴀɢ
│  │ .ᴀᴜᴛᴏsᴛɪᴄᴋᴇʀ
│  │ .ᴄʟᴇᴀɴ
│  │ .ᴅᴇʟᴇᴛᴇ
│  │ .ᴅᴇᴍᴏᴛᴇ
│  │ .ɢᴏᴏᴅʙʏᴇ
│  │ .ɢʀᴏᴜᴘʟɪɴᴋ
│  │ .ɢʀᴏᴜᴘsᴛᴀᴛᴜs
│  │ .ʜɪᴅᴇᴛᴀɢ
│  │ .ᴋɪᴄᴋ
│  │ .ᴋɪᴄᴋᴀʟʟ
│  │ .ᴍᴜᴛᴇ
│  │ .ᴘʀᴏᴍᴏᴛᴇ
│  │ .ʀᴇsᴇᴛᴡᴀʀɴ
│  │ .sᴇᴛɢᴏᴏᴅʙʏᴇ
│  │ .sᴇᴛᴡᴇʟᴄᴏᴍᴇ
│  │ .ᴛᴀɢᴀʟʟ
│  │ .ᴜɴᴍᴜᴛᴇ
│  │ .ᴡᴀʀɴ
│  │ .ᴡᴇʟᴄᴏᴍᴇ
╰──────────────────────┈⊷\n\n`;

    menuText += `╭────〈 *𝙶𝚁𝙾𝚄𝙿 𝙼𝙴𝙽𝚄* 〉──┈⊷
│ 
│  │ .ᴛᴀɢᴀʟʟ
│  │ .ʜɪᴅᴇᴛᴀɢ
│  │ .ᴀᴅᴅ
│  │ .ᴋɪᴄᴋ
│  │ .ᴘʀᴏᴍᴏᴛᴇ
│  │ .ᴅᴇᴍᴏᴛᴇ
│  │ .ɢʀᴏᴜᴘʟɪɴᴋ
│  │ .sᴇᴛɢᴘᴘ
│  │ .sᴇᴛɴᴀᴍᴇ
│  │ .sᴇᴛᴅᴇsᴄ
│  │ .ᴍᴜᴛᴇ
│  │ .ᴜɴᴍᴜᴛᴇ
╰──────────────────────┈⊷\n\n`;

    menuText += `╭────〈 *𝙰𝙸 𝙼𝙴𝙽𝚄* 〉──┈⊷
│ 
│  │ .ᴀɪ
│  │ .ʙᴏᴛ
│  │ .ɢᴘᴛɪᴍᴀɢᴇ
│  │ .ᴍᴀɢɪᴄsᴛᴜᴅɪᴏ
╰──────────────────────┈⊷\n\n`;

    menuText += `╭────〈 *𝙼𝙴𝙳𝙸𝙰 𝙼𝙴𝙽𝚄* 〉──┈⊷
│ 
│  │ .ꜰᴀᴄᴇʙᴏᴏᴋ
│  │ .ɪɢs
│  │ .ɪɢsᴄ
│  │ .ɪɴsᴛᴀɢʀᴀᴍ
│  │ .ʟʏʀɪᴄs
│  │ .ᴘɪɴᴛᴇʀᴇsᴛ
│  │ .sᴏɴɢ
│  │ .ᴛɪᴋᴛᴏᴋ
│  │ .ᴠɪᴅᴇᴏ
╰──────────────────────┈⊷\n\n`;

    menuText += `╭────〈 *𝙵𝚄𝙽 𝙼𝙴𝙽𝚄* 〉──┈⊷
│ 
│  │ .ʙᴏᴍʙ
│  │ .ᴄᴏᴍᴘʟɪᴍᴇɴᴛʀʏ
│  │ .ᴅᴀʀᴇ
│  │ .ғʟɪʀᴛ
│  │ .ɢᴀʏʀᴀᴛᴇ
│  │ .ɪɴsᴜʟᴛ
│  │ .ᴊᴏᴋᴇ
│  │ .ᴍᴇᴍᴇ
│  │ .ᴍᴇᴍᴇsᴇᴀʀᴄʜ
│  │ .ᴘɪᴇs
│  │ .sʜɪᴘ
│  │ .ᴛɪᴄᴛᴀᴄᴛᴏᴇ
│  │ .ᴛʀᴜᴛʜ
╰──────────────────────┈⊷\n\n`;

    menuText += `╭────〈 *𝙶𝙴𝙽𝙴𝚁𝙰𝙻 𝙼𝙴𝙽𝚄* 〉──┈⊷
│ 
│  │ .ɪɴғᴏ
│  │ .ᴍᴇɴᴜ
│  │ .ᴍʏᴀᴄᴛɪᴠɪᴛʏ
│  │ .ssᴡᴇʙ
│  │ .sᴛɪᴄᴋᴇʀ
│  │ .ᴜᴘᴛɪᴍᴇ
│  │ .ᴘɪɴɢ
│  │ .ᴏᴡɴᴇʀ
│  │ .ᴀᴛᴛᴘ
│  │ .ᴄʀᴏᴘ
│  │ .ɢᴇᴛᴘᴘ
│  │ .ɢɪᴛʜᴜʙ
│  │ .ɢʀᴏᴜᴘsᴛᴀᴛᴜs
│  │ .ɢʀᴏᴜᴘɪɴғᴏ
╰──────────────────────┈⊷\n\n`;

    menuText += `*ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${config.botName || 'ᴛᴏᴍ ᴘʀɪᴍᴇ x'}*\n_ʟᴜxᴜʀʏ ʀᴇᴅᴇғɪɴᴇᴅ • ᴅʜᴀᴋᴀ 2026_`;

    try {
      const imageUrl = 'https://i.postimg.cc/pVF8rw2m/IMG-20260329-WA0128.jpg'; 
      await sock.sendMessage(from, {
        image: { url: imageUrl },
        caption: menuText,
        mentions: [sender]
      }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(from, { text: menuText, mentions: [sender] }, { quoted: msg });
    }
  }
};
