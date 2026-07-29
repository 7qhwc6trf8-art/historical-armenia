import 'dotenv/config';
import { Markup, Telegraf } from 'telegraf';
import { z } from 'zod';

const env = z.object({
  BOT_TOKEN: z.string().min(10),
  WEB_APP_URL: z.string().url().refine((url) => url.startsWith('https://'), 'WEB_APP_URL must use HTTPS'),
}).parse(process.env);

const bot = new Telegraf(env.BOT_TOKEN);

const openButton = Markup.inlineKeyboard([
  Markup.button.webApp('🏛 Open Historical Armenia', env.WEB_APP_URL),
]);

bot.start(async (ctx) => {
  await ctx.reply(
    [
      '🏛 <b>Virtual Historical Armenia</b>',
      '',
      'Explore Western and Eastern Armenia through an interactive historical atlas, settlements, monuments, maps and timelines.',
      '',
      'Press the button below to open the secure Mini App.',
    ].join('\n'),
    { parse_mode: 'HTML', ...openButton },
  );
});

bot.command('app', (ctx) => ctx.reply('Open the Mini App:', openButton));
bot.command('help', (ctx) => ctx.reply('Use /app to open the historical atlas.'));
bot.catch((error, ctx) => console.error(`Bot error for update ${ctx.update.update_id}:`, error));

await bot.launch({ dropPendingUpdates: true });
console.log('VHA Telegram bot is running.');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
