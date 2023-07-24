import React, { useEffect, useState } from "react";
import "@fuel-wallet/sdk";
import { Wallet, BN, Account } from "fuels";
import "./App.css";
// Import the contract factory -- you can find the name in index.ts.
// You can also do command + space and the compiler will suggest the correct name.
import {NftAbi__factory} from "./contracts/factories/NftAbi__factory";
import { AddressInput, IdentityInput, IdentityOutput } from "./contracts/NftAbi";

// The address of the contract deployed the Fuel testnet
const CONTRACT_ID =
  "0x4f751a218d461104a48234943e17c80a473ef69f7ce916067fe29cdec0b4d817";

  const WALLET_SECRET =
  "";

// Create a Wallet from given secretKey in this case
// The one we configured at the chainConfig.json
const wallet = Wallet.fromPrivateKey(
  WALLET_SECRET,
  "https://beta-3.fuel.network/graphql"
);

const contract = NftAbi__factory.connect(CONTRACT_ID, wallet);


function App() {
  const [connected, setConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [owner, setOwner] = useState<IdentityOutput>();
  const [tokenId, setTokenId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(7);
  const [balance, setBalance] = useState<number>(0);


  useEffect(() => {
    setTimeout(() => {
      checkConnection();
    }, 200);
  }, [connected]);

  async function connect() {
    if (window.fuel) {
      try {
        await window.fuel.connect();
        const [account] = await window.fuel.accounts();
        setConnected(true);
      } catch (err) {
        console.log("error connecting: ", err);
      }
    }
  }

  async function checkConnection() {
    if (window.fuel) {
      const isConnected = await window.fuel.isConnected();
      if (isConnected) {
        const [account] = await window.fuel.accounts();
        setConnected(true);
      }
    }
  }

  async function mint() {
    if (window.fuel) {
      setLoading(true);
      const addresss: AddressInput =  { value: address };
      const id: IdentityInput = { Address: addresss }
      
      try {
        await contract.functions
          .mint(id)
          .txParams({ gasPrice: 1 })
          .call();
      } catch (err) {
        console.log("error sending transaction...", err);
      }
      setTotal(total + 1);
      setLoading(false);
    }
  }

  async function tokenOf() {
    setLoading(true);
    try {
      const { value } = await contract.functions
        .owner_of(new BN(tokenId))
        .get();
      setOwner(value);
    } catch (err) {
      console.log("error sending transaction...", err);
    }
    setLoading(false);
  }

  async function balanceOf() {
    setLoading(true);
    const addresss: AddressInput =  { value: address };
    const id: IdentityInput = { Address: addresss };

    try {
      const { value } = await contract.functions
        .balance_of(id)
        .get()
      setBalance(value.toNumber());
    } catch (err) {
      console.log("error sending transaction...", err);
    }
    setLoading(false);
  }

  return (
    <div className="App">
      {connected ? (
        <div className="Board">
          <div>
            <div>Total supply: {total}</div>
          </div>
          <div>
            <h2>Minting</h2>
            <input type="Address" onChange={(e) => {setAddress(e.target.value)}}/>
            <button onClick={mint} disabled={loading}>
              Mint
            </button>
          </div>

          <div>
            <h2>Owner of</h2>
            <input type="number" onChange={e => setTokenId(parseInt(e.target.value))} />
            <button onClick={tokenOf} disabled={loading}>
              Owner of
            </button>
            <h2>{owner?.Address?.value}</h2>
          </div>

          <div>
            <h2>Balance of</h2>
            <input type="Address" onChange={e => setAddress(e.target.value)} />
            <button onClick={balanceOf} disabled={loading}>
              Balance of
            </button>
            <h2>{balance}</h2>
          </div>
        </div>
      ) : (
        <button onClick={connect}>
          Connect
        </button>
      )}
    </div>
  );
}

export default App;

