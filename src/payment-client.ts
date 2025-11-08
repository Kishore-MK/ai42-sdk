// src/payment-client.ts
import { PaymentClient, PaymentInfo, AI42Error } from './types';

export abstract class BasePaymentClient implements PaymentClient {
  abstract fetch(url: string, options?: RequestInit): Promise<Response>;

  protected extractPaymentInfo(response: Response): PaymentInfo | null {
    const paymentHeader = response.headers.get('x-payment-response');
    
    if (!paymentHeader) {
      return null;
    }

    try {
      const decoded = JSON.parse(atob(paymentHeader));
      return {
        amount: decoded.amount,
        recipient: decoded.recipient,
        signature: decoded.signature,
        wallet: decoded.wallet,
      };
    } catch (error: any) {
      throw new AI42Error(
        'PAYMENT_FAILED',
        'Failed to parse payment response',
        error
      );
    }
  }

  protected handleError(error: any, context: string): never {
    if (error instanceof AI42Error) {
      throw error;
    }

    throw new AI42Error(
      'INTERNAL_ERROR',
      `${context}: ${error.message}`,
      error
    );
  }
}