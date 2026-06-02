#!/bin/bash

# Port used by Vite
PORT=5180

echo "🔍 Checking for existing server on port $PORT..."
if command -v fuser &> /dev/null; then
    fuser -k $PORT/tcp 2>/dev/null
    echo "✅ Port $PORT cleared using fuser."
else
    PID=$(lsof -t -i:$PORT)
    if [ -n "$PID" ]; then
        echo "💀 Killing existing server (PID: $PID)..."
        kill -9 $PID
        sleep 1
    else
        echo "✅ No server found on port $PORT."
    fi
fi

if [ ! -d "node_modules" ]; then
    echo "📦 node_modules not found. Installing dependencies..."
    npm install
fi

echo "🚀 Starting fresh Vite server on port $PORT..."
# Run in background and redirect output to a log file
npx vite --port $PORT --strictPort --host > server.log 2>&1 &
SERVER_PID=$!

echo "⏳ Waiting for server to initialize..."
MAX_RETRIES=20
COUNT=0
while ! curl -s "http://localhost:$PORT" > /dev/null; do
    sleep 1
    COUNT=$((COUNT+1))
    if [ $COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Server failed to respond on $PORT within $MAX_RETRIES seconds."
        exit 1
    fi
done


URL="http://localhost:$PORT"
echo "🌐 Opening $URL in Chrome..."

# Android specific: termux-open uses the default browser (Chrome if set)
if command -v termux-open &> /dev/null; then
    termux-open "$URL"
else
    # Fallback for other environments if needed
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$URL"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open "$URL"
    fi
fi

echo "✨ Done. Server is running at PID: $SERVER_PID"
echo "📄 Check server.log for logs."
