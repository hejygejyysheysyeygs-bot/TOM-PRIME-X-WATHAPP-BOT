/**
 * Antibadword Command - Delete messages containing bad words
 */

const database = require('../../database');

module.exports = {
  name: 'antibadword',
  aliases: ['antibad'],
  category: 'admin',
  description: 'Configure antibadword protection',
  usage: '.antibadword <on/off/add/remove/list>',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {
    try {
      const chatId = extra.from;
      const opt = args[0]?.toLowerCase();

      if (!opt) {
        const settings = database.getGroupSettings(chatId);
        const status = settings.antibadword? 'ON' : 'OFF';
        return extra.reply(
          `🚫 *Antibadword Status*\n\n` +
          `Status: *${status}*\n\n` +
          `Usage:\n` +
          `.antibadword on\n` +
          `.antibadword off\n` +
          `.antibadword add <word>\n` +
          `.antibadword remove <word>\n` +
          `.antibadword list`
        );
      }

      if (opt === 'on') {
        database.updateGroupSettings(chatId, { antibadword: true });
        return extra.reply('*Antibadword has been turned ON*');
      }

      if (opt === 'off') {
        database.updateGroupSettings(chatId, { antibadword: false });
        return extra.reply('*Antibadword has been turned OFF*');
      }

      if (opt === 'add') {
        if (!args[1]) return extra.reply('*Please specify a word to add.*');
        const word = args[1].toLowerCase();

        let words = database.getGroupSettings(chatId).badwords || [];
        if (words.includes(word)) return extra.reply(`*${word} is already in the list.*`);

        words.push(word);
        database.updateGroupSettings(chatId, { badwords: words });
        return extra.reply(`*Added "${word}" to badword list*`);
      }

      if (opt === 'remove') {
        if (!args[1]) return extra.reply('*Please specify a word to remove.*');
        const word = args[1].toLowerCase();

        let words = database.getGroupSettings(chatId).badwords || [];
        words = words.filter(w => w!== word);
        database.updateGroupSettings(chatId, { badwords: words });
        return extra.reply(`*Removed "${word}" from badword list*`);
      }

      if (opt === 'list') {
        const words = database.getGroupSettings(chatId).badwords || [];
        if (words.length === 0) return extra.reply('*Badword list is empty.*');
        return extra.reply(`*Badword List:*\n${words.map(w => `• ${w}`).join('\n')}`);
      }

      return extra.reply('*Use.antibadword for usage.*');

    } catch (error) {
      await extra.reply(`❌ Error: ${error.message}`);
    }
  },

  // Call this in message handler
  async checkBadword(sock, msg, extra) {
    if (!msg.message) return;

    const chatId = extra.from;
    const sender = msg.key.participant || msg.key.remoteJid;

    const settings = database.getGroupSettings(chatId);
    if (!settings.antibadword) return;
    if (!settings.badwords || settings.badwords.length === 0) return;

    // Skip admins
    const groupMetadata = await sock.groupMetadata(chatId);
    const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
    if (isAdmin) return;

    // Get message text
    const text = msg.message.conversation ||
                 msg.message.extendedTextMessage?.text ||
                 msg.message.imageMessage?.caption ||
                 msg.message.videoMessage?.caption ||
                 '';

    if (!text) return;

    const lowerText = text.toLowerCase();
    const foundWord = settings.badwords.find(word => lowerText.includes(word));

    if (foundWord) {
      try {
        // Delete the message
        await sock.sendMessage(chatId, { delete: msg.key });

        // Send warning
        await sock.sendMessage(chatId, {
          text: `🚫 @${sender.split('@')[0]} Bad word detected. Message deleted.`,
          mentions: [sender]
        });
      } catch (err) {
        console.log('Antibadword error:', err);
      }
    }
  }
};