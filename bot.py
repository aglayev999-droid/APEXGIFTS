
import os
import telebot
import logging

# It's recommended to use environment variables for sensitive data.
# These will be set in your deployment environment (e.g., Render.com).
TOKEN = os.environ.get("BOT_TOKEN")
APP_URL = os.environ.get("APP_URL") 
PAYMENT_PROVIDER_TOKEN = os.environ.get("PAYMENT_PROVIDER_TOKEN")

# Basic logging setup
logging.basicConfig(level=logging.INFO)

# We are using webhook strategy, so polling is not needed.
# The bot instance is created just to use the API methods.
if not TOKEN:
    logging.error("BOT_TOKEN environment variable not set!")
    # Exit or handle the error appropriately if the token is missing
    exit()

bot = telebot.TeleBot(TOKEN)

def handle_start_command(message):
    chat_id = message.chat.id
    text = message.text
    
    if not APP_URL:
        logging.error("APP_URL is not set!")
        bot.send_message(chat_id, "Sorry, the application is not configured correctly.")
        return

    # Check for deep link payload for deposits
    if text and len(text.split()) > 1:
        payload = text.split(' ')[1]
        if payload.startswith('deposit'):
            try:
                parts = payload.split('_')
                if len(parts) > 1 and parts[1].isdigit():
                    amount = int(parts[1])
                    handle_deposit(chat_id, amount)
                    return
            except Exception as e:
                logging.error(f"Error parsing deposit payload: {e}")

    welcome_text = "🎰 Gift cases with the highest chances! Open a free case every 24 hours."
    markup = telebot.types.InlineKeyboardMarkup()
    markup.row(telebot.types.InlineKeyboardButton("Open Cases (web app)", web_app=telebot.types.WebAppInfo(APP_URL)))
    markup.row(telebot.types.InlineKeyboardButton("Join Our Community!", url="https://t.me/Apex_Communitiy"))
    
    bot.send_message(chat_id, welcome_text, reply_markup=markup)

def handle_deposit(chat_id, amount):
    if not PAYMENT_PROVIDER_TOKEN:
        logging.error("PAYMENT_PROVIDER_TOKEN is not set!")
        bot.send_message(chat_id, "Sorry, payments are not configured correctly.")
        return

    prices = []
    description = ""
    invoice_payload = ""

    if amount and amount > 0:
        prices.append(telebot.types.LabeledPrice(label=f"{amount} Stars", amount=amount * 100))
        description = f"Add {amount} stars to your balance!"
        invoice_payload = f'user_id:{chat_id}-amount:{amount}'
    else:
        description = 'Add stars to your balance to open more cases!'
        prices = [
            telebot.types.LabeledPrice(label='100 Stars', amount=10000),
            telebot.types.LabeledPrice(label='500 Stars', amount=50000),
            telebot.types.LabeledPrice(label='1000 Stars', amount=100000),
        ]
        invoice_payload = f'user_id:{chat_id}-options'

    bot.send_invoice(
        chat_id,
        title='Deposit Stars',
        description=description,
        invoice_payload=invoice_payload,
        provider_token=PAYMENT_PROVIDER_TOKEN,
        currency='XTR', # Telegram Stars currency
        prices=prices
    )

def process_update(data):
    update = telebot.types.Update.de_json(data)
    
    if update.message:
        message = update.message
        if message.text and message.text.startswith('/start'):
            handle_start_command(message)
        elif message.text and message.text.startswith('/deposit'):
            handle_deposit(message.chat.id, None)
        elif message.successful_payment:
            star_amount = message.successful_payment.total_amount / 100
            bot.send_message(message.chat.id, f"Hooray! Thanks for your payment. You have received {star_amount} stars.")
            # Here you would typically update the user's balance in your database.
    
    elif update.pre_checkout_query:
        bot.answer_pre_checkout_query(update.pre_checkout_query.id, True)

# The following code is for local development and will not be used on Render
# as Render uses a WSGI server like Gunicorn.
if __name__ == '__main__':
    logging.info("Bot started in polling mode for local development.")
    bot.polling(none_stop=True)
