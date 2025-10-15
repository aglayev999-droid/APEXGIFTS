import telebot
from telebot import types

BOT_TOKEN = "8239930030:AAGOiMTBYTstZVINTEGVFEzm5Jeee1hBFJM"
WEB_APP_URL = "https://your-app-url.com"

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(commands=['start'])
def send_welcome(message):
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

print("Bot is polling...")
bot.infinity_polling()
