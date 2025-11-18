declare module 'passport-kakao' {
  import { Strategy as PassportStrategy } from 'passport';

  export interface KakaoProfile {
    provider: 'kakao';
    id: string;
    displayName: string;
    _raw: string;
    _json: any;
  }

  export interface KakaoStrategyOptions {
    clientID: string;
    clientSecret?: string;
    callbackURL: string;
  }

  export type VerifyCallback = (error: any, user?: any, info?: any) => void;

  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: KakaoProfile,
    done: VerifyCallback
  ) => void;

  export class Strategy extends PassportStrategy {
    constructor(options: KakaoStrategyOptions, verify: VerifyFunction);
  }
}
