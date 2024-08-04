// app/components/TypewriterLooping.tsx

'use client';
import React, { useEffect, useState } from 'react';

type TypewriterLoopingProps = {
  words: string[];
  speed?: number;
  clearSpeed?: number;
  nextWordDelay?: number;
  pause?: number;
  loopCount?: number;
  width?: string;
  display?: string;
};

const WordsLoop: React.FC<TypewriterLoopingProps> = ({
  words,
  speed = 100,
  clearSpeed = 50,
  nextWordDelay = 500,
  pause = 2000,
  loopCount = 1,
  width = '100%',
  display = 'inline-block',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typing, setTyping] = useState(false);
  const [loop, setLoop] = useState(0);

  useEffect(() => {
    const delayTimeout = setTimeout(
      () => {
        setTyping(true);
      },
      Math.random() * 1000 + 1000,
    );

    return () => clearTimeout(delayTimeout);
  }, []);

  useEffect(() => {
    if (loopCount !== Infinity && loop >= loopCount) {
      return;
    }

    if (typing) {
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        setDisplayedText(
          (prev) => prev + words[currentWordIndex][currentIndex],
        );
        currentIndex += 1;
        if (currentIndex === words[currentWordIndex].length) {
          clearInterval(typeInterval);
          if (currentWordIndex === words.length - 1) {
            setLoop((prevLoop) => prevLoop + 1);
          }
          setTimeout(() => setTyping(false), pause);
        }
      }, speed);
      return () => clearInterval(typeInterval);
    } else {
      let currentIndex = words[currentWordIndex].length;
      const clearTextInterval = setInterval(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
        currentIndex -= 1;
        if (currentIndex === 0) {
          clearInterval(clearTextInterval);
          setTimeout(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
            setTyping(true);
          }, nextWordDelay);
        }
      }, clearSpeed);
      return () => clearInterval(clearTextInterval);
    }
  }, [
    typing,
    words,
    speed,
    clearSpeed,
    nextWordDelay,
    pause,
    currentWordIndex,
    loop,
    loopCount,
  ]);

  // Ensure displayedText stays updated with the current word's text
  useEffect(() => {
    setDisplayedText(
      words[currentWordIndex].substring(0, displayedText.length),
    );
  }, [currentWordIndex, displayedText.length, words]);

  return (
    <span className="typewriter text-blue-500/80" style={{ display, width }}>
      {displayedText}
    </span>
  );
};

export default WordsLoop;
