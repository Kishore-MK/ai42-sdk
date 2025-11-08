// src/browser-payment.ts
import { createX402Client } from 'x402-solana/client';
import { BasePaymentClient } from './payment-client';
import { BrowserPaymentConfig, AI42Error } from './types';
import type { Wallet } from './wallet';
import { SolanaNetwork } from 'x402-solana';

export class BrowserPaymentClient extends BasePaymentClient {
  private x402Client: ReturnType<typeof createX402Client>;

  constructor(config: BrowserPaymentConfig) {
    super();
    
    if (!config.wallet) {
      throw new AI42Error(
        'PAYMENT_FAILED',
        'Wallet is required for browser payment client'
      );
    }

    this.x402Client = createX402Client({
      wallet: config.wallet,
      network: config.network as SolanaNetwork,
      maxPaymentAmount: config.maxPaymentAmount || BigInt(1_000_000),
    });
  }

  async fetch(url: string, options?: RequestInit): Promise<Response> {
    try {
      return await this.x402Client.fetch(url, options);
    } catch (error: any) {
      this.handleError(error, 'Browser payment fetch failed');
    }
  }
}