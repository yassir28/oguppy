"use client"
import React, { useRef, useState } from 'react'

export default function GettingStarted() {
  const [count, setCount] = useState(0);
  
  console.log('Rendering! Count is:', count);
  // ↑ This runs every time the component renders

  const [state, setState] = useState(0);
  const ref = useRef(0);

  const updateState = () => {
    setState(state + 1); // ✅ Causes a render
  };

  const updateRef = () => {
    ref.current = ref.current + 1; // ❌ Does NOT cause a render
    console.log('Ref value:', ref.current); // Updated, but screen won't change
  };


  return (
    <>
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
    <div>
      <p>State: {state}</p>
      <p>Ref: {ref.current}</p>
      <button onClick={updateState}>Update State</button>
      <button onClick={updateRef}>Update Ref</button>
    </div>

    </>
  );
}
