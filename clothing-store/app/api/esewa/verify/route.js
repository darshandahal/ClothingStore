"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EsewaSuccessPage() {
  const params = useSearchParams();
  const dataB64 = params.get("data");

  useEffect(() => {
    if (dataB64) {
      const decoded = atob(dataB64);
      console.log("eSewa response:", JSON.parse(decoded));
      // send to backend to verify before marking invoice paid
    }
  }, [dataB64]);

  return <div>Payment Successful! Processing...</div>;
}
