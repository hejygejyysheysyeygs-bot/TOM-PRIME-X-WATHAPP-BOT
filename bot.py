import os
from threading import Thread
from http.server import HTTPServer, BaseHTTPRequestHandler

class DummyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(b"Bot is Running!")

def run_server():
    port = int(os.environ.get("PORT", 8080))
    server = HTTPServer(("0.0.0.0", port), DummyServer)
    server.serve_forever()

# ব্যাকগ্রাউন্ডে পোর্টটি চালু রাখার জন্য Thread ব্যবহার করা হলো
Thread(target=run_server, daemon=True).start()
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    ContextTypes,
    filters,
)
from telegram import InlineKeyboardButton, InlineKeyboardMarkup
from config import BOT_TOKEN, ADMIN_ID, QR_IMAGE

waiting_users = set()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("✅ Payment Done", callback_data="paid")]
    ]

    with open(QR_IMAGE, "rb") as photo:
        await update.message.reply_photo(
            photo=photo,
            caption="📲 আগে Payment করুন তারপর মাল নিন 🤣",
            reply_markup=InlineKeyboardMarkup(keyboard),
        )

async def paid(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    waiting_users.add(query.from_user.id)

    await query.message.reply_text(
        "📸 Payment Screenshot/Proof পাঠান।"
    )

async def receive_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.message.from_user

    if user.id not in waiting_users:
        return

    caption = f"""
✅ নতুন Payment Proof

Name: {user.full_name}
Username: @{user.username}
User ID: {user.id}

এই User Payment করেছে।
দয়া করে যাচাই করে মাল দিন।
"""

    await context.bot.send_photo(
        chat_id=ADMIN_ID,
        photo=update.message.photo[-1].file_id,
        caption=caption,
    )

    await update.message.reply_text(
        "✅ আপনার Proof Admin-এর কাছে পাঠানো হয়েছে। যাচাই শেষে আপনাকে জানানো হবে।"
    )

    waiting_users.remove(user.id)

app = Application.builder().token(BOT_TOKEN).build()

app.add_handler(CommandHandler("start", start))
app.add_handler(CallbackQueryHandler(paid))
app.add_handler(MessageHandler(filters.PHOTO, receive_photo))

app.run_polling()
