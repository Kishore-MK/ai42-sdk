import { AI42Error } from "./types";

export interface Wallet {
    publicKey: { toString(): string } | undefined;
    signTransaction: <T>(transaction: T) => Promise<T>;
    signAllTransactions: <T>(transactions: T[]) => Promise<T[]>;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    isConnected: boolean;
  }
  
  declare global {
    interface Window {
      solana?: Wallet & { isPhantom?: boolean };
    }
  }
  
  export async function connectWallet(): Promise<Wallet> {
    if (typeof window === 'undefined') {
      throw new AI42Error(
        'PAYMENT_FAILED',
        'Phantom wallet is only available in browser environments'
      );
    }
  
    const phantom = window.solana;
  
    if (!phantom?.isPhantom) {
      throw new AI42Error(
        'PAYMENT_FAILED',
        'Phantom wallet not found. Please install it from https://phantom.app'
      );
    }
  
    try {
      await phantom.connect();
      
      if (!phantom.publicKey) {
        throw new AI42Error(
          'PAYMENT_FAILED',
          'Failed to connect wallet'
        );
      }
  
      return phantom;
    } catch (error: any) {
      throw new AI42Error(
        'PAYMENT_FAILED',
        `Failed to connect to Phantom: ${error.message}`,
        error
      );
    }
  }
  
  export function getWalletAddress(wallet: Wallet): string {
    if (!wallet.publicKey) {
      throw new AI42Error(
        'PAYMENT_FAILED',
        'Wallet not connected'
      );
    }
    return wallet.publicKey.toString();
  }