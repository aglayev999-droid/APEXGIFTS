# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the bot script into the container at /app
COPY bot.py .

# Expose the port the app runs on
# Note: Telegram bots use webhooks or long polling and may not need a port exposed publicly
# depending on the setup. We'll keep this commented out unless a webhook is used.
# EXPOSE 8080

# Run bot.py when the container launches
CMD ["python", "bot.py"]
