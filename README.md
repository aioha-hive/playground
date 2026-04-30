# Aioha + Magi Playground

Live, interactive demo of [`@aioha/aioha`](https://aioha.dev) and [`@aioha/magi`](https://aioha.dev/docs/magi/overview) running in the browser.

## Run

```sh
pnpm install
cp .env.example .env  # set VITE_REOWN_PROJECT_ID for AppKit (eth + btc)
pnpm dev
```

Then open <http://localhost:5173>.

## What's inside

- **Auth panel** — connect any Aioha provider (Keychain, HiveSigner, HiveAuth, Ledger, PeakVault, MetaMask Snap, view-only) via the production `<AiohaModal>` from `@aioha/react-ui`.
- **Aioha core operations** — sign message, encrypt / decrypt memo, transfer, vote, custom JSON, claim rewards, and a generic op builder for `signAndBroadcastTx` / `signAndBroadcastTxHF26`.
- **Magi multi-chain** — connect Ethereum (eip155) or Bitcoin (bip122) through the same Reown AppKit modal, switch active wallet, and exercise `transfer` / `unmap` / `stake` / `unstake` / `call` / generic `signAndBroadcastTx`. View-only mode lets you inspect any DID.
- **Output console** — every result, error, and Aioha/Magi event lands in one filterable, copy-able log on the right.

## Safety

A global **dry-run toggle** lives in the header. While on, transactional forms log the operation that would be sent instead of broadcasting. Turn it off to send real transactions on Hive mainnet / Magi mainnet.

## Notes

- Bitcoin uses `@reown/appkit-adapter-bitcoin` so wallet selection happens in the same modal as Ethereum. Signatures are ECDSA / BIP-137; `magi-js` handles the SegWit recovery-flag normalization internally.
- HiveSigner's OAuth callback is served at `/hivesigner` (handled by `<HiveSignerCb>` from `@aioha/react-ui`).
- Form values, dark mode, dry-run state, and the Magi API/netId are persisted to `localStorage` under the `aioha-playground:` prefix.
