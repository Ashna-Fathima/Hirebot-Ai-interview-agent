import { useEffect, useRef, useState } from 'react';
import { Bot } from 'lucide-react';

interface TypingBubbleProps {
  text: string;
  onDone?: () => void;
  speed?: number;
}

export function TypingBubble({ text, onDone, speed = 25 }: TypingBubbleProps) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setDisplayed('');
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onDoneRef.current?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <div className="flex gap-3 items-start animate-[fadeInUp_0.3s_ease-out]">
      <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center shadow-md">
        <Bot className="h-5 w-5 text-white" />
      </div>
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-neutral-100 dark:bg-neutral-800 px-4 py-3 shadow-sm border border-neutral-200 dark:border-neutral-700">
        <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
          {displayed}
          {isTyping && (
            <span className="inline-block w-1.5 h-4 ml-0.5 bg-sky-500 animate-pulse align-middle" />
          )}
        </p>
      </div>
    </div>
  );
}
