export interface AuthPopupConfig {
  url: string;
  width: number;
  height: number;
  title: string;
}

export interface AuthResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  error?: string;
}

export class PopupAuthService {
  private static instance: PopupAuthService;

  public static getInstance(): PopupAuthService {
    if (!PopupAuthService.instance) {
      PopupAuthService.instance = new PopupAuthService();
    }
    return PopupAuthService.instance;
  }

  async authenticateWithPopup(config: AuthPopupConfig): Promise<AuthResult> {
    return new Promise((resolve) => {
      const popup = window.open(
        config.url,
        config.title,
        `width=${config.width},height=${config.height},scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no`
      );

      if (!popup) {
        resolve({ success: false, error: 'Popup blocked. Please allow popups for this site.' });
        return;
      }

      // Center the popup
      const left = (window.screen.width / 2) - (config.width / 2);
      const top = (window.screen.height / 2) - (config.height / 2);
      popup.moveTo(left, top);

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'AUTH_SUCCESS') {
          window.removeEventListener('message', messageListener);
          popup.close();
          resolve({
            success: true,
            accessToken: event.data.accessToken,
            refreshToken: event.data.refreshToken,
            expiresIn: event.data.expiresIn
          });
        } else if (event.data.type === 'AUTH_ERROR') {
          window.removeEventListener('message', messageListener);
          popup.close();
          resolve({
            success: false,
            error: event.data.error
          });
        }
      };

      window.addEventListener('message', messageListener);

      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          resolve({ success: false, error: 'Authentication cancelled by user' });
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        if (!popup.closed) {
          popup.close();
          window.removeEventListener('message', messageListener);
          clearInterval(checkClosed);
          resolve({ success: false, error: 'Authentication timeout' });
        }
      }, 5 * 60 * 1000);
    });
  }

  async authenticatePayPal(): Promise<AuthResult> {
    // In real implementation, this would use PayPal's OAuth URL
    const config: AuthPopupConfig = {
      url: 'https://www.paypal.com/signin/authorize?client_id=demo&response_type=code&scope=openid',
      width: 500,
      height: 600,
      title: 'PayPal Authentication'
    };

    // Simulate successful authentication after 3 seconds
    setTimeout(() => {
      window.postMessage({
        type: 'AUTH_SUCCESS',
        accessToken: `pp_${Math.random().toString(36).substr(2, 32)}`,
        refreshToken: `pp_refresh_${Math.random().toString(36).substr(2, 32)}`,
        expiresIn: 3600
      }, window.location.origin);
    }, 3000);

    return this.authenticateWithPopup(config);
  }

  async authenticatePaysley(): Promise<AuthResult> {
    // In real implementation, this would use Paysley's OAuth URL
    const config: AuthPopupConfig = {
      url: 'https://auth.paysley.com/oauth/authorize?client_id=demo&response_type=code&scope=read_write',
      width: 500,
      height: 600,
      title: 'Paysley Authentication'
    };

    // Simulate successful authentication after 2 seconds
    setTimeout(() => {
      window.postMessage({
        type: 'AUTH_SUCCESS',
        accessToken: `ps_${Math.random().toString(36).substr(2, 32)}`,
        refreshToken: `ps_refresh_${Math.random().toString(36).substr(2, 32)}`,
        expiresIn: 7200
      }, window.location.origin);
    }, 2000);

    return this.authenticateWithPopup(config);
  }

  async setupWebhooks(service: string, accessToken: string): Promise<{ webhookId: string; webhookSecret: string }> {
    // In real implementation, this would set up webhooks with the service
    const webhookData = {
      webhookId: `wh_${service}_${Math.random().toString(36).substr(2, 9)}`,
      webhookSecret: `whsec_${Math.random().toString(36).substr(2, 32)}`
    };

    // Simulate webhook setup
    await new Promise(resolve => setTimeout(resolve, 1000));

    return webhookData;
  }
}

export const popupAuthService = PopupAuthService.getInstance();