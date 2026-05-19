/**
 * Antisticker Command - Kick users who spam stickers
 */

const database = require('../../database');

// Memory tracker for sticker spam
const stickerTracker = new Map();

const TIME_WINDOW = 10; // seconds
const STICKER_LIMIT = 3; // take action if more than 3 stickers

module.exports = {
  name: 'antisticker',
  aliases: ['antistk'],
  category: 'admin',
  description: 'Configure antisticker protection (delete/kick)',
  usage: '.antisticker <on/off/set/get>',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {
    try {
      if (!args[0]) {
        const settings = database.getGroupSettings(extra.from);
        const status = settings.antisticker? 'ON' : 'OFF';
        const action = settings.antistickerAction || 'kick';
        return extra.reply(
          `🎭 *Antisticker Status*\n\n` +
          `Status: *${status}*\n` +
          `Action: *${action}*\n` +
          `Limit: *${STICKER_LIMIT} stickers in ${TIME_WINDOW}s*\n\n` +
          `Usage:\n` +
          `.antisticker on\n` +
          `.antisticker off\n` +
          `.antisticker set delete | kick\n` +
          `.antisticker get`
        );
      }

      const opt = args[0].toLowerCase();

      if (opt === 'on') {
        if (database.getGroupSettings(extra.from).antisticker) {
          return extra.reply('*Antisticker is already ON*');
        }
        database.updateGroupSettings(extra.from, { antisticker: true });
        return extra.reply('*Antisticker has been turned ON*');
      }

      if (opt === 'off') {
        database.updateGroupSettings(extra.from, { antisticker: false });
        return extra.reply('*Antisticker has been turned OFF*');
      }

      if (opt === 'set') {
        if (args.length < 2) {
          return extra.reply('*Please specify an action:.antisticker set delete | kick*');
        }

        const setAction = args[1].toLowerCase();
        if (!['delete', 'kick'].includes(setAction)) {
          return extra.reply('*Invalid action. Choose delete or kick.*');
        }

        database.updateGroupSettings(extra.from, {
          antistickerAction: setAction,
          antisticker: true
        });
        return extra.reply(`*Antisticker action set to ${setAction}*`);
      }

      if (opt === 'get') {
        const settings = database.getGroupSettings(extra.from);
        const status = settings.antisticker? 'ON' : 'OFF';
        const action = settings.antistickerAction || 'kick';
        return extra.reply(`*Antisticker Configuration:*\nStatus: ${status}\nAction: ${action}\nLimit: ${STICKER_LIMIT}/${TIME_WINDOW}s`);
      }

      return extra.reply('*Use.antisticker for usage.*');

    } catch (error) {
      await extra.reply(`❌ Error: ${error.message}`);
    }
  },

  // Call this function in your message handler
  async checkSticker(sock, msg, extra) {
    if (!msg.message?.stickerMessage) return;

    const chatId = extra.from;
    const sender = msg.key.participant || msg.key.remoteJid;

    const settings = database.getGroupSettings(chatId);
    if (!settings.antisticker) return;

    // Skip admins
    const groupMetadata = await sock.groupMetadata(chatId);
    const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
    if (isAdmin) return;

    const now = Date.now() / 1000;

    if (!stickerTracker.has(sender)) {
      stickerTracker.set(sender, []);
    }

    let times = stickerTracker.get(sender);
    times = times.filter(t => now - t < TIME_WINDOW);
    times.push(now);
    stickerTracker.set(sender, times);

    if (times.length >= STICKER_LIMIT) {
      try {
        const action = settings.antistickerAction || 'kick';

        // Delete the sticker message
        await sock.sendMessage(chatId, { delete: msg.key });

        if (action === 'kick') {
          await sock.groupParticipantsUpdate(chatId, [sender], 'remove');
          await sock.sendMessage(chatId, {
            text: `🚫 @${sender.split('@')[0]} has been kicked\nReason: Sticker spam [${STICKER_LIMIT}+ in ${TIME_WINDOW}s]`,
            mentions: [sender]
          });
        }

        stickerTracker.set(sender, []);

      } catch (err) {
        console.log('Antisticker error:', err);
      }
    }
  }
};