import "./styles.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faRefresh,
  faSquare,
  faArrowUp,
  faArrowDown,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";

import React, { useState, useEffect } from "react";

export default function PomodoroClock() {
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }

  const defaultSessionLength = 25;
  const defaultBreakLength = 5;

  const [isSessionTime, setIsSessionTime] = useState(true);
  const [sessionLength, setSessionLength] = useState(defaultSessionLength);
  const [breakLength, setBreakLength] = useState(defaultBreakLength);
  const [sec, setSec] = useState(sessionLength * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerLeft, setTimerLeft] = useState(formatTime(sessionLength * 60));
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const colorOptions = [
    {
      name: "Branco",
      background: "#FFFFFF",
      text: "#000000",
      hover: "#383838"
    },
    { name: "Verde", background: "#d7ffe4", text: "#58685e", hover: "#2F4F4F" },
    { name: "Azul", background: "#89CFF0", text: "#0066b2", hover: "#02093B" },
    { name: "Rosa", background: "#FFB6C1", text: "#FF69B4", hover: "#FF1493" }
  ];

  const toggleColors = () => {
    const nextColorIndex = (currentColorIndex + 1) % colorOptions.length;
    setCurrentColorIndex(nextColorIndex);
    updateSCSSVariables(colorOptions[nextColorIndex]);
  };

  const updateSCSSVariables = (colors) => {
    document.documentElement.style.setProperty(
      "--backgroundColor",
      colors.background
    );
    document.documentElement.style.setProperty("--fontColor", colors.text);
    document.documentElement.style.setProperty("--hoverColor", colors.hover);
  };

  useEffect(() => {
    let interval;

    if (timerRunning && sec > 0) {
      interval = setInterval(() => {
        setTimerLeft(formatTime(sec - 1));
        setSec((prevSec) => prevSec - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (sec === 0 && timerRunning) {
      if (isSessionTime) {
        setIsSessionTime(false);
        setSec(breakLength * 60 + 1);
      } else {
        setIsSessionTime(true);
        setSec(sessionLength * 60 + 1);
      }
      document.getElementById("beep").play();
    }

    return () => clearInterval(interval);
  }, [sec, timerRunning, isSessionTime, sessionLength, breakLength]);

  const startStopTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const pauseAudio = () => {
    const audio = document.getElementById("beep");
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setIsSessionTime(true);
    setSessionLength(defaultSessionLength);
    setBreakLength(defaultBreakLength);
    const initialTimeInSeconds = defaultSessionLength * 60;
    setSec(initialTimeInSeconds);
    setTimerLeft(formatTime(initialTimeInSeconds));
    pauseAudio();
  };

  const ResetConfirmation = () => {
    const confirmReset = window.confirm("Tem certeza?");

    if (confirmReset) {
      resetTimer();
    }
  };

  const incrementSession = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setSec((sessionLength + 1) * 60);
      setTimerLeft(formatTime((sessionLength + 1) * 60));
    }
  };

  const decrementSession = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setSec((sessionLength - 1) * 60);
      setTimerLeft(formatTime((sessionLength - 1) * 60));
    }
  };

  const incrementBreak = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const decrementBreak = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  };

  return (
    <div>
      <div id="extras-div">
        <FontAwesomeIcon
          icon={faSquare}
          id="colors-button"
          onClick={toggleColors}
        />
        <a
          href="https://brasilescola.uol.com.br/dicas-de-estudo/tecnica-pomodoro-que-e-e-como-funciona.htm"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faQuestionCircle} id="toggle-button" />
        </a>
      </div>
      <h1>Técnica Pomodoro</h1>
      <div id="both-divs">
        <div id="session-div">
          <h2 id="session-label">Tempo de Trabalho</h2>
          <div id="session-value">
            <FontAwesomeIcon
              icon={faArrowUp}
              id="session-increment"
              onClick={incrementSession}
              className="arrow-icon"
            />
            <div id="session-length">{sessionLength}</div>
            <FontAwesomeIcon
              icon={faArrowDown}
              id="session-decrement"
              onClick={decrementSession}
              className="arrow-icon"
            />
          </div>
        </div>
        <div id="break-div">
          <h2 id="break-label">Tempo de Descanso</h2>
          <div id="break-value">
            <FontAwesomeIcon
              icon={faArrowUp}
              id="break-increment"
              onClick={incrementBreak}
              className="arrow-icon"
            />
            <div id="break-length">{breakLength}</div>

            <FontAwesomeIcon
              icon={faArrowDown}
              id="break-decrement"
              onClick={decrementBreak}
              className="arrow-icon"
            />
          </div>
        </div>
      </div>
      <div id="timer-div">
        <div id="timer-label">
          <h3>{isSessionTime ? "Trabalho" : "Descanso"}</h3>
        </div>
        <div id="time-left">{timerLeft}</div>
        <div id="timer-icons">
          <FontAwesomeIcon
            icon={timerRunning ? faPause : faPlay}
            id="start_stop"
            onClick={startStopTimer}
          />
          <FontAwesomeIcon
            id="reset"
            icon={faRefresh}
            aria-hidden="true"
            onClick={ResetConfirmation}
          />
        </div>
      </div>
      <audio
        id="beep"
        src="https://cdn.freesound.org/previews/250/250629_4486188-lq.mp3"
      ></audio>
    </div>
  );
}
