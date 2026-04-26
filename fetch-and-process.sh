#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}India Toll Plazas - Data Fetch & Process${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if running in GitHub Actions and set up Tailscale if needed
if [ -n "$GITHUB_ACTIONS" ]; then
  echo -e "${YELLOW}Setting up Tailscale for GitHub Actions...${NC}"
  
  # Connect to Tailscale using the auth key
  if [ -z "$TAILSCALE_AUTH_KEY" ]; then
    echo -e "${RED}Error: TAILSCALE_AUTH_KEY not set${NC}"
    exit 1
  fi
  
  echo "Initializing Tailscale..."
  # Use --accept-routes and --accept-dns flags to avoid interactive prompts
  sudo tailscale up --authkey="$TAILSCALE_AUTH_KEY" --accept-dns=false --accept-routes=true 2>&1 || true
  
  # Wait for Tailscale to connect
  echo "Waiting for Tailscale connection..."
  for i in {1..30}; do
    STATUS=$(sudo tailscale status 2>&1)
    if echo "$STATUS" | grep -q "100\\."; then
      echo "✓ Tailscale connected"
      break
    fi
    echo "Attempt $i/30..."
    sleep 1
  done
  
  # Discover and set exit node
  echo "Discovering Tailscale exit node..."
  PHONE_IP=$(sudo tailscale status 2>&1 | grep -i "android\|mobile\|phone" | awk '{print $1}' | head -1)
  
  if [ -z "$PHONE_IP" ]; then
    echo "Could not auto-discover phone IP, using fallback..."
    PHONE_IP="100.71.85.41"
  fi
  
  echo "Phone Tailscale IP: $PHONE_IP"
  echo "Configuring exit node..."
  sudo tailscale set --exit-node="$PHONE_IP" --exit-node-allow-lan-access=true 2>&1 || true
  echo "✓ Tailscale exit node configured"
  sleep 2
else
  echo -e "${YELLOW}Running locally (not in GitHub Actions)${NC}"
fi

# Get current date
CURRENT_DATE=$(date +%Y-%m-%d)
DATA_DIR="./data"
VERSIONED_DIR="$DATA_DIR/$CURRENT_DATE"
SOURCES_DIR="$VERSIONED_DIR/sources"

# Create directories
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p "$VERSIONED_DIR"
mkdir -p "$SOURCES_DIR"
mkdir -p "$DATA_DIR/sources"

# Ensure scripts directory has execute permissions
chmod +x ./scripts/*.js

# Step 1: Fetch NHAI toll plaza names and details
echo -e "${YELLOW}Step 1/7: Fetching NHAI toll plaza names and details...${NC}"
node ./scripts/fetchWithTailscale.js || { echo -e "${RED}Failed to fetch toll plaza data${NC}"; exit 1; }

# Skip old fetch steps as Puppeteer handles both name and details
echo -e "${YELLOW}Step 2/7: Skipping separate detail fetch (already done by Puppeteer)...${NC}"

# Step 3: Fetch vehicle types (optional)
echo -e "${YELLOW}Step 3/7: Fetching vehicle types...${NC}"
node ./scripts/getVehicleTypes.js || { echo -e "${YELLOW}Warning: Vehicle types fetch failed (optional)${NC}"; }

# Step 4: Fetch states (optional)
echo -e "${YELLOW}Step 4/7: Fetching states...${NC}"
node ./scripts/getStates.js || { echo -e "${YELLOW}Warning: States fetch failed (optional)${NC}"; }

# Step 5: Process NHAI data
echo -e "${YELLOW}Step 5/7: Processing NHAI data...${NC}"
node ./scripts/processNhai.js || { echo -e "${RED}Failed to process NHAI data${NC}"; exit 1; }

# Step 6: Process state highways data
echo -e "${YELLOW}Step 6/7: Processing state highways data...${NC}"
node ./scripts/processStateHighways.js || { echo -e "${RED}Failed to process state highways data${NC}"; exit 1; }

# Step 7: Merge data sources
echo -e "${YELLOW}Step 7/7: Merging data sources...${NC}"
node ./scripts/merge.js || { echo -e "${RED}Failed to merge data sources${NC}"; exit 1; }

# Copy files to versioned directory
echo -e "${YELLOW}Organizing versioned data...${NC}"
cp "$DATA_DIR/sources/nhai.json" "$SOURCES_DIR/nhai.json" 2>/dev/null || true
cp "$DATA_DIR/sources/state_highways.json" "$SOURCES_DIR/state_highways.json" 2>/dev/null || true
cp "$DATA_DIR/latest.json" "$VERSIONED_DIR/tollplazas.json"

# Log summary
TOTAL_PLAZAS=$(jq 'length' "$DATA_DIR/latest.json" 2>/dev/null || echo "unknown")
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Data update completed successfully${NC}"
echo -e "${GREEN}Date: $CURRENT_DATE${NC}"
echo -e "${GREEN}Total toll plazas: $TOTAL_PLAZAS${NC}"
echo -e "${GREEN}Output: $DATA_DIR/latest.json${NC}"
echo -e "${GREEN}Versioned: $VERSIONED_DIR/tollplazas.json${NC}"
echo -e "${GREEN}========================================${NC}"
