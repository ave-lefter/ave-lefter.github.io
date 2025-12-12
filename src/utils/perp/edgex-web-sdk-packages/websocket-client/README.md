# WebSocket Client Package

This package provides WebSocket client implementations for connecting to public and private WebSocket APIs of the EdgeX exchange. It handles connection management, subscriptions, and event parsing.

## Installation

Install via npm:

```bash
npm install @edgex-web/websocket-client
```

## Public WebSocket Client

`PublicWebSocketClient` is used for accessing public market data such as tickers, order books, trades, klines (candles), and funding rates.

### Initialization

```typescript
import { PublicWebSocketClient } from '@edgex-web/websocket-client';

const publicClient = new PublicWebSocketClient({
  url: 'wss://quote.edgex.exchange', // Replace with actual WebSocket URL
  // Optional: Connection event handlers
  onOpen: () => console.log('Connected'),
  onClose: () => console.log('Disconnected'),
  onError: (err) => console.error('Error', err),
});

publicClient.connect();
```

### Event Listeners

Use the helper methods to register typed event listeners. These methods return a disposer function to easily remove the listener.

```typescript
// Listen to Ticker updates (for a specific contract)
const unsubscribeTicker = publicClient.onTickers((data) => {
  console.log('Ticker Update:', data);
});

// Listen to ALL Tickers
const unsubscribeAllTickers = publicClient.onAllTickers((data) => {
  console.log('All Tickers Update:', data);
});

// Listen to Order Book Depth
const unsubscribeDepth = publicClient.onDepth((data) => {
  console.log('Depth Update:', data);
});

// Listen to Trades
const unsubscribeTrades = publicClient.onTrades((data) => {
  console.log('Trade Update:', data);
});

// Listen to Klines (Candles)
const unsubscribeCandles = publicClient.onCandles((data) => {
  console.log('Candle Update:', data);
});

// Listen to Funding Rates
const unsubscribeFunding = publicClient.onFundingRate((data) => {
  console.log('Funding Rate Update:', data);
});

// Remove listeners when done
// unsubscribeTicker();
```

### Subscriptions

Manage subscriptions to specific data feeds. The client automatically handles topic string formatting.

**Note:** For contract-specific data (Ticker, Depth, Trade, Candles, Funding Rate), the client enforces a "single active contract" policy to prevent over-subscription when switching views. Calling a subscription method for a *new* contract ID will automatically unsubscribe from the *previous* contract's topics.

```typescript
const contractId = "1001"; // Example Contract ID

// Subscribe to specific feeds
publicClient.subscribeTicker(contractId);
publicClient.subscribeDepth(contractId);
publicClient.subscribeTrade(contractId);
publicClient.subscribeFundingRate(contractId);

// Subscribe to Candles (Interval: '1m', '1h', '1d', etc.)
publicClient.subscribeCandles(contractId, '1m');

// Subscribe to ALL Tickers (Global)
publicClient.subscribeAllTicker();

// Subscribe to Metadata
publicClient.subscribeMetadata();

// Unsubscribe manually if needed
publicClient.unsubscribeTicker(contractId);
```

## Private WebSocket Client

`PrivateWebSocketClient` is used for authenticated user data such as account snapshots, order updates, and asset changes.

### Initialization

Requires a `credentialFactory` to generate authentication parameters (protocols and search params) dynamically.

```typescript
import { PrivateWebSocketClient } from '@edgex-web/websocket-client';

const privateClient = new PrivateWebSocketClient({
  url: 'wss://api.edgex.exchange/v1/private', // Replace with actual Private WS URL
  credentialFactory: () => {
    // Implement logic to retrieve or generate auth credentials
    // e.g., from a stored session token or signature
    const token = getAuthToken(); 
    if (!token) return null;
    
    return {
      protocols: 'json', // or specific protocol if required
      searchParams: `token=${token}`,
    };
  },
});

privateClient.connect();
```

### Event Listeners

```typescript
// Listen to Account Snapshots (Full state on connection)
privateClient.onSnapshot((data) => {
  console.log('Account Snapshot:', data);
});

// Listen to Order/Position Updates (Delta changes)
privateClient.onOrderUpdate((data) => {
  console.log('Order Update:', data);
});

// Listen to Asset Updates (Balance changes)
privateClient.onAssetUpdate((data) => {
  console.log('Asset Update:', data);
});
```

## Base Features

Both clients inherit from `BaseWebSocketClient` and support:

*   **Automatic Reconnection**: Automatically attempts to reconnect on connection loss.
*   **Heartbeat (Ping/Pong)**: Keeps the connection alive.
*   **Raw Subscription Management**: `addSubscriptions` and `removeSubscriptions` for manual topic control.

```typescript
// Manual subscription (if needed for custom topics)
publicClient.addSubscriptions(['custom.topic.1']);
publicClient.removeSubscriptions(['custom.topic.1']);
```
