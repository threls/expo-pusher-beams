import {
  ITokenProvider,
  TokenProviderResponse,
} from '@pusher/push-notifications-web';

export class LocalTokenProvider implements ITokenProvider {
  token: string;
  constructor(token: string) {
    this.token = token;
  }

  fetchToken(userId: string): Promise<TokenProviderResponse> {
    return Promise.resolve({ token: this.token });
  }
}
