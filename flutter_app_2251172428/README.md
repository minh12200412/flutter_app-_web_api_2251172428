# Web API Mobile (Flutter)

Flutter client for the `web_api_2251172428` backend. Includes authentication, product browsing, cart, and order flows wired to the provided REST APIs.

## Prerequisites
- Flutter SDK (3.10+ recommended)
- A running instance of the backend API (update `lib/config/api_config.dart` with its base URL)

## Setup
1. Install dependencies:
   ```bash
   flutter pub get
   ```
2. Update API base URL:
   - Open `lib/config/api_config.dart`
   - Set `baseUrl` to your running backend (e.g., `http://localhost:3000` or LAN IP for device testing)
3. Run the app:
   ```bash
   flutter run
   ```

## Feature Map
- Auth: login & register using backend `/auth` endpoints; token stored in memory for requests.
- Products: list & detail view; add to cart.
- Cart: local cart with quantities; place order via `/orders`.
- Orders: list past orders.
- Profile: fetch customer profile data.

## Notes
- Error states are surfaced with SnackBars.
- Token persistence between launches is not implemented; add secure storage if needed.
- This repo is generated without platform folders; run `flutter create .` inside `mobile_app` if you need full Android/iOS structure.
