import { gsap } from 'gsap';

export const setupGSAP = () => {
    // Configure GSAP for optimal performance
    gsap.defaults({
        overwrite: "auto",
        ease: "back.out(2)",
        transformOrigin: "center center"
    });

    gsap.config({
        force3D: true,
        autoSleep: 60,
        nullTargetWarn: false,
        units: { left: "%", top: "%", rotation: "rad" }
    });

    // Clear existing animations
    gsap.globalTimeline.clear();

    // Set up high-performance rendering
    gsap.ticker.lagSmoothing(500, 16);
    gsap.ticker.fps(60);
    // RAF (Request Animation Frame) is enabled by default in GSAP 3
    // No need to explicitly set useRAF as it's not available in current GSAP types
};

export const animateObstacleAppear = (element: HTMLElement) => {
    gsap.killTweensOf(element);

    // Create timeline for obstacle animation
    const tl = gsap.timeline({
        defaults: {
            duration: 0.35,
            ease: "back.out(1.7)"
        }
    });

    // Set initial state
    tl.set(element, {
        opacity: 0,
        scale: 0.7,
        filter: 'blur(6px)',
        visibility: 'visible'
    });

    // Animate to final state
    tl.to(element, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        overwrite: true
    });

    return tl;
};