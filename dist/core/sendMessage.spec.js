import { describe, it } from 'mocha';
import { escapeMarkdownV2 } from '../utils/escapeMarkdownV2.js';
import { sendMessage } from './sendMessage.js';
describe('bot', () => {
    const botToken = process.env.BOT_TOKEN || undefined;
    const chatId = process.env.CHAT_ID || undefined;
    if (!!botToken && !!chatId) {
        it('can send message', async () => {
            try {
                await sendMessage(escapeMarkdownV2('Hello, world!'), {
                    botToken,
                    chatId,
                });
            }
            catch (err) {
                console.error(err);
            }
        });
    }
});
