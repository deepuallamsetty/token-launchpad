#  Token Launchpad — Smart Contract

The on-chain half of the Token Launchpad dApp: a Solidity factory contract that lets anyone deploy a new ERC-20 token with a custom name, symbol, and supply.

** Frontend Repo:** https://github.com/deepuallamsetty/token-launchpad-frontend
** Live App:** https://token-launchpad-frontend-two.vercel.app/dashboard
** Contract (Sepolia):** 0xcb1452d0a8584eb661067853ED1A42926862779d

---

##  What's in This Repo

```
contracts/     → Solidity source (TokenFactory + ERC-20 template)
test/          → Foundry test suite (unit + fuzz tests)
```

---

##  Smart Contract

A factory contract that lets anyone deploy a new ERC-20 token with a custom name, symbol, and supply, emitting a `TokenCreated` event on every deployment. The frontend reads this event directly to display created tokens — no backend needed.

- Built and tested with **Foundry**
- Full test coverage including fuzz tests
- Deployed to Sepolia testnet

```bash
# Install dependencies
forge install

# Run tests
forge test -vvv

# Check coverage
forge coverage

# Deploy (example)
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

---

##  What I Learned

- Writing and testing a factory contract pattern with Foundry, including fuzz testing
- Emitting and structuring events so a frontend can reliably read on-chain history directly via Ethers.js
- [Add 1 more genuine takeaway specific to a bug you actually hit]



