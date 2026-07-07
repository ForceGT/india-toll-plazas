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

# ----------------------------------------------------------------------------
# Closed-loop expressway per-plaza rates (Mumbai-Pune, Yamuna, Samruddhi, etc.)
# are NOT discoverable via routing APIs: TollGuru/HERE only return a route TOTAL
# for ticket/closed systems and mis-attribute the per-plaza split. Those rates
# are published in operator notifications and are stable for years, so they are
# hand-curated in data/sources/curated/expressway_rates.json (with source +
# validity). Step 7 below (merge.js) applies those authoritative corrections for
# free on every run. NHAI RajMargYatra remains the source of truth for the
# open-barrier NH plazas that make up the bulk of the dataset.
# ----------------------------------------------------------------------------

# Get current month-year snapshot key (MM-YYYY)
CURRENT_DATE=$(date +%m-%Y)
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
echo -e "${YELLOW}Step 1/11: Fetching NHAI toll plaza names and details...${NC}"
node ./scripts/fetchNhaiData.js || { echo -e "${RED}Failed to fetch toll plaza data${NC}"; exit 1; }

# Step 2: Refresh NETC Plaza Master PDF reference (optional — supplementary cross-check
# doc only, does not feed merge.js; see data/sources/netc/README.md)
echo -e "${YELLOW}Step 2/11: Checking NETC Plaza Master for updates...${NC}"
node ./scripts/fetchNetcPlazaMaster.js || { echo -e "${YELLOW}Warning: NETC Plaza Master check failed (optional)${NC}"; }

# Step 3: Fetch vehicle types (optional)
echo -e "${YELLOW}Step 3/11: Fetching vehicle types...${NC}"
node ./scripts/getVehicleTypes.js || { echo -e "${YELLOW}Warning: Vehicle types fetch failed (optional)${NC}"; }

# Step 4: Fetch states (optional)
echo -e "${YELLOW}Step 4/11: Fetching states...${NC}"
node ./scripts/getStates.js || { echo -e "${YELLOW}Warning: States fetch failed (optional)${NC}"; }

# Step 5: Process NHAI data
echo -e "${YELLOW}Step 5/11: Processing NHAI data...${NC}"
node ./scripts/processNhai.js || { echo -e "${RED}Failed to process NHAI data${NC}"; exit 1; }

# Step 6: Collect state highway data from individual files
echo -e "${YELLOW}Step 6/11: Collecting state highway data...${NC}"
node ./scripts/collectStateHighways.js || { echo -e "${RED}Failed to collect state highway data${NC}"; exit 1; }

# Step 7: Process state highways data
echo -e "${YELLOW}Step 7/11: Processing state highways data...${NC}"
node ./scripts/processStateHighways.js || { echo -e "${RED}Failed to process state highways data${NC}"; exit 1; }

# Step 8: Merge data sources (also applies the committed directional overlay, if present)
echo -e "${YELLOW}Step 8/11: Merging data sources...${NC}"
node ./scripts/merge.js || { echo -e "${RED}Failed to merge data sources${NC}"; exit 1; }

# Step 9: Report stale/expired curated rates (optional — warn-only maintenance worklist,
# never blocks the pipeline; see scripts/reportStaleRates.js)
echo -e "${YELLOW}Step 9/11: Checking for stale curated rates...${NC}"
node ./scripts/reportStaleRates.js || { echo -e "${YELLOW}Warning: Stale rate report failed (optional)${NC}"; }

# Step 10: Generate per-state and main README docs (optional — docs should not block a data run)
echo -e "${YELLOW}Step 10/11: Generating per-state README docs...${NC}"
node ./scripts/generateReadmes.js || { echo -e "${YELLOW}Warning: README generation failed (optional)${NC}"; }

# Copy files to versioned directory
echo -e "${YELLOW}Step 11/11: Organizing versioned data...${NC}"
cp "$DATA_DIR/sources/nhai.json" "$SOURCES_DIR/nhai.json" 2>/dev/null || true
cp "$DATA_DIR/sources/state_highways.json" "$SOURCES_DIR/state_highways.json" 2>/dev/null || true
cp "$DATA_DIR/latest.json" "$VERSIONED_DIR/tollplazas.json"

# Log summary
TOTAL_PLAZAS=$(jq 'length' "$DATA_DIR/latest.json" 2>/dev/null || echo "unknown")
SIZE=$(du -h "$DATA_DIR/latest.json" 2>/dev/null | awk '{print $1}')
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Data update completed successfully${NC}"
echo -e "${GREEN}Date: $CURRENT_DATE${NC}"
echo -e "${GREEN}Total toll plazas: $TOTAL_PLAZAS${NC}"
echo -e "${GREEN}Output: $DATA_DIR/latest.json (${SIZE})${NC}"
echo -e "${GREEN}Versioned: $VERSIONED_DIR/tollplazas.json${NC}"
echo -e "${GREEN}========================================${NC}"
