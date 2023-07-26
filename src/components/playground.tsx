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
    const [approved, setApproved] = useState<boolean>(false);   
    const [tokenId, setTokenId] = useState<number>();

    const [approvalIdLog, setApprovalIdLog] = useState<IdentityOutput>();
    const [ownerIdLog, setOwnerIdLog] = useState<IdentityOutput>();
    const [balanceLog, setBalanceLog] = useState<number>();
    const [addressLog, setAddressLog] = useState<string>();
    const [approvalAllLog, setApprovalAllLog] = useState<string>();

    // Read method
    async function tokenOf() {
        if (window.fuel) {
            if (tokenId) {
                try {
                    const { value } = await props.contract.functions
                        .owner_of(new BN(tokenId))
                        .get();
                    setOwnerIdLog(value);
                } catch (err) {
                    console.log("error sending transaction...", err);
                };
            }
        }
    }

    async function balanceOf() {
        if (window.fuel) {
            if (account) {
                const address = convertToAddress(account); 
                const id: IdentityInput = identifyString(address);
                try {
                    const { value } = await props.contract.functions
                        .balance_of(id)
                        .get()
                    setBalanceLog(value.toNumber());
                } catch (err) {
                    console.log("error sending transaction...", err);
                };
            }
        }
    }

    async function approvals() {
        if (window.fuel) {
            if (tokenId) {
                try {
                    const { value } = await props.contract.functions
                        .approvals(new BN(tokenId))
                        .get()
                setApprovalIdLog(value);
                } catch (err) {
                    console.log("error sending transaction...", err);
                };
            }
        }
    }

    async function isApprovalForAll() {
        if (window.fuel) {
            if (account && account1) {
                const acc1 = convertToAddress(account);
                const acc2 = convertToAddress(account1);
                const id1: IdentityInput = identifyString(acc1);
                const id2: IdentityInput = identifyString(acc2);
                try {
                    const { value } = await props.contract.functions
                        .is_approved_for_all(id1, id2)
                        .get()
                    setApprovalAllLog(value? "true" : "false");
                } catch (err) {
                    console.log("error sending transaction...", err);
                };
            }
        }
    }


    // Write method
    async function mint() {
        if (window.fuel) {
            if (account) {
                const address = convertToAddress(account); 
                const id: IdentityInput = identifyString(address);
                try {
                    await props.contract.functions
                        .mint(id)
                        .txParams({ gasPrice: 1 })
                        .call();
                    alert(`Mint NFT to ${address} success!`)
                } catch (err) {
                    console.log("error sending transaction...", err);
                };
            }
        }
    }

    async function transfer() {
        if (window.fuel) {
            if (account && account1) {
                const acc1 = convertToAddress(account);
                const acc2 = convertToAddress(account1);
                const id1: IdentityInput = identifyString(acc1);
                const id2: IdentityInput = identifyString(acc2);
                try {
                    await props.contract.functions
                        .transfer_from(id1, id2, new BN(tokenId))
                        .txParams({ gasPrice: 1 })
                        .call();
                    alert(`Transfer tokenId ${tokenId} to ${acc2} success!`)
                } catch (err) {
                    console.log("error sending transaction...", err);
                };
            }
        }
    }

    async function setApprovalForAll() {
        if (window.fuel) {
            if (account && approved) {
                const address = convertToAddress(account);
                const id: IdentityInput = identifyString(address);
                try {
                    await props.contract.functions
                        .set_approval_for_all(id, approved)
                        .txParams({ gasPrice: 1 })
                        .call();
                    alert(`${approved ? "Set approval" : "Cancel approval"} to ${address} for all success!`)
                } catch (err) {
                    console.log("error sending transaction...", err);
                };
            }
        }
    }

    async function approve() {
        if (window.fuel) {
            if (account && tokenId) {
                const address = convertToAddress(account);
                const id: IdentityInput = identifyString(address);
                try {
                    await props.contract.functions
                        .approve(id, new BN(tokenId))
                        .txParams({ gasPrice: 1 })
                        .call();
                    alert(`Approve tokenId ${tokenId} to ${address} success!`)
                } catch (err) {
                    console.log("error sending transaction...", err);
                };
            }
        }
    }


    // utils methods
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
                <h3>Convert to address</h3>
                <input type="text" placeholder="account (string)" onChange={(e) => { setAddressLog(convertToAddress(e.target.value)) } } required/>
                <input type="text" placeholder="converted (address)" value={addressLog ? addressLog : ""} disabled/>
            </div>
            <hr/>

            <h2>Read methods</h2>
            <div>
                <h3>Approvals</h3>
                <input type="number" placeholder="tokenId (bignumber)" onChange={e => setTokenId(parseInt(e.target.value))}/>
                <span>{approvalIdLog?.Address?.value}</span>
                <button onClick={approvals}>
                    Get approvals
                </button>
            </div>

            <div>
                <h3>Is approval for all</h3>
                <input type="Address" placeholder="owner (address)" onChange={e => setAccount(e.target.value.toString())} />
                <input type="Address" placeholder="operator (address)" onChange={e => setAccount1(e.target.value.toString())} />
                <span>{approvalAllLog}</span>
                <button onClick={isApprovalForAll}>
                    Is approvals for all
                </button>
            </div>

            <div>
                <h3>Owner of</h3>
                <input type="number" placeholder="tokenId (bignumber)" onChange={e => setTokenId(parseInt(e.target.value))}/>
                <span>{ownerIdLog?.Address?.value}</span>
                <button onClick={tokenOf}>
                    Owner of
                </button>
            </div>
            <div>
                <h3>Balance of</h3>
                <input type="Address" placeholder="owner (address)" onChange={e => setAccount(e.target.value.toString())} />
                <span>{balanceLog}</span>
                <button onClick={balanceOf}>
                    Balance of
                </button>
            </div>
            <hr />


            <h2>Write methods</h2>
            <div>
                <h3>Approve</h3>
                <input type="Address" placeholder="spender (address)" onChange={e => setAccount(e.target.value.toString())} />
                <input type="number" placeholder="tokenId (bignumber)" onChange={e => setTokenId(parseInt(e.target.value))}/>
                <button onClick={approve}>
                    Approve
                </button>
            </div>

            <div>
                <h3>Set approval for all</h3>
                <input type="Address" placeholder="owner (address)" onChange={e => setAccount(e.target.value.toString())} />
                <input type="Address" placeholder="operator (address)" onChange={e => setAccount1(e.target.value.toString())} />
                <input type="text" placeholder="approved (bool)" onChange={e => setApproved(e.target.value.toString().toLocaleLowerCase() === "true" ? true : false)}/>
                <button onClick={setApprovalForAll}>
                    Approve for all
                </button>
            </div>

            <div>
                <h3>Minting</h3>
                <input type="Address" placeholder="to (address)" onChange={(e) => { setAccount(e.target.value); }} />
                <button onClick={mint}>
                    Mint
                </button>
            </div>
            <div>
                <h3>Transfer</h3>
                <input type="Address" placeholder="from (address)" onChange={e => setAccount(e.target.value.toString())} />
                <input type="Address" placeholder="to (address)" onChange={e => setAccount1(e.target.value.toString())} />
                <input type="number" placeholder="tokenId (bignumber)" onChange={e => setTokenId(parseInt(e.target.value))}/>
                <button onClick={transfer}>
                    Transfer
                </button>
            </div>
        </div>
    );
}

export default Playground;
