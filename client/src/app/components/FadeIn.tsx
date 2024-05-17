import { useState, useRef, useEffect } from "react";

export function FadeIn(props: any) {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(entry.isIntersecting);
                }
            });
        });
        observer.observe(domRef.current!);
        // return () => observer.unobserve(domRef.current!);
    }, []);
    return (
        <div
            className={`fade-in ${isVisible ? 'is-visible' : ''}`}
            ref={domRef}
        >
            {props.children}
        </div>
    );
}