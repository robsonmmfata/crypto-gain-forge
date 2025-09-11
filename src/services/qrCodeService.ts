import QRCode from 'qrcode';

export interface QRCodeData {
  address: string;
  amount?: string;
  network?: string;
  memo?: string;
}

export interface QRCodeResult {
  dataURL: string;
  text: string;
}

class QRCodeService {
  /**
   * Generate QR code for USDT deposit
   * @param address - USDT wallet address
   * @param amount - Optional amount to pre-fill
   * @param network - Blockchain network (default: BSC for BEP20)
   * @returns Promise with QR code data URL and text
   */
  async generateUSDTQRCode(
    address: string,
    amount?: string,
    network: string = 'BSC'
  ): Promise<QRCodeResult> {
    try {
      // Create USDT payment URI
      let uri = `usdt:${address}`;

      // Add parameters
      const params = new URLSearchParams();

      if (amount) {
        params.append('amount', amount);
      }

      if (network) {
        params.append('network', network);
      }

      const paramString = params.toString();
      if (paramString) {
        uri += `?${paramString}`;
      }

      // Generate QR code
      const dataURL = await QRCode.toDataURL(uri, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      return {
        dataURL,
        text: uri
      };
    } catch (error) {
      console.error('Error generating USDT QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code for generic crypto address
   * @param address - Cryptocurrency wallet address
   * @param coin - Coin symbol (BTC, ETH, USDT, etc.)
   * @param amount - Optional amount
   * @returns Promise with QR code data URL and text
   */
  async generateCryptoQRCode(
    address: string,
    coin: string = 'USDT',
    amount?: string
  ): Promise<QRCodeResult> {
    try {
      let uri = `${coin.toLowerCase()}:${address}`;

      if (amount) {
        uri += `?amount=${amount}`;
      }

      const dataURL = await QRCode.toDataURL(uri, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      return {
        dataURL,
        text: uri
      };
    } catch (error) {
      console.error('Error generating crypto QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code for Binance Pay
   * @param merchantId - Binance Pay merchant ID
   * @param amount - Amount to charge
   * @param currency - Currency (USDT, BUSD, etc.)
   * @returns Promise with QR code data URL and text
   */
  async generateBinancePayQRCode(
    merchantId: string,
    amount: string,
    currency: string = 'USDT'
  ): Promise<QRCodeResult> {
    try {
      // Binance Pay URI format
      const uri = `binancepay://pay?merchantId=${merchantId}&amount=${amount}&currency=${currency}`;

      const dataURL = await QRCode.toDataURL(uri, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      return {
        dataURL,
        text: uri
      };
    } catch (error) {
      console.error('Error generating Binance Pay QR code:', error);
      throw new Error('Failed to generate Binance Pay QR code');
    }
  }

  /**
   * Generate QR code with custom text
   * @param text - Any text to encode in QR code
   * @param options - QR code generation options
   * @returns Promise with QR code data URL and text
   */
  async generateCustomQRCode(
    text: string,
    options: {
      width?: number;
      margin?: number;
      color?: {
        dark?: string;
        light?: string;
      };
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    } = {}
  ): Promise<QRCodeResult> {
    try {
      const defaultOptions = {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M' as const
      };

      const finalOptions = { ...defaultOptions, ...options };

      const dataURL = await QRCode.toDataURL(text, finalOptions);

      return {
        dataURL,
        text
      };
    } catch (error) {
      console.error('Error generating custom QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Validate cryptocurrency address format
   * @param address - Address to validate
   * @param coin - Coin type for validation
   * @returns boolean indicating if address is valid
   */
  validateAddress(address: string, coin: string = 'USDT'): boolean {
    if (!address || typeof address !== 'string') {
      return false;
    }

    // Remove any whitespace
    address = address.trim();

    // Basic length check
    if (address.length < 20 || address.length > 100) {
      return false;
    }

    // Check for valid characters (alphanumeric + some special chars)
    const validChars = /^[a-zA-Z0-9]+$/;
    if (!validChars.test(address.replace(/[^a-zA-Z0-9]/g, ''))) {
      return false;
    }

    // Coin-specific validations
    switch (coin.toUpperCase()) {
      case 'BTC':
        // Bitcoin addresses start with 1, 3, or bc1
        return /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})$/.test(address);

      case 'ETH':
      case 'USDT':
        // Ethereum/USDT addresses start with 0x and are 42 characters long
        return /^0x[a-fA-F0-9]{40}$/.test(address);

      case 'BNB':
        // BNB addresses start with bnb1 and are 42 characters long
        return /^bnb1[a-z0-9]{38}$/.test(address);

      default:
        // Generic validation for other coins
        return address.length >= 20 && address.length <= 100;
    }
  }

  /**
   * Format amount for QR code
   * @param amount - Amount as string or number
   * @param decimals - Number of decimal places
   * @returns Formatted amount string
   */
  formatAmount(amount: string | number, decimals: number = 2): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numAmount.toFixed(decimals);
  }
}

export const qrCodeService = new QRCodeService();
export default qrCodeService;
