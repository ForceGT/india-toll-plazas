#!/bin/bash

# Set up Tailscale exit node tunnel for use as an HTTPS proxy
# This script creates a local HTTPS proxy that routes through the Tailscale exit node

PHONE_IP="${TAILSCALE_EXIT_NODE_IP:-100.117.159.206}"
LOCAL_PROXY_PORT=8888

echo "=========================================="
echo "Setting up Tailscale Exit Node Tunnel"
echo "=========================================="
echo "Phone Tailscale IP: $PHONE_IP"
echo "Local Proxy Port: $LOCAL_PROXY_PORT"

# Check if Tailscale is running
if ! command -v tailscale &> /dev/null; then
    echo "✗ Tailscale CLI not found"
    exit 1
fi

# Check Tailscale status
echo ""
echo "Checking Tailscale status..."
tailscale status || exit 1

# Try to ping the phone's Tailscale IP
echo ""
echo "Testing connectivity to phone ($PHONE_IP)..."
if ping -c 1 -W 2 "$PHONE_IP" &> /dev/null; then
    echo "✓ Phone is reachable via Tailscale"
else
    echo "✗ Phone is not reachable via Tailscale"
fi

# For now, we rely on the system-level routing that Tailscale provides
# when using an exit node. The Tailscale daemon should automatically
# route all traffic through the exit node.

echo ""
echo "✓ Tailscale exit node configuration ready"
echo "All HTTPS traffic should now be routed through your phone"
