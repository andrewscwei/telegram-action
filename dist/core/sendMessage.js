import fetch from 'node-fetch';
export async function sendMessage(message, { botToken = '', chatId = '' } = {}) {
    const url = new URL(`https://api.telegram.org/bot${botToken}/sendMessage`);
    url.search = new URLSearchParams({
        chat_id: chatId,
        text: message,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: 'true',
    }).toString();
    const res = await fetch(url);
    switch (res.status) {
        case 200:
            return res.json();
        default: {
            throw await res.json();
        }
    }
}
