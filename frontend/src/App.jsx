import React, { useEffect, useState } from 'react';
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import Home from './Home';

export default function App() {
  const [ready, setReady] = useState(false);
  const [useTestAadhaar, setUseTestAadhaar] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      {ready && (
        <AnonAadhaarProvider _useTestAadhaar={useTestAadhaar}>
          <Home setUseTestAadhaar={setUseTestAadhaar} useTestAadhaar={useTestAadhaar} />
        </AnonAadhaarProvider>
      )}
    </>
  );
}
