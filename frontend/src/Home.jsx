import React, { useEffect, useState } from 'react';
import {
  AnonAadhaarProof,
  LogInWithAnonAadhaar,
  useAnonAadhaar
} from "@anon-aadhaar/react";
import { packGroth16Proof, verify } from '@anon-aadhaar/core';
import { ConnectKitButton } from 'connectkit';
import { useAccount, useContractWrite } from 'wagmi';

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
      "inputs": [
        {
          "internalType": "address",
          "name": "_anon",
          "type": "address"
        }
      ],
      "name": "addAnon",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "claimant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Claimed",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "userNullifier",
          "type": "uint256"
        }
      ],
      "name": "claimUBI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "depositFunds",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_anon",
          "type": "address"
        }
      ],
      "name": "removeAnon",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    },
    {
      "inputs": [],
      "name": "claimAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasAddressClaimed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "hasClaimed",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "isAnon",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: '0x2fe4f8376504028796ab2A27ABD9Fe304A281a3A',
    abi: wagmigotchiABI,
    functionName: 'claimUBI',
  })


  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <main className="flex flex-col items-center gap-8 bg-white rounded-2xl max-w-screen-sm mx-auto h-[24rem] md:h-[20rem] p-8">
        <h1 className="font-bold text-2xl">Welcome to Anon UBI </h1>
        <p>Prove your Identity anonymously using your Aadhaar card and claim your ETH</p>
        <ConnectKitButton />

        {isConnected && <LogInWithAnonAadhaar />}
      </main>
      <div className="flex flex-col items-center gap-4 rounded-2xl max-w-screen-sm mx-auto p-8">
        {anonAadhaar?.status === "logged-in" && (
          <>
            <>Welcome anon!</>
            <p>✅ Proof is valid</p>
            <button
              disabled={!write}
              onClick={() =>
                write({
                  args: [userNullifier],
                })
              }
            >
              Claim
            </button>

            <AnonAadhaarProof
              code={JSON.stringify(anonAadhaar.anonAadhaarProof, null, 2)}
            />
          </>
        )}
      </div>
    </div>
  );
}
