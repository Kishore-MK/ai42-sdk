# AI42 SDK

<div align="center">

![AI42 Logo](https://via.placeholder.com/150x150?text=AI42)

**True Pay-per-use AI API with automatic crypto payments via HTTP 402**

[![npm version](https://img.shields.io/npm/v/ai42-sdk.svg)](https://www.npmjs.com/package/@ai42-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

[Documentation](#documentation) • [Installation](#installation) • [Quick Start](#quick-start) • [Examples](#examples)

</div>

---

## Overview

AI42 SDK provides seamless access to multiple AI models with automatic cryptocurrency payments using the X402 protocol. Pay only for what you use - no subscriptions, no API keys, just connect your wallet or use a private key.

### ✨ Features

- 🤖 **Multiple AI Models**: Access Llama, GPT, and Gemini models
- 💰 **Pay-per-use**: Automatic payments via Solana/Base using HTTP 402
- 🌐 **Universal**: Works in browser (Phantom wallet) and Node.js (private key)
- ⚡ **Priority Options**: Choose between fast, quality, or cheap responses
- 🔒 **Type-safe**: Full TypeScript support with comprehensive types
- 🎯 **Simple API**: Intuitive methods for common use cases

### 🎯 Supported Models

| Model            | Provider | Identifier                |
| ---------------- | -------- | ------------------------- |
| Llama 3.3 70B    | Groq     | `llama-3.3-70b-versatile` |
| GPT OSS 120B     | OpenAI   | `openai/gpt-oss-120b`     |
| Gemini 2.5 Flash | Google   | `gemini-2.5-flash`        |
| Gemini 2.5 Pro   | Google   | `gemini-2.5-pro`          |

---

## Installation

```bash
npm install @ai42-sdk
```

### Core Peer Dependencies

**For Browser:**

```bash
npm install x402-solana
```

**For Node.js:**

```bash
npm install x402-fetch dotenv
```

---

## Quick Start

### Browser Usage (Phantom Wallet)

```typescript
import { AI42Client } from "@ai42-sdk";
import { connectWallet } from "@ai42-sdk/wallet";

// Connect wallet
const wallet = await connectWallet();

// Create client
const client = AI42Client.fromWallet(
  {
    apiUrl: "https://ai42.onrender.com",
    network: "solana-devnet",
  },
  wallet
);

// Send a message
const response = await client.chat({
  message: "Explain quantum computing",
  model: "llama-3.3-70b-versatile",
});

console.log(response.content);
console.log(`Cost: $${response.cost}`);
```

### Node.js Usage (Signer/Private Key)

```typescript
import { AI42Client } from "@ai42-sdk";
import { config } from "dotenv";

config();

// Create client with signer/private key
const signer = await createSigner(config.network, privateKey);

const client = await AI42Client.fromSigner(
  {
    apiUrl: "https://api.ai42.dev",
    network: "solana-devnet",
  },
  signer
);

// Send a message
const response = await client.chat({
  message: "Write a haiku about AI",
  priority: "fast",
});

console.log(response.content);
```

---

## Documentation

### Client Creation

#### Browser with Wallet

```typescript
AI42Client.fromWallet(config: AI42Config, wallet: Wallet): AI42Client
```

#### Node.js with Private Key

```typescript
AI42Client.fromSigner(config: AI42Config, signer: Signer): Promise<AI42Client>
```

### Configuration

```typescript
interface AI42Config {
  apiUrl: string;
  network?: "solana-mainnet" | "solana-devnet" | "base-sepolia";
}
```

### Chat Methods

#### Basic Chat

```typescript
client.chat(options: AI42ChatOptions): Promise<ChatResponse>
```

```typescript
interface AI42ChatOptions {
  message: string;
  model?: ModelIdentifier;
  priority?: "fast" | "quality" | "cheap";
}
```

#### Chat with Specific Model

```typescript
client.chatWithModel(
  message: string,
  model: ModelIdentifier
): Promise<ChatResponse>
```

#### Chat with Priority

```typescript
client.chatWithPriority(
  message: string,
  priority: 'fast' | 'quality' | 'cheap'
): Promise<ChatResponse>
```

### Response Format

```typescript
interface ChatResponse {
  content: string; // AI response text
  model: ModelIdentifier; // Model used
  tokens: {
    prompt: number; // Input tokens
    completion: number; // Output tokens
    total: number; // Total tokens
  };
  cost: number; // Cost in USD
  cached: boolean; // Whether response was cached
  requestId: string; // Unique request ID
  timestamp: number; // Unix timestamp
}
```

---

## Examples

### Example 1: Simple Question

```typescript
const response = await client.chat({
  message: "What is the capital of France?",
});

console.log(response.content); // "Paris is the capital of France..."
```

### Example 2: Code Generation

```typescript
const response = await client.chatWithModel(
  "Write a function to calculate fibonacci numbers",
  "llama-3.3-70b-versatile"
);

console.log(response.content);
```

### Example 3: Fast Response

```typescript
const response = await client.chatWithPriority(
  "Summarize the news today",
  "fast"
);

console.log(response.content);
console.log(`Responded in ${response.tokens.total} tokens`);
```

### Example 4: Quality over Speed

```typescript
const response = await client.chat({
  message: "Explain the theory of relativity in detail",
  priority: "quality",
  model: "gemini-2.5-pro",
});

console.log(response.content);
```

### Example 5: Error Handling

```typescript
import { AI42Error } from "@ai42-sdk";

try {
  const response = await client.chat({
    message: "Hello AI",
  });
  console.log(response.content);
} catch (error) {
  if (error instanceof AI42Error) {
    console.error(`Error [${error.code}]: ${error.message}`);
    if (error.code === "PAYMENT_FAILED") {
      console.error("Check your wallet balance");
    }
  }
}
```

### Example 6: Browser Integration

```html
<!DOCTYPE html>
<html>
  <head>
    <title>AI42 Chat</title>
  </head>
  <body>
    <button id="connect">Connect Wallet</button>
    <input id="message" placeholder="Ask me anything..." />
    <button id="send">Send</button>
    <div id="response"></div>

    <script type="module">
      import { AI42Client } from "@ai42-sdk";
      import { connectWallet } from "@ai42-sdk/wallet";

      let client;

      document.getElementById("connect").onclick = async () => {
        const wallet = await connectWallet();
        client = AI42Client.fromWallet(
          { apiUrl: "https://ai42.onrender.com" },
          wallet
        );
        alert("Wallet connected!");
      };

      document.getElementById("send").onclick = async () => {
        const message = document.getElementById("message").value;
        const response = await client.chat({ message });
        document.getElementById("response").innerText = response.content;
      };
    </script>
  </body>
</html>
```

---

## Environment Setup

### Node.js .env File

```env
PRIVATE_KEY=your_solana_or_base_private_key_here
API_URL=https://api.ai42.dev
NETWORK=solana-devnet
```

### Getting a Private Key

**Solana:**

```bash
solana-keygen new --outfile ~/.config/solana/id.json
solana-keygen pubkey ~/.config/solana/id.json
```

**Base (Ethereum):**
Use MetaMask or any Ethereum wallet to export your private key.

⚠️ **Never commit private keys to version control!**

---

## Error Handling

The SDK throws `AI42Error` with specific error codes:

| Error Code         | Description                             |
| ------------------ | --------------------------------------- |
| `INVALID_REQUEST`  | Malformed request or invalid parameters |
| `PAYMENT_REQUIRED` | Payment needed to proceed               |
| `PAYMENT_FAILED`   | Payment transaction failed              |
| `MODEL_ERROR`      | AI model returned an error              |
| `RATE_LIMIT`       | Too many requests                       |
| `INTERNAL_ERROR`   | Unexpected error occurred               |

```typescript
try {
  await client.chat({ message: "Hello" });
} catch (error) {
  if (error instanceof AI42Error) {
    switch (error.code) {
      case "PAYMENT_FAILED":
        console.error("Payment issue:", error.message);
        break;
      case "MODEL_ERROR":
        console.error("AI model error:", error.message);
        break;
      default:
        console.error("Error:", error.message);
    }
  }
}
```

---

## Priority Guidelines

| Priority  | Use Case                            | Speed  | Cost | Quality |
| --------- | ----------------------------------- | ------ | ---- | ------- |
| `fast`    | Quick responses, simple queries     | ⚡⚡⚡ | $    | ⭐⭐    |
| `quality` | Complex reasoning, detailed answers | ⚡     | $$$  | ⭐⭐⭐  |
| `cheap`   | Budget-conscious, simple tasks      | ⚡⚡   | $    | ⭐⭐    |

---

## Network Support

| Network | Chain       | Mainnet          | Testnet         |
| ------- | ----------- | ---------------- | --------------- |
| Solana  | Solana      | `solana-mainnet` | `solana-devnet` |
| Base    | Ethereum L2 | `base-mainnet`   | `base-sepolia`  |

---

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type {
  AI42Config,
  AI42ChatOptions,
  ChatResponse,
  ModelIdentifier,
  Priority,
  PaymentInfo,
  AI42Error,
} from "@ai42-sdk";
```

---

## FAQ

### Q: Do I need an API key?

**A:** No! AI42 uses the X402 protocol for automatic payments. Just connect your wallet or provide a private key.

### Q: What cryptocurrencies are supported?

**A:** Currently Solana (SOL/USDC) and Base (ETH/USDC).

### Q: How much does it cost?

**A:** Pay-per-use pricing based on tokens consumed. Prices vary by model and priority. Check `response.cost` for exact costs.

### Q: Can I use this in production?

**A:** Yes! Use `solana-mainnet` or `base-mainnet` for production. Start with testnets for development.

### Q: Is my private key safe?

**A:** Your private key never leaves your machine. It's only used to sign payment transactions locally.

### Q: What if a payment fails?

**A:** The SDK will throw a `PAYMENT_FAILED` error. Check your wallet balance and network connectivity.

---

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Feat: Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## Support

- 🐦 Twitter: [@ai42_dev](https://twitter.com/ai42_dev)
- 📖 Docs: [docs.ai42.dev](https://docs.ai42.dev)

---

## Acknowledgments

Built with:

- [X402 Protocol](https://x402.org) - HTTP 402 payment standard
- [x402-solana](https://github.com/x402/x402-solana) - Solana payment client
- [x402-fetch](https://github.com/x402/x402-fetch) - Node.js payment wrapper

---

<div align="center">

**Made with ❤️ by the AI42 Team**

[Website](https://ai42.dev) • [Documentation](https://docs.ai42.dev) • [GitHub](https://github.com/Kishore-MK/ai42-sdk)

</div>
