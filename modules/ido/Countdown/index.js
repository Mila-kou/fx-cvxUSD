import React, { useState, useEffect } from "react";
import { checkNotZoroNum } from "@/utils/index";

export default function StakeEndsCountdown({ endTime, onCompleted }) {
  const [countdownTimer, setCountdownTimer] = useState(null);
  const [countdown, setCountdown] = useState({
    days: "-",
    hours: "-",
    minutes: "-",
    seconds: "-",
  });

  const calculateCountdown = (time) => {
    const timeGap = Math.floor((time - new Date().valueOf()) / 1000);
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
