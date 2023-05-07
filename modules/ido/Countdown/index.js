import React, { useState, useEffect } from "react";
import { checkNotZoroNum } from "@/utils/index";
import useWeb3 from "@/hooks/useWeb3";

export default function StakeEndsCountdown({ endTime, onCompleted }) {
  const { _currentAccount, web3, blockNumber } = useWeb3()
  const [countdownTimer, setCountdownTimer] = useState(null);
  const [countdown, setCountdown] = useState({
    days: "-",
    hours: "-",
    minutes: "-",
    seconds: "-",
  });

  const calculateCountdown = async (time) => {
    const { timestamp } = { timestamp: new Date().valueOf() } //await web3.eth.getBlock('latest') || 
    const timeGap = Math.floor((time - timestamp * 1000) / 1000);
    if (timeGap === 0) {
      onCompleted && onCompleted()
    }
    if (timeGap < 0) {
      return;
    }
    const days = String(
      Math.floor(((timeGap / 86400)))
    ).padStart(2, "0");
    const hours = String(Math.floor((timeGap % 86400) / 3600)).padStart(2, "0");
    const minutes = String(
      Math.floor(((timeGap % 86400) % 3600) / 60)
    ).padStart(2, "0");
    const seconds = String(
      Math.floor(((timeGap % 86400) % 3600) % 60)
    ).padStart(2, "0");

    setCountdown({
      days,
      hours,
      minutes,
      seconds,
    });
  };

  useEffect(() => {
    if (!checkNotZoroNum(endTime)) {
      setCountdown({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      });
      return;
    }

    const interval = setInterval(() => {
      calculateCountdown(endTime);
    }, 1000);

    setCountdownTimer(interval);

    return () => clearInterval(countdownTimer);
  }, [endTime]);

  return (
    <div>
      {countdown.days * 1 > 0 ? `${countdown.days} Days ` : ''}{countdown.hours}:{countdown.minutes}:{countdown.seconds}
    </div>
  );
}
