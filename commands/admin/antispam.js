/**
 * Antispam Command - Kick users who spam messages
 */

const database = require('../../database');

// Memory tracker for message spam
const messageTracker = new Map();

const TIME_WINDOW = 10; // seconds
const MESSAGE_LIMIT = 6; // kick if more than 6 messages in 10s

module.exports = {
  name: 'antispam',
  aliases: ['antisp'],
  category: 'admin',
  description: 'Configure antispam protection (delete/kick)',
  usage: '.antispam <on/off/set/get>',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {
    try {
      if (!args[0]) {
        const settings = database.getGroupSettings(extra.from);
        const status = settings.antispam? 'ON' : 'OFF';
        const action = settings.antispamAction || 'kick';
        return extra.reply(
          `🛡️ *Antispam Status*\n\n` +
          `Status: *${status}*\n` +
          `Action: *${action}*\n` +
          `Limit: *${MESSAGE_LIMIT} messages in ${TIME_WINDOW}s*\n\n` +
          `Usage:\n` +
          `.antispam on\n` +
          `.antispam off\n` +
          `.antispam set delete | kick\n` +
          `.antispam get`
        );
      }

      const opt = args[0].toLowerCase();

      if (opt === 'on') {
        if (database.getGroupSettings(extra.from).antispam) {
          return extra.reply('*Antispam is already ON*');
        }
        database.updateGroupSettings(extra.from, { antispam: true });
        return extra.reply('*Antispam has been turned ON*');
      }

      if (opt === 'off') {
        database.updateGroupSettings(extra.from, { antispam: false });
        return extra.reply('*Antispam has been turned OFF*');
      }

      if (opt === 'set') {
        if (args.length < 2) {
          return extra.reply('*Please specify an action:.antispam set delete | kick*');
        }

        const setAction = args[1].toLowerCase();
        if (!['delete', 'kick'].includes(setAction)) {
          return extra.reply('*Invalid action. Choose delete or kick.*');
        }

        database.updateGroupSettings(extra.from, {
          antispamAction: setAction,
          antispam: true
        });
        return extra.reply(`*Antispam action set to ${setAction}*`);
      }

      if (opt === 'get') {
        const settings = database.getGroupSettings(extra.from);
        const status = settings.antispam? 'ON' : 'OFF';
        const action = settings.antispamAction || 'kick';
        return extra.reply(`*Antispam Configuration:*\nStatus: ${status}\nAction: ${action}\nLimit: ${MESSAGE_LIMIT}/${TIME_WINDOW}s`);
      }

      return extra.reply('*Use.antispam for usage.*');

    } catch (error) {
      await extra.reply(`❌ Error: ${error.message}`);
    }
  },

  // Call this function in message handler for every message
  async checkSpam(sock, msg, extra) {
    if (msg.key.fromMe) return;

    const chatId = extra.from;
    const sender = msg.key.participant || msg.key.remoteJid;

    const settings = database.getGroupSettings(chatId);
    if (!settings.antispam) return;

    // Skip admins
    const groupMetadata = await sock.groupMetadata(chatId);
    const isAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;
    if (isAdmin) return;

    const now = Date.now() / 1000;

    if (!messageTracker.has(sender)) {
      messageTracker.set(sender, []);
    }

    let times = messageTracker.get(sender);
    times = times.filter(t => now - t < TIME_WINDOW);
    times.push(now);
    messageTracker.set(sender, times);

    if (times.length >= MESSAGE_LIMIT) {
      try {
        const action = settings.antispamAction || 'kick';

        // Delete the spam message
        await sock.sendMessage(chatId, { delete: msg.key }).catch(() => {});

        if (action === 'kick') {
          await sock.groupParticipantsUpdate(chatId, [sender], 'remove');
          await sock.sendMessage(chatId, {
            text: `🚫 @${sender.split('@')[0]} has been kicked\nReason: Message spam [${MESSAGE_LIMIT}+ in ${TIME_WINDOW}s]`,
            mentions: [sender]
          });
        }

        messageTracker.set(sender, []);

      } catch (err) {
        console.log('Antispam error:', err);
      }
    }
  }
};