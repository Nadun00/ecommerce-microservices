#!/bin/bash
# ============================================================
# START ALL SERVICES SCRIPT
# Run this from the project root: bash start-all.sh
# ============================================================

echo "============================================"
echo "   ShopEase E-Commerce - Starting All Services"
echo "============================================"

# Function to install and start a service
start_service() {
  local name=$1
  local dir=$2
  local port=$3

  echo ""
  echo "→ Starting $name (port $port)..."
  cd "$dir"

  # Copy .env if not exists
  if [ ! -f .env ]; then
    cp .env.example .env
    echo "  ✓ Created .env from .env.example"
  fi

  # Install deps if node_modules missing
  if [ ! -d node_modules ]; then
    echo "  ✓ Installing dependencies..."
    npm install --silent
  fi

  # Start in background
  npm start &
  echo "  ✓ $name started (PID: $!)"
  cd - > /dev/null
}

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$ROOT_DIR/backend"

start_service "Product Service"  "$BACKEND/product-service"  3001
start_service "User Service"     "$BACKEND/user-service"     3002
start_service "Cart Service"     "$BACKEND/cart-service"     3003
start_service "Order Service"    "$BACKEND/order-service"    3004
start_service "Payment Service"  "$BACKEND/payment-service"  3005

sleep 2

start_service "API Gateway"      "$BACKEND/api-gateway"      5000

echo ""
echo "============================================"
echo "  All backend services started!"
echo ""
echo "  API Gateway:   http://localhost:5000"
echo "  Product Docs:  http://localhost:5000/product-docs"
echo "  User Docs:     http://localhost:5000/user-docs"
echo "  Cart Docs:     http://localhost:5000/cart-docs"
echo "  Order Docs:    http://localhost:5000/order-docs"
echo "  Payment Docs:  http://localhost:5000/payment-docs"
echo "============================================"
echo ""
echo "  Now start the frontend:"
echo "  cd frontend && npm install && npm start"
echo "============================================"

wait
