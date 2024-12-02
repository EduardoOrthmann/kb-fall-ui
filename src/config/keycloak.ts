import Keycloak, { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'kb-ai',
  clientId: 'kb-ai',
};

const keycloak = new Keycloak(keycloakConfig);
export default keycloak;
