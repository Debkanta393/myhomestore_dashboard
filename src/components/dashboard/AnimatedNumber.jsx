import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
      else setDisplay(value);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return (
    <span className="tabnum">
      {prefix}{display.toLocaleString("en-IN")}{suffix}
    </span>
  );
}