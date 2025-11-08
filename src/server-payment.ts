// src/server-payment.ts
import { wrapFetchWithPayment, createSigner } from 'x402-fetch';
import { BasePaymentClient } from './payment-client';
import { ServerPaymentConfig, AI42Error } from './types';

export class ServerPaymentClient extends BasePaymentClient {
  private fetchWithPayment!: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  private initPromise: Promise<void>;

  constructor(config: ServerPaymentConfig) {
    super();
    
    if (!config.signer) {
      throw new AI42Error(
        'PAYMENT_FAILED',
        'Signer is required for server payment client'
      );
    }

    this.initPromise = this.initialize(config);
  }

  private async initialize(config: ServerPaymentConfig): Promise<void> {
    try {
      this.fetchWithPayment = wrapFetchWithPayment(fetch, config.signer);
    } catch (error: any) {
      this.handleError(error, 'Failed to initialize server payment client');
    }
  }

  async fetch(url: string, options?: RequestInit): Promise<Response> {
    await this.initPromise;

    try {
      return await this.fetchWithPayment(url, options);
    } catch (error: any) {
      this.handleError(error, 'Server payment fetch failed');
    }
  }
}