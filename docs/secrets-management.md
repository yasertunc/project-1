# Secrets & Keystore Management (12.4)

## Required Secrets

| Name                                                     | Purpose                           | Storage recommendation                              |
| -------------------------------------------------------- | --------------------------------- | --------------------------------------------------- |
| `EXPO_TOKEN`                                             | Expo CLI auth for EAS builds      | GitHub Secrets + Expo Access Tokens                 |
| `ANDROID_KEYSTORE_BASE64`                                | Android signing keystore (Base64) | GitHub Secrets / Expo Secret (`eas secret:create`)  |
| `KEY_ALIAS`, `KEY_PASSWORD`, `KEYSTORE_PASSWORD`         | Android keystore metadata         | GitHub Secrets / Expo Secret                        |
| `ASC_API_KEY_ID`, `ASC_API_KEY_ISSUER`, `ASC_API_KEY_P8` | App Store Connect API key         | GitHub Secrets / secure vault                       |
| `FIREBASE_SERVER_KEY`, `GOOGLE_SERVICES_JSON`            | Push notifications                | Secure file storage (private repo / secret manager) |
| `EAS_BUILD_PROFILE` (JSON)                               | Optional custom profile overrides | Expo secret (per profile)                           |

## Storage Strategy

1. **Local dev:** store `.keystore` plus JSON configs in an encrypted vault (BitLocker, macOS Keychain, 1Password). Never commit these files.
2. **GitHub Actions:** add secrets via repository settings → “Secrets and variables” → “Actions”.
3. **Expo / EAS:** run `eas secret:create --scope project` for each environment-specific secret. Refer to them inside `eas.json` using `process.env`.
4. **Documentation:** list required secrets in `docs/secrets-management.md` (this file) and restrict access to repo collaborators only.

## Android Signing

- Generate keystore:
  ```bash
  keytool -genkeypair -v -storetype PKCS12 -keystore fellowus-release.keystore -alias fellowus -keyalg RSA -keysize 2048 -validity 10000
  ```
- Encode:
  ```bash
  base64 fellowus-release.keystore > fellowus-release.keystore.base64
  ```
- Store Base64 content in secrets + keep raw keystore offline (encrypted vault).

## iOS App Store Connect

- Create API Key (Roles: Admin or App Manager).
- Download `.p8` file once; store in secure vault.
- Add `ASC_API_KEY_ID`, `ASC_API_KEY_ISSUER`, and Base64-encoded `.p8` content as secrets.

## Rotation Policy

- Rotate Expo tokens every 90 days or when contributors change.
- Rotate keystore only if compromised (changing requires Play Console update).
- Log secret creation dates in a private runbook and set calendar reminders.

## Auditing & Monitoring

- Use GitHub’s secret scanning alerts and enable “Push Protection”.
- Run periodic `git secrets --scan` (can be automated via Husky/CI).
- Keep an inventory file (private) mapping each secret to owner/responsible engineer.
