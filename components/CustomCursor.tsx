"use client";

import { useEffect, useRef } from "react";

const CustomCursor = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows instantly
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        };

        // Smooth ring follow with animation frame
        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;

            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;

            requestAnimationFrame(animateRing);
        };

        const handleMouseEnterInteractive = () => {
            dot.classList.add("cursor-dot--hover");
            ring.classList.add("cursor-ring--hover");
        };

        const handleMouseLeaveInteractive = () => {
            dot.classList.remove("cursor-dot--hover");
            ring.classList.remove("cursor-ring--hover");
        };

        const handleMouseDown = () => {
            dot.classList.add("cursor-dot--click");
            ring.classList.add("cursor-ring--click");
        };

        const handleMouseUp = () => {
            dot.classList.remove("cursor-dot--click");
            ring.classList.remove("cursor-ring--click");
        };

        // Attach listeners
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);

        // Add hover effect for all interactive elements
        const interactiveElements = document.querySelectorAll(
            "a, button, input, textarea, select, [role='button'], .startup-card"
        );
        interactiveElements.forEach((el) => {
            el.addEventListener("mouseenter", handleMouseEnterInteractive);
            el.addEventListener("mouseleave", handleMouseLeaveInteractive);
        });

        const animFrame = requestAnimationFrame(animateRing);

        // MutationObserver to catch dynamically added elements
        const observer = new MutationObserver(() => {
            const newElements = document.querySelectorAll(
                "a, button, input, textarea, select, [role='button'], .startup-card"
            );
            newElements.forEach((el) => {
                el.removeEventListener("mouseenter", handleMouseEnterInteractive);
                el.removeEventListener("mouseleave", handleMouseLeaveInteractive);
                el.addEventListener("mouseenter", handleMouseEnterInteractive);
                el.addEventListener("mouseleave", handleMouseLeaveInteractive);
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            cancelAnimationFrame(animFrame);
            observer.disconnect();
            interactiveElements.forEach((el) => {
                el.removeEventListener("mouseenter", handleMouseEnterInteractive);
                el.removeEventListener("mouseleave", handleMouseLeaveInteractive);
            });
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot" />
            <div ref={ringRef} className="cursor-ring" />
        </>
    );
};

export default CustomCursor;
