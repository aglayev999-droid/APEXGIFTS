import telebot
from telebot import types
import os

# It's better to get the token from environment variables
BOT_TOKEN = os.environ.get("BOT_TOKEN", "8239930030:AAGOiMTBYTstZVINTEGVFEzm5Jeee1hBFJM")
WEB_APP_URL = os.environ.get("WEB_APP_URL", "https://your-app-url.com")
PAYMENT_PROVIDER_TOKEN = os.environ.get("PAYMENT_PROVIDER_TOKEN", "398062629:TEST:999999999_F91D8F69C042267444B74CC0B3C747757EB0E065")


bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start'])
def send_welcome(message):
    # Check if the start command has a payload (deep link)
    if len(message.text.split()) > 1 and message.text.split()[1] == 'deposit':
        command_deposit(message)
        return

    markup = types.InlineKeyboardMarkup(row_width=1)
    
    web_app_info = types.WebAppInfo(WEB_APP_URL)
    web_app_button = types.InlineKeyboardButton(
        text="Open Cases (web app)", 
        web_app=web_app_info
    )
    
    community_button = types.InlineKeyboardButton(
        text="Join Our Community!", 
        url="https://t.me/Apex_Communitiy"
    )

    markup.add(web_app_button, community_button)
    
    welcome_text = "🎰 Gift cases with the highest chances! Open a free case every 24 hours."
    
    bot.send_message(
        message.chat.id, 
        welcome_text, 
        reply_markup=markup
    )

@bot.message_handler(commands=['deposit'])
def command_deposit(message):
    prices = [
        types.LabeledPrice(label='100 Stars', amount=100),
        types.LabeledPrice(label='500 Stars', amount=500),
        types.LabeledPrice(label='1000 Stars', amount=1000),
    ]

    bot.send_invoice(
        message.chat.id,
        title='Deposit Stars',
        description='Add stars to your balance to open more cases!',
        provider_token=PAYMENT_PROVIDER_TOKEN,
        currency='XTR',
        prices=prices,
        start_parameter='deposit-stars',
        invoice_payload='CUSTOM-PAYLOAD'
    )

@bot.pre_checkout_query_handler(func=lambda query: True)
def checkout(pre_checkout_query):
    bot.answer_pre_checkout_query(pre_checkout_query.id, ok=True,
                                  error_message="Oops, something went wrong. Please try again later.")

@bot.message_handler(content_types=['successful_payment'])
def got_payment(message):
    # Here you would typically update the user's balance in your database
    # For now, we just send a confirmation message.
    bot.send_message(message.chat.id,
                     'Hooray! Thanks for your payment. You have received {} stars.'.format(
                         message.successful_payment.total_amount,
                         ))


print("Bot is polling...")
bot.infinity_polling()
