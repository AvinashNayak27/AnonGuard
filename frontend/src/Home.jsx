import React, { useEffect, useState } from "react";
import {
  AnonAadhaarProof,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
} from "@anon-aadhaar/react";
import { packGroth16Proof, verify } from "@anon-aadhaar/core";
import { ConnectKitButton } from "connectkit";
import { useAccount, useContractWrite, useWriteContract } from "wagmi";

export default function Home() {
  const [anonAadhaar] = useAnonAadhaar();
  const [proof, setProof] = useState(null);
  const [userNullifier, setUserNullifier] = useState(null);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    console.log("Anon Aadhaar: ", anonAadhaar.status);
    console.log("Anon Aadhaar: ", anonAadhaar.anonAadhaarProof);
    setProof(anonAadhaar?.anonAadhaarProof?.proof);
    if (anonAadhaar.status === "logged-in" && proof) {
      const PackedGroth16Proof = packGroth16Proof(
        anonAadhaar?.anonAadhaarProof.proof?.groth16Proof
      );
      console.log("PackedGroth16Proof: ", PackedGroth16Proof);
      verify(anonAadhaar.anonAadhaarProof).then((res) => {
        console.log("Verify result: ", res);
        setUserNullifier(anonAadhaar.anonAadhaarProof.proof.userNullifier);
      });
    }
  }, [anonAadhaar, proof]);

  const wagmigotchiABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "claimant",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Claimed",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "userNullifier",
          type: "uint256",
        },
      ],
      name: "claimUBI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "depositFunds",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
    {
      inputs: [],
      name: "claimAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "hasAddressClaimed",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "hasClaimed",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const { data: txHash, writeContract } = useWriteContract();

  const claimUBI = async (userNullifier) => {
    console.log("Claiming UBI for userNullifier: ", userNullifier);
    const data = writeContract({
      address: "0x1407Ce76cc813363790d083b10E003c8eA69DD83",
      abi: wagmigotchiABI,
      functionName: "claimUBI",
      args: [userNullifier],
    });
    console.log("Data: ", data);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <main className="flex flex-col items-center gap-8 bg-white rounded-2xl max-w-screen-sm mx-auto h-[24rem] md:h-[20rem] p-8">
        <h1 className="font-bold text-2xl">Welcome to Anon UBI </h1>
        <p>
          Prove your Identity anonymously using your Aadhaar card and claim your
          ETH
        </p>
        <ConnectKitButton />

        {isConnected && <LogInWithAnonAadhaar />}
      </main>
      <div className="flex flex-col items-center gap-4 rounded-2xl max-w-screen-sm mx-auto p-8">
        {anonAadhaar?.status === "logged-in" && (
          <>
            <>Welcome anon!</>
            <p>✅ Proof is valid</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => claimUBI(userNullifier)}
            >
              Claim UBI
            </button>
            {txHash && <p>Transaction Hash: {txHash}</p>}
          </>
        )}
      </div>
    </div>
  );
}
