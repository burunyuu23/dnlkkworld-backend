import { env } from 'process';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';

import { Authenticated } from './keycloak.decorator.js';
import { BaseUser, KeyCloakUserType } from '@/types.js';

@Injectable()
export class KeycloakAdminService {
  private readonly keycloakAdmin: KeycloakAdminClient;

  constructor() {
    this.keycloakAdmin = new KeycloakAdminClient();
    this.keycloakAdmin.setConfig({
      baseUrl: env.KEYCLOAK_URL,
      realmName: env.KEYCLOAK_REALM,
    });
    this.auth();
  }

  async auth() {
    await this.keycloakAdmin.auth({
      grantType: 'password',
      clientId: env.KEYCLOAK_CLIENT_ID,
      clientSecret: env.KEYCLOAK_SECRET,
      username: env.KEYCLOAK_USER_ADMIN,
      password: env.KEYCLOAK_USER_ADMIN_PASSWORD,
    });
  }

  @Authenticated
  async getUsers() {
    return await this.keycloakAdmin.users.find({});
  }

  @Authenticated
  async getCurrentUserId(accessToken: string) {
    const keycloakAdmin = new KeycloakAdminClient();
    keycloakAdmin.setConfig({
      baseUrl: env.KEYCLOAK_URL,
      realmName: env.KEYCLOAK_REALM,
    });
    keycloakAdmin.setAccessToken(accessToken);
    try {
      const { userId } = await keycloakAdmin.whoAmI.find();
      return userId;
    } catch (e) {
      throw new UnauthorizedException('Неверный accessToken');
    }
  }

  @Authenticated
  async getUserById(id: string) {
    return await this.keycloakAdmin.users.findOne({ id });
  }

  convertToBaseUser(keycloakUser: KeyCloakUserType): BaseUser {
    if (!keycloakUser.given_name) {
      throw new BadRequestException(
        'У пользователя обязательно должно быть имя!!!',
      );
    }
    return {
      id: keycloakUser.sub,
      username: keycloakUser.preferred_username,
      email: keycloakUser.email,
      firstName: keycloakUser.given_name,
      secondName: keycloakUser.family_name,
    };
  }
}
