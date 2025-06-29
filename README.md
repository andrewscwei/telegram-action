# Telegram GitHub Action [![CD](https://github.com/andrewscwei/telegram-action/workflows/Release/badge.svg)](https://github.com/andrewscwei/telegram-action/actions/workflows/release.yml)

A GitHub Action for sending build status alerts to a Telegram chat.

## Usage

```yml
uses: andrewscwei/telegram-action@v1
with:
  success: ${{ needs.build.result == 'success' }}
  cancelled: ${{ needs.build.result == 'cancelled' }}
  bot-token: ${{ secrets.TELEGRAM_BOT_TOKEN }}
  chat-id: ${{ secrets.TELEGRAM_CHAT_ID }}
```

## Logging

Access more verbose debug logs by [setting the secret](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-encrypted-secrets) `ACTIONS_STEP_DEBUG` to `true`.

## Inputs

### `success-prefix`

The prefix to use in a success alert, defaults to 😎.

### `failure-prefix`

The prefix to use in a failure alert, defaults to 😱.

### `bot-token`

**Required**: The token of the Telegram bot that will be sending the messages.

### `chat-id`

**Required**: The ID of the chat which the Telegram bot will be sending messages to.

### `success`

**Required**: Specifies whether this is a success or failure alert.

### `cancelled`

**Required**: Specifies whether this is a cancelled alert.

### `action-label`

Label of the action button. If provided along with `action-url`, the action button will be visible if `success` is `true`.

### `action-url`

Link of the action button. If provided along with `action-label`, the action button will be visible if `success` is `true`.
