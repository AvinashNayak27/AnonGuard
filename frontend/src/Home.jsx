import React, { useEffect, useState } from 'react';
import {
  AnonAadhaarProof,
  LogInWithAnonAadhaar,
  useAnonAadhaar
} from "@anon-aadhaar/react";
import { packGroth16Proof, verify } from '@anon-aadhaar/core';
import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';

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


  const ClaimUBI = async (userNullifier) => {
    console.log("Claiming UBI for userNullifier: ", userNullifier);
  }

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
            <button onClick={() => ClaimUBI(userNullifier)}>Claim UBI</button>

            <AnonAadhaarProof
              code={JSON.stringify(anonAadhaar.anonAadhaarProof, null, 2)}
            />
          </>
        )}
      </div>
    </div>
  );
}
