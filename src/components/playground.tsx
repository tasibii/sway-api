import React, { useState } from "react";
import "@fuel-wallet/sdk";
import "./playground.css";
import { Contract, BN, Address } from "fuels";
import { AddressInput, IdentityInput, IdentityOutput } from "../contracts/NftAbi";


interface IPlayground {
    connected: boolean;
    contract: Contract
}

function Playground(props: IPlayground) {
    const [account, setAccount] = useState<string>("");
    const [account1, setAccount1] = useState<string>("");

    const [owner, setOwner] = useState<IdentityOutput>();
    const [tokenId, setTokenId] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>();
    const [addr, setAddress] = useState<string>();

    async function mint() {
        if (window.fuel) {
            if (account) {
                setLoading(true);
                const address = convertToAddress(account); 
                const id: IdentityInput = identifyString(address);
                try {
                    await props.contract.functions
                        .mint(id)
                        .txParams({ gasPrice: 1 })
                        .call();
                } catch (err) {
                    console.log("error sending transaction...", err);
                }
                setLoading(false);
            }
        }
    }

    async function tokenOf() {
        if (window.fuel) {
            if (tokenId) {
                setLoading(true);
                try {
                    const { value } = await props.contract.functions
                        .owner_of(new BN(tokenId))
                        .get();
                    setOwner(value);
                } catch (err) {
                    console.log("error sending transaction...", err);
                }
                setLoading(false);
            }
        }
    }

    async function balanceOf() {
        if (window.fuel) {
            if (account) {
                setLoading(true);
                const address = convertToAddress(account); 
                const id: IdentityInput = identifyString(address);
                try {
                    const { value } = await props.contract.functions
                        .balance_of(id)
                        .get()
                    setBalance(value.toNumber());
                } catch (err) {
                    console.log("error sending transaction...", err);
                }
                setLoading(false);
            }
        }
    }

    async function transfer() {
        if (window.fuel) {
            if (account && account1) {
                setLoading(true);
                const acc1 = convertToAddress(account);
                const acc2 = convertToAddress(account1);

                const id1: IdentityInput = identifyString(acc1);
                const id2: IdentityInput = identifyString(acc2);

                try {
                    await props.contract.functions
                        .transfer_from(id1, id2, new BN(tokenId))
                        .txParams({ gasPrice: 1 })
                        .call();
                } catch (err) {
                    console.log("error sending transaction...", err);
                }
                setLoading(false);
            }
        }
    }

    function convertToAddress(account: string) {
        const toAddress = Address.fromString(account);
        return toAddress.toHexString();
    }

    function identifyString(address: string) {
        const addrInput: AddressInput = {value: address};
        const id: IdentityInput = {Address: addrInput};
        return id;
    }

    return (
        <div className="playground">
            <div>
                <h2>Convert to address</h2>
                <input type="text" placeholder="account (string)" onChange={(e) => { setAddress(convertToAddress(e.target.value)) } } required/>
                <input type="text" placeholder="converted (address)" value={addr ? addr : ""} disabled/>
            </div>
            <hr></hr>
            <div>
                <h2>Minting</h2>
                <input type="Address" placeholder="to (address)" onChange={(e) => { setAccount(e.target.value); }} />
                <button onClick={mint} disabled={loading}>
                    Mint
                </button>
            </div>
            <div>
                <h2>Transfer</h2>
                <input type="Address" placeholder="from (address)" onChange={e => setAccount(e.target.value.toString())} />
                <input type="Address" placeholder="to (address)" onChange={e => setAccount1(e.target.value.toString())} />
                <input type="number" placeholder="tokenId (bignumber)" onChange={e => setTokenId(parseInt(e.target.value))}/>
                <button onClick={transfer} disabled={loading}>
                    Transfer
                </button>
            </div>
            <div>
                <h2>Owner of</h2>
                <input type="number" placeholder="tokenId (bignumber)" onChange={e => setTokenId(parseInt(e.target.value))}/>
                <span>{owner?.Address?.value}</span>
                <button onClick={tokenOf} disabled={loading}>
                    Owner of
                </button>
            </div>
            <div>
                <h2>Balance of</h2>
                <input type="Address" placeholder="owner (address)" onChange={e => setAccount(e.target.value.toString())} />
                <span>{balance}</span>
                <button onClick={balanceOf} disabled={loading}>
                    Balance of
                </button>
            </div>
        </div>
    );
}

export default Playground;
