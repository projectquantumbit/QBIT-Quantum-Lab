# QBIT — The Quantum Bit

**Computing Beyond Binary.** A fully interactive, dependency-free quantum circuit studio for the browser, with custom QBIT branding and optional Solana wallet connectivity.

![QBIT banner](assets/quantum-banner.png)

## Get started

Download this repository as a ZIP, extract it, and run a simple static HTTP server:

```bash
cd QBIT-Quantum-Lab
python3 -m http.server 8080
```

Visit **http://localhost:8080** in your browser. No `npm install`, API keys, database, or private quantum computer are required.

> ES modules need an HTTP server. Some browsers block module imports when `index.html` is opened with `file://` directly. GitHub Pages and normal web hosting both work.

## Included

- **Overview:** responsive landing page with the QBIT visual identity.
- **Quantum Lab:** mathematically accurate complex-amplitude state-vector simulation for up to **8 qubits**, interactive Bloch visualization, gate sequence editing, step controls, single-qubit measurement collapse, Born-rule probability distributions, and shot sampling.
- **Circuit Builder:** selectable gates and a grid you can click or drag gates onto, circuit renaming, save/load locally, JSON import/export, SVG diagram export, and supported OpenQASM 2 export.
- **Experiments:** superposition, Bell-state entanglement, quantum interference, the coherent portion of teleportation, two-qubit Grover search, and three-qubit quantum Fourier transform.
- **Learn:** short explanations of eight key quantum concepts, with one-click examples.
- **Ecosystem:** a Solana/QBIT information page and **optional** wallet connect/disconnect for compatible injected wallets.

### Available gates

`H X Y Z S S† T T† RX RY RZ CX CZ SWAP CCX CP`

**IMPORTANT:** This is a **classical simulation** of quantum state vectors, not execution on physical quantum hardware. It has no third-party network dependencies for simulation. Randomly generated measurement samples are not hardcoded statistical results.

### Limitations / honest scope

- A maximum of 8 qubits is deliberate for a smooth, local educational app; larger state vectors grow exponentially.
- Circuit gates execute chronologically by `step`; putting multiple operations in one step gives a fixed array order, not a parallel hardware scheduling guarantee.
- The teleportation example demonstrates gate preparation **only**. Full conditional mid-circuit measurement and classical feed-forward have **not** been implemented; the UI explicitly says so.
- The circuit exporter supports JSON and SVG for all supported gates. OpenQASM 2 export supports most gates but rejects `CP` because standard `qelib1.inc` does not define it portably.
- Shared links encode the circuit directly in the URL (no backend). Long circuits should use JSON export instead.
- Circuits saved through the UI reside in that browser's localStorage, not in cloud accounts.
- Optional wallet connection only requests an address using a browser wallet. No token transactions, token holdings, fabricated market data, or on-chain features are included. A token mint has **not** been configured.
- The external Google Fonts import can fail offline; system fonts are configured as fallbacks.

## Tests

Node.js 20+ is recommended. The simulator uses no npm packages.

```bash
node --test tests/*.test.mjs
```

Includes verification of the Born-rule distribution, gates, entanglement, state normalization, interference, Grover's search, measurement collapse, validation and JSON/QASM round trips.

## How to publish to GitHub

1. Create a new repository named `QBIT-Quantum-Lab` at [github.com/new](https://github.com/new).
2. Upload the **contents of the extracted ZIP** (not a nested ZIP file), including `.github/workflows/pages.yml`. Use **Add file → Upload files** or use git from your computer.
3. Under **Settings → Pages**, choose **GitHub Actions** as the build and deployment source.
4. The included workflow runs automated tests and deploys the static site on a push to `main`.
5. Your site will become available at `https://YOUR_USERNAME.github.io/QBIT-Quantum-Lab/` when deployment succeeds. Because asset URLs are relative, the site works under a repo subpath.

Or using git:

```bash
cd QBIT-Quantum-Lab
git init
git add .
git commit -m "Initial QBIT Quantum Lab"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/QBIT-Quantum-Lab.git
git push -u origin main
```

## Project structure

```text
QBIT-Quantum-Lab/
├── index.html                # entry point, metadata
├── styles.css                # complete responsive design
├── src/
│   ├── main.js               # app, routing, UI, interactions
│   ├── quantum.mjs           # independent real state-vector simulator
│   ├── bloch.js              # interactive Bloch-sphere Canvas renderer
│   └── content.js            # experiments and lesson metadata
├── assets/
│   ├── qbit-logo.png         # QBIT logo
│   └── quantum-banner.png    # project banner
├── tests/quantum.test.mjs    # quantum mathematical tests
└── .github/workflows/pages.yml
```

## Security and privacy

- State-vector calculations run entirely on your device.
- Wallet connection is optional, and no private keys are collected or stored.
- No backend, account system, analytics, or wallet-signing requests are included.
- User-created circuit names are escaped before they are displayed in HTML.

## License

MIT. See [`LICENSE`](LICENSE).
