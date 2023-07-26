import React, { useEffect, useState } from "react";
import "@fuel-wallet/sdk";
import "./connector.css";

function Connector() {
    const [account, setAccount] = useState<string>("");
    const [copied, setCopy] = useState<boolean>(false);
    const [connected, setConnected] = useState<boolean>(false);
    

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
                setAccount(account);
                setConnected(true);
            } catch (err) {
                console.log("error connecting: ", err);
            }
        }
    }

    async function disconnect() {
        if (window.fuel) {
            try {
                await window.fuel.disconnect();
                setAccount("");
                setConnected(false);
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
                setAccount(account);
                setConnected(true);
            }
        }
    }

    function copy() {
        if (window.fuel) {
            navigator.clipboard.writeText(account);
            setCopy(true);
            setTimeout(() => {  setCopy(false); }, 1000);
        }
    }

    function truncate(account: string) {
        return account.substring(0, 5) + "..." + account.substring(59, 64);
    }

    return (
        <div className="connector">
            {connected ? (
                <div className="info">
                    <div className="acc">
                        <h2 onClick={copy} className="account">{truncate(account)}</h2>
                        <span>{copied ? "Copied" : ""}</span>
                    </div>
                    <button className="btn" onClick={disconnect}>
                        Disconnect
                    </button>

                </div>
            ) : (
                <button className="btn" onClick={connect}>
                    Connect
                </button>
            )}
        </div>
    );
}

export default Connector;
