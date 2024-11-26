import React, { useState, useEffect } from "react";
import { BsWifi, BsWifiOff } from "react-icons/bs";

const ConnectionDetection = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOnlineMessage, setShowOnlineMessage] = useState(false);

  console.log("Is online: ", isOnline);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineMessage(true);
      setTimeout(() => setShowOnlineMessage(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {!isOnline && (
        <div className="offline-message">
          <BsWifiOff className="pb-1" size={20} /> Not connected to the internet
        </div>
      )}
      {showOnlineMessage && (
        <div className="online-message">
          <BsWifi className="pb-1" size={20} /> Back online
        </div>
      )}
    </>
  );
};

export default ConnectionDetection;
