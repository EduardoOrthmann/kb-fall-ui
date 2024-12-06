import {
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_REALM,
  KEYCLOAK_URL,
} from '@/utils/constants';
import Keycloak, { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: KEYCLOAK_URL ?? 'http://localhost:8080',
  realm: KEYCLOAK_REALM ?? 'kb-ai',
  clientId: KEYCLOAK_CLIENT_ID ?? 'kb-ai',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
