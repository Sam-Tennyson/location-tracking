// Timer.tsx
import React, { useState, useEffect } from "react";

interface TimerProps {
  timeout: number; // Timeout value in seconds
  initialSeconds: number; // Initial seconds for the timer
}

const Timer: React.FC<TimerProps> = ({ timeout, initialSeconds }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (seconds === timeout) {
      setIsActive(false);
    }
  }, [seconds, timeout]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setSeconds(initialSeconds);
    setIsActive(false);
  };

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  return (
    <>
      <div className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-md">
        <h1 className="text-2xl mb-4">Timer</h1>
        <div className="mb-4">
          <span className="text-xl font-bold">{seconds}s</span>
        </div>
        <div className="flex space-x-4">
          <button
            className={`bg-green-500 text-white px-4 py-2 rounded-md ${
              isActive ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={toggleTimer}
            disabled={isActive}
          >
            Start
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default Timer;
