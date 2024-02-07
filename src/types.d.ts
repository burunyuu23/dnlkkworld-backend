interface RealmAccess {
  [name: string]: ?string[];
}

export interface BaseUser {
  id: string;
  username: string;
  email: stirng;
  firstName: string;
  secondName?: string;
}

interface ResourceAccess {
  [name: string]: ?{
    [name: string]: ?string[];
  }; // Any represent
}

export interface KeyCloakUserType {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  realm_access: RealmAccess;
  resource_access: ResourceAccess;
  scope: string;
  sid: string;
  email_verified: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email: string;

  // Extra Meta Data in Case needed
  [otherOptions: string]: unknown;
}
