"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QRDisplay({ url }: { url: string }) {
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: { dark: "#00ff41", light: "#0a0a0a" },
    }).then(setQrDataUrl);
  }, [url]);

  return (
    <div className="text-center">
      {qrDataUrl && (
        <img src={qrDataUrl} alt="QR Code" className="mx-auto mb-2 border-2 border-retro-green" />
      )}
      <p className="text-xs text-retro-dim/50">
        SCAN QR TO SEND TIP
      </p>
    </div>
  );
}
