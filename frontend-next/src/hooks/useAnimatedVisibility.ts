import { useState, useEffect, useRef } from "react";

interface AnimatedVisibility {
  shouldRender: boolean;
  animationState: "entering" | "visible" | "exiting" | "hidden";
  isEntering: boolean;
  isExiting: boolean;
  isVisible: boolean;
}

const useAnimatedVisibility = (isVisible: boolean, duration = 200): AnimatedVisibility => {
  const [animationState, setAnimationState] = useState<"entering" | "visible" | "exiting" | "hidden">(
    isVisible ? "visible" : "hidden"
  );
  const shouldRenderRef = useRef(isVisible);

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let rafId: number;

    if (isVisible) {
      rafId = requestAnimationFrame(() => {
        shouldRenderRef.current = true;
        setAnimationState("entering");
        timerRef.current = setTimeout(() => setAnimationState("visible"), duration);
      });
    } else if (shouldRenderRef.current) {
      rafId = requestAnimationFrame(() => {
        setAnimationState("exiting");
        timerRef.current = setTimeout(() => {
          shouldRenderRef.current = false;
          setAnimationState("hidden");
        }, duration);
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerRef.current);
    };
  }, [isVisible, duration]);

  const shouldRender = animationState !== "hidden";

  return {
    shouldRender,
    animationState,
    isEntering: animationState === "entering",
    isExiting: animationState === "exiting",
    isVisible: animationState === "visible" || animationState === "entering",
  };
};

export default useAnimatedVisibility;
