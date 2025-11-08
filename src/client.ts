// src/client.ts
import { 
  AI42Config, 
  AI42ChatOptions, 
  ChatResponse, 
  AI42Error,
  ModelIdentifier,
  Priority,
  PaymentClient,
  BrowserPaymentConfig,
  ServerPaymentConfig
} from './types';
import { BrowserPaymentClient } from './browser-payment';
import { ServerPaymentClient } from './server-payment';
import type { Wallet } from './wallet';
import { Signer } from 'x402-fetch';

export class AI42Client {
  private paymentClient: PaymentClient;
  private apiUrl: string;

  private constructor(config: AI42Config, paymentClient: PaymentClient) {
    this.apiUrl = config.apiUrl;
    this.paymentClient = paymentClient;
  }

  static fromWallet(config: AI42Config, wallet: Wallet): AI42Client {
    const paymentConfig: BrowserPaymentConfig = {
      wallet,
      network: config.network || 'solana-devnet',
      maxPaymentAmount: BigInt(1_000_000),
    };
    
    const paymentClient = new BrowserPaymentClient(paymentConfig);
    return new AI42Client(config, paymentClient);
  }

  static async fromSigner(
    config: AI42Config, 
    signer: Signer
  ): Promise<AI42Client> {
    const paymentConfig: ServerPaymentConfig = {
      signer:signer,
      network: config.network || 'solana-devnet',
      maxPaymentAmount: BigInt(1_000_000),
    };
    
    const paymentClient = new ServerPaymentClient(paymentConfig);
    return new AI42Client(config, paymentClient);
  }

  async chat(options: AI42ChatOptions): Promise<ChatResponse> {
    const { message, model, priority } = options;
  
    try {
      const response = await this.paymentClient.fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          model,
          priority,
        }),
      });
  
      const result = await response.json(); 
      
      if (result.error) {
        throw new AI42Error(
          'MODEL_ERROR',
          result.error || 'Request failed',
          result
        );
      }
  
      return result;
    } catch (error: any) {
      if (error instanceof AI42Error) {
        throw error;
      }
      
      throw new AI42Error(
        'INTERNAL_ERROR',
        `Chat request failed: ${error.message}`,
        error
      );
    }
  }

  async chatWithModel(
    message: string,
    model: ModelIdentifier
  ): Promise<ChatResponse> {
    return this.chat({ message, model });
  }

  async chatWithPriority(
    message: string,
    priority: Priority
  ): Promise<ChatResponse> {
    return this.chat({ message, priority });
  }
}