import React, { useEffect, useState } from "react";
import "@fuel-wallet/sdk";
import { Wallet, Contract } from "fuels";
import "./App.css";
import Connector from './components/connector';
import Playground from "./components/playground";
import { useFuel } from "./components/usefuel";
import {NftAbi__factory} from "./contracts/factories/NftAbi__factory";

const CONTRACT_ID =
  "0x2b77e47ac98d71a04e548e9a4b9790d0e7f8f9d535935bf0151d7a3b075b0749";

function App() {
  const [contract, setContract] = useState<Contract>();
  const [account, setAccount] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [fuel] = useFuel();
  useEffect(() => {
    async function handleConnection() {
      const isConnected = await fuel.isConnected();
      setConnected(isConnected);
      if (isConnected) {
        const curr = await fuel.currentAccount();
        const wallet = await fuel.getWallet(curr);
        setContract(NftAbi__factory.connect(CONTRACT_ID, wallet));
      }
    }

    if (fuel) {
      handleConnection();
    }

    /* eventConnection:start */
    fuel?.on(fuel.events.connection, handleConnection);
    return () => {
      fuel?.off(fuel.events.connection, handleConnection);
    };
  }, [fuel])
  
  // async function setUp() {
  //   if (fuel) {
  //     const [account] = await fuel.accounts();
  //     const wallet = await fuel.getWallet(account);
  //     const nft = NftAbi__factory.connect(CONTRACT_ID, wallet);

  //     setContract(nft);
  //     setAccount(account);
  //     setConnected(true);
  //   }
  // }
// }

  return (
    <div className="App">
      <Connector/>
      {connected ? (
        <>
          {contract ? ( // Check if the contract is available
            <Playground connected={connected} contract={contract} />
          ) : (
            <span>Loading contract...</span>
          )}
        </>
      ) : (
        <div className="notify">Please to connect your wallet first!</div>
      )}
    </div>
  );
}

export default App;

