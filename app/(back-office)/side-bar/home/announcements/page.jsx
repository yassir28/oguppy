"use client"
import React from 'react'
import { useEffect, useRef } from 'react';


export default function Announcements() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type something..."
      />
    </div>
  )
}
