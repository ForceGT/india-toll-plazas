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
node ./scripts/fetchNhaiData.js || { echo -e "${RED}Failed to fetch toll plaza data${NC}"; exit 1; }

# Step 2: Fetch vehicle types (optional)
echo -e "${YELLOW}Step 2/7: Fetching vehicle types...${NC}"
node ./scripts/getVehicleTypes.js || { echo -e "${YELLOW}Warning: Vehicle types fetch failed (optional)${NC}"; }

# Step 3: Fetch states (optional)
echo -e "${YELLOW}Step 3/7: Fetching states...${NC}"
node ./scripts/getStates.js || { echo -e "${YELLOW}Warning: States fetch failed (optional)${NC}"; }

# Step 4: Process NHAI data
echo -e "${YELLOW}Step 4/7: Processing NHAI data...${NC}"
node ./scripts/processNhai.js || { echo -e "${RED}Failed to process NHAI data${NC}"; exit 1; }

# Step 5: Process state highways data
echo -e "${YELLOW}Step 5/7: Processing state highways data...${NC}"
node ./scripts/processStateHighways.js || { echo -e "${RED}Failed to process state highways data${NC}"; exit 1; }

# Step 6: Merge data sources
echo -e "${YELLOW}Step 6/7: Merging data sources...${NC}"
node ./scripts/merge.js || { echo -e "${RED}Failed to merge data sources${NC}"; exit 1; }

# Copy files to versioned directory
echo -e "${YELLOW}Step 7/7: Organizing versioned data...${NC}"
cp "$DATA_DIR/sources/nhai.json" "$SOURCES_DIR/nhai.json" 2>/dev/null || true
cp "$DATA_DIR/sources/state_highways.json" "$SOURCES_DIR/state_highways.json" 2>/dev/null || true
cp "$DATA_DIR/latest.json" "$VERSIONED_DIR/tollplazas.json"
cp "$DATA_DIR/latest.min.json" "$VERSIONED_DIR/tollplazas.min.json" 2>/dev/null || true

# Log summary
TOTAL_PLAZAS=$(jq 'length' "$DATA_DIR/latest.json" 2>/dev/null || echo "unknown")
PRETTY_SIZE=$(du -h "$DATA_DIR/latest.json" 2>/dev/null | awk '{print $1}')
MIN_SIZE=$(du -h "$DATA_DIR/latest.min.json" 2>/dev/null | awk '{print $1}')
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Data update completed successfully${NC}"
echo -e "${GREEN}Date: $CURRENT_DATE${NC}"
echo -e "${GREEN}Total toll plazas: $TOTAL_PLAZAS${NC}"
echo -e "${GREEN}Output: $DATA_DIR/latest.json (${PRETTY_SIZE})${NC}"
echo -e "${GREEN}Output: $DATA_DIR/latest.min.json (${MIN_SIZE})${NC}"
echo -e "${GREEN}Versioned: $VERSIONED_DIR/tollplazas.json${NC}"
echo -e "${GREEN}Versioned: $VERSIONED_DIR/tollplazas.min.json${NC}"
echo -e "${GREEN}========================================${NC}"
