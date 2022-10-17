import React, { useState, useEffect, useReducer } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ReactComponent as Minus } from "assets/minus.svg";
import { ReactComponent as Discord } from "assets/discord.svg";
import { ReactComponent as Plus } from "assets/plus.svg";

import { providerOptions } from "config/ProvideOptions";
import { contractAddress } from "config/config";
import getWhiteListInfo from "../utils/whitelist";

import contractAbi from "abi/CypherFighter.json";

const web3Modal = new Web3Modal({
  network: "mainnet",
  cacheProvider: true, // optional
  providerOptions, // required
});

const Minting = () => {
  const [account, setAccount] = useState();
  const [error, setError] = useState("");
  const [saleStatus, setSaleStatus] = useState("");
  const [price, setPrice] = useState(0);
  const [balance, setBalance] = useState("0");
  const [num, setNum] = useState(0);

  const connectWallet = async () => {
    try {
      const modal = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(modal);
      // @ts-ignore
      const account: any = window.ethereum.selectedAddress;
      setAccount(account);
      console.log(account);
      // @ts-ignore
      const balance = await provider.getBalance(account);
      console.log(ethers.utils.formatEther(balance));
      setBalance(ethers.utils.formatEther(balance));
      // connect the contract
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi.abi,
        provider.getSigner()
      );

      checkStatus();

      // Event Catch
      contract.on("PublicSaleStarted", async (status) => {
        console.log(status);
        if (status === true) {
          setSaleStatus("publicSale");
          setPrice(
            parseFloat(
              ethers.utils.formatEther(await contract.MINT_PUBLIC_PRICE())
            )
          );
        }
      });
      contract.on("PrivatSaleStarted", async (status) => {
        console.log(status);
        setSaleStatus("privateSale");
        setPrice(
          parseFloat(
            ethers.utils.formatEther(await contract.MINT_PRIVATE_PRICE())
          )
        );
      });
      contract.on("ExtraSaleStarted", (status) => {
        console.log(status);
        setSaleStatus("extraSale");
      });
      contract.on("PrivateMint", (supply) => {
        console.log(supply);
        setNum(supply);
      });
      contract.on("PublicMint", (supply) => {
        console.log(supply);
        setNum(supply);
      });
      contract.on("ExtraMint", (supply) => {
        console.log(supply);
        setNum(supply);
      });
    } catch (error: any) {
      setError(error);
    }
  };

  const refreshState = () => {
    // @ts-ignore
    setAccount();
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  const checkStatus = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi.abi,
      provider
    );

    if (await contract.privateSaleStarted()) {
      setSaleStatus("privateSale");
    }
    if (await contract.publicSaleStarted()) {
      setSaleStatus("publicSale");
    }
    if (await contract.extraSaleStarted()) {
      setSaleStatus("extraSale");
    }
  };

  const plus = () => {
    console.log(num);
    if (num === 2) {
      toast.warning("One user can't mint over 2!");
      return;
    }
    setNum(num + 1);
  };

  const minus = () => {
    if (num === 0) {
      toast.warning("Count of mint should be over 0!");
      return;
    }
    setNum(num - 1);
  };

  const mint = async () => {
    if (!account) {
      toast.warning("please connect the wallet!");
      return;
    } else if (saleStatus === "") {
      await checkStatus();
      if (saleStatus === "") {
        toast.warning("Mint is not started!");
        return;
      }
    } else if (parseFloat(balance) < price * num) {
      toast.warning("Balance is not enough for minting!");
      return;
    } else if (num === 0) {
      toast.warning("You don't select the number!");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi.abi,
      provider
    );

    const verify = await getWhiteListInfo(window.ethereum.selectedAddress);

    switch (saleStatus) {
      case "privateSale": {
        if (!verify.verified) {
          toast.warning("You are not a member in whitelist!");
          return;
        }
        await contract.mintWhitelist(num, verify.proof);
        break;
      }
      case "publicSale": {
        await contract.mint(num);
        break;
      }
      case "extraSale": {
        await contract.mintExtra(num);
        break;
      }
    }

    setBalance(
      ethers.utils.formatEther(
        await provider.getBalance(window.ethereum.selectedAddress)
      )
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#011A46] to-[#0D0347] h-auto xl:h-screen pb-max flex justify-center">
      <ToastContainer theme="dark"/>
      <div className="pt-[156px] pb-[55px] mx-auto text-[#fff]">
        <div className="flex justify-center w-full">
          <img
            src="images/logo.png"
            alt="logo"
            className="w-[300px] h-full animate-bounce"
          />
        </div>
        <div className="mt-11 w-full flex flex-col md:flex-row">
          <div className="flex flex-col items-center justify-center  bg-[#000000] rounded-t-[30px] md:rounded-tr-[0px] md:rounded-l-[30px] px-14 pb-7">
            <img src="images/man.png" alt="man" className="w-[219px] h-full" />
            <p className="mt-[6px] font-semibold text-2xl">Mint-A-Fighter</p>
            <button className="bg-[#0B0B0B00] px-3 rounded-[10px]">
              View On Opensea
            </button>
          </div>
          <div className="flex flex-col items-center justify-center pt-[18px] pb-[29px] px-9 md:pr-[63px] md:pl-[23px] bg-[#0B0B0B] rounded-b-[30px] md:rounded-bl-[0px] md:rounded-r-[30px]">
            {!account ? (
              <button className="rounded-[26px] px-3" onClick={connectWallet}>
                Connect Wallet
              </button>
            ) : (
              <div className="flex gap-2 items-center">
                <button className="rounded-[26px] px-3" onClick={disconnect}>
                  Disconnect
                </button>
                <span className="font-semibold text-2xl">
                  {parseFloat(balance).toFixed(2) + ""}ETH
                </span>
              </div>
            )}
            <div className="mt-[39px]">
              <div className="flex justify-between gap-10">
                <span className="font-semibold text-2xl">Quantity</span>
                <div className="flex font-semibold text-2xl w-32 justify-between">
                  <Minus
                    className="cursor-pointer hover:animate-pulse"
                    onClick={minus}
                  />
                  <label>{num}</label>
                  <Plus
                    className="cursor-pointer hover:animate-pulse"
                    onClick={plus}
                  />
                </div>
              </div>
              <div className="flex mt-10 justify-between">
                <span className="font-semibold text-2xl">Total</span>
                <div className="flex font-semibold text-2xl w-32 justify-center">
                  <label>0</label>
                </div>
              </div>
              <div></div>
            </div>
            <button className="px-8 rounded-[10px] mt-[50px]" onClick={mint}>
              Mint
            </button>
          </div>
        </div>
        <div className="mt-11 flex flex-col justify-center items-center">
          <p className="font-semibold text-2xl w-80 text-center">
            On The Fightlist? Connect With Discord
          </p>
          <a href="https://discord.gg/M5bQnM9Rvc">
            <button className="mt-2 rounded-[7px] text-xl py-1 md:py-2 items-center md:text-2xl bg-[#7289DA] flex gap-1 w-[236px]  md:w-[286px] justify-center">
              <Discord />
              Connect Discord
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Minting;
