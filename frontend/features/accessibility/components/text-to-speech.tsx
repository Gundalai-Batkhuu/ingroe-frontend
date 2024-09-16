'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Speech } from 'lucide-react';
import { Button } from '@/components/ui/button'

interface TextToSpeechProps {
  text: string;
  className?: string;
}

export default function TextToSpeech({ text, className }: TextToSpeechProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSpeak = async () => {
    if (!text) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'shimmer' }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const data = await response.json();
      setAudioSrc(`data:audio/mp3;base64,${data.audio}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate speech. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Autoplay failed:', error);
      });
    }
  }, [audioSrc]);

  return (
    <div>
      <Button
        variant={'ghost'}
        size={'icon'}
        onClick={handleSpeak}
        disabled={isLoading || !text}
      >
        <Speech size={18} />
        <span className="sr-only">Voice</span>
      </Button>
      {audioSrc && (
        <audio ref={audioRef} src={audioSrc} className="ml-2 w-full max-w-xs">
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  )
}