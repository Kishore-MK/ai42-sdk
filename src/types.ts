// ============================================
// Model Types
// ============================================

import { Signer } from "x402-fetch";
import { Wallet } from "./wallet";

export type ModelIdentifier = 
  | 'llama-3.3-70b-versatile'
  | 'openai/gpt-oss-120b'
  | 'gemini-2.5-flash' 
  | 'gemini-2.5-pro';

export type ModelProvider = 'groq' | 'gemini';

// ============================================
// Priority Types
// ============================================

export type Priority = 'fast' | 'quality' | 'cheap';

// ============================================
// Request Types
// ============================================

export interface ChatRequest {
  message: string;
  model?: ModelIdentifier; 
  priority?: Priority; 
  stream?: boolean; 
}

// ============================================
// Response Types
// ============================================

export interface ChatResponse {
  content: string;
  model: ModelIdentifier;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost: number;  
  cached: boolean;
  requestId: string;
  timestamp: number;
}

// ============================================
// SDK Configuration Types
// ============================================

export interface AI42Config {
    apiUrl: string;
    network?: 'solana-mainnet' | 'solana-devnet';
  }
  
  export interface AI42ChatOptions {
    message: string;
    model?: ModelIdentifier;
    priority?: Priority;
  }

  
  export interface PaymentInfo {
    amount: number;
    recipient: string;
    signature: string;
    wallet: string;
  }
  
  export class AI42Error extends Error {
    code: ErrorCode;
    details?: any;
  
    constructor(code: ErrorCode, message: string, details?: any) {
      super(message);
      this.code = code;
      this.details = details;
      this.name = 'AI42Error';
    }
  }



  // ============================================
// Payment Client Types
// ============================================

export interface PaymentClient {
  fetch(url: string, options?: RequestInit): Promise<Response>;
}

export interface PaymentClientConfig {
  network: 'solana-mainnet' | 'solana-devnet' | 'base-sepolia';
  maxPaymentAmount?: bigint;
}

export interface BrowserPaymentConfig extends PaymentClientConfig {
  wallet: Wallet;
}

export interface ServerPaymentConfig extends PaymentClientConfig {
  signer: Signer;
}

 // ============================================
// Error Types
// ============================================

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

export type ErrorCode = 
  | 'INVALID_REQUEST'
  | 'PAYMENT_REQUIRED'
  | 'PAYMENT_FAILED'
  | 'MODEL_ERROR'
  | 'RATE_LIMIT'
  | 'INTERNAL_ERROR';