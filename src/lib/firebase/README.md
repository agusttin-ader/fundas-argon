# Firebase hookup notes (demo)

This demo runs in mock mode by default and does not require Firebase.

To enable Firebase:

1. Copy `.env.example` to `.env.local`.
2. Fill all `NEXT_PUBLIC_FIREBASE_*` values.
3. Switch `NEXT_PUBLIC_DATA_ADAPTER=firestore` only when Firestore adapter methods are implemented.

Current status:
- Auth: integrated with Firebase Auth when env vars exist, fallback mock mode otherwise.
- Firestore data adapter: placeholder, intentionally not active in this demo.
