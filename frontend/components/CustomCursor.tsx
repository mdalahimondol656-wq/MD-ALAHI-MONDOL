"use client";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMagnetic, setIsMagnetic] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const magneticElements = document.querySelectorAll('[data-magnetic]');
      magneticElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));

        if (distance < 100) {
          setIsMagnetic(true);
          const moveX = (e.clientX - centerX) * 0.2;
          const moveY = (e.clientY - centerY) * 0.2;
          (el as HTMLElement).style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else {
          (el as HTMLElement).style.transform = 'translate(0, 0)';
        }
      });
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-cyan-500/80 pointer-events-none z-[9999] mix-blend-difference transition-transform duration-150 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 12}px, ${mousePosition.y - 12}px) scale(${isHovering ? 1.5 : 1})`,
        }}
      />
      <div
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-cyan-400/50 pointer-events-none z-[9998] transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 20}px, ${mousePosition.y - 20}px) scale(${isHovering ? 1.2 : 1})`,
        }}
      />
    </>
  );
}
