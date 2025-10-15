
import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

// TEMPORARY: Replace these with your actual values
const token = "YOUR_BOT_TOKEN"; 
const webAppUrl = "YOUR_APP_URL";
const paymentProviderToken = "YOUR_PAYMENT_PROVIDER_TOKEN";

// We are using webhook strategy, so polling is not needed.
// The bot instance is created just to use the API methods.
const bot = new TelegramBot(token!);

// This function handles the /start command.
const handleStartCommand = async (chatId: number, text: string) => {
    if (!webAppUrl || webAppUrl === 'YOUR_APP_URL') {
        console.error("APP_URL is not set!");
        return bot.sendMessage(chatId, "Sorry, the application is not configured correctly.");
    }
    
    // Check for deep link payload for deposits
    if (text && text.split(' ').length > 1) {
        const payload = text.split(' ')[1];
        if (payload.startsWith('deposit')) {
            try {
                const parts = payload.split('_');
                if (parts.length > 1 && !isNaN(parseInt(parts[1]))) {
                    const amount = parseInt(parts[1], 10);
                    return handleDeposit(chatId, amount);
                }
            } catch (e) {
                console.error("Error parsing deposit payload", e);
            }
        }
    }

    const welcomeText = "🎰 Gift cases with the highest chances! Open a free case every 24 hours.";
    const markup = {
        inline_keyboard: [
            [{ text: "Open Cases (web app)", web_app: { url: webAppUrl } }],
            [{ text: "Join Our Community!", url: "https://t.me/Apex_Communitiy" }]
        ]
    };
    
    return bot.sendMessage(chatId, welcomeText, { reply_markup: markup });
};


// This function handles deposits
const handleDeposit = async (chatId: number, amount: number | null) => {
    if (!paymentProviderToken || paymentProviderToken === 'YOUR_PAYMENT_PROVIDER_TOKEN') {
        console.error("PAYMENT_PROVIDER_TOKEN is not set!");
        return bot.sendMessage(chatId, "Sorry, payments are not configured correctly.");
    }

    if (amount && amount > 0) {
        const prices = [{ label: `${amount} Stars`, amount: amount * 100 }];
        const description = `Add ${amount} stars to your balance!`;

        return bot.sendInvoice(
            chatId,
            'Deposit Stars',
            description,
            'deposit-stars',
            paymentProviderToken,
            'XTR', // Telegram Stars currency
            prices,
            { payload: `user_id:${chatId}-amount:${amount}` }
        );
    } else {
        // Fallback for generic /deposit command
         const description = 'Add stars to your balance to open more cases!';
         const prices = [
            {label: '100 Stars', amount: 10000},
            {label: '500 Stars', amount: 50000},
            {label: '1000 Stars', amount: 100000},
        ];
         return bot.sendInvoice(
            chatId,
            'Deposit Stars',
            description,
            'deposit-stars-options',
            paymentProviderToken,
            'XTR',
            prices,
            { payload: `user_id:${chatId}-options` }
         );
    }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received Telegram Update:', JSON.stringify(body, null, 2));

    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id;
      const text = message.text;

      if (text && text.startsWith('/start')) {
        await handleStartCommand(chatId, text);
      } else if (text && text.startsWith('/deposit')) {
        await handleDeposit(chatId, null);
      } else if (body.message.successful_payment) {
        const starAmount = body.message.successful_payment.total_amount / 100;
        await bot.sendMessage(chatId, `Hooray! Thanks for your payment. You have received ${starAmount} stars.`);
        // Here you would typically update the user's balance in your database.
      }
    } else if (body.pre_checkout_query) {
        // Answer the pre-checkout query to confirm the transaction
        await bot.answerPreCheckoutQuery(body.pre_checkout_query.id, true);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing Telegram update:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
