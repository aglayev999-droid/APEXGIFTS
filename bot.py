
import os
import telebot
import logging
from flask import Flask, request

# It's recommended to use environment variables for sensitive data.
# These will be set in your deployment environment (e.g., Render.com).
TOKEN = os.environ.get("BOT_TOKEN")
# THIS IS THE CORRECT URL FOR THE FIREBASE HOSTED WEB APP
APP_URL = f"https://{os.environ.get('FIREBASE_PROJECT_ID')}.web.app"
PAYMENT_PROVIDER_TOKEN = os.environ.get("PAYMENT_PROVIDER_TOKEN")

# Basic logging setup
logging.basicConfig(level=logging.INFO)

if not TOKEN:
    logging.error("BOT_TOKEN environment variable not set!")
    # Exit or handle the error appropriately if the token is missing
    exit()

bot = telebot.TeleBot(TOKEN, threaded=False)
app = Flask(__name__)

# This route is used by Telegram to send updates to the bot
@app.route('/', methods=['GET', 'POST'])
def get_message():
    if request.method == 'POST':
        try:
            json_string = request.get_data().decode('utf-8')
            update = telebot.types.Update.de_json(json_string)
            bot.process_new_updates([update])
            return "!", 200
        except Exception as e:
            logging.error(f"Error processing update: {e}")
            return "Error", 500
    # This is a health check for GET requests
    return "Bot is alive and waiting for messages!", 200

@bot.message_handler(commands=['start'])
def send_welcome(message):
    chat_id = message.chat.id
    text = message.text
    
    if not APP_URL or "None.web.app" in APP_URL:
        logging.error("APP_URL is not set or FIREBASE_PROJECT_ID is missing!")
        bot.send_message(chat_id, "Sorry, the application is not configured correctly. The web app address is missing.")
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

@bot.message_handler(commands=['deposit'])
def send_deposit_options(message):
    handle_deposit(message.chat.id, None)

@bot.pre_checkout_query_handler(func=lambda query: True)
def checkout(pre_checkout_query):
    bot.answer_pre_checkout_query(pre_checkout_query.id, True)

@bot.message_handler(content_types=['successful_payment'])
def got_payment(message):
    star_amount = message.successful_payment.total_amount / 100
    bot.send_message(message.chat.id, f"Hooray! Thanks for your payment. You have received {star_amount} stars.")
    # Here you would typically update the user's balance in your database.

if __name__ == "__main__":
    # This is for local development. Render will use gunicorn.
    # We remove the set_webhook call from here to avoid issues on Render.
    app.run(host="0.0.0.0", port=int(os.environ.get('PORT', 5000)))
