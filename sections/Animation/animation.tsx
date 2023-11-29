
import { Section } from "deco/blocks/section.ts";

interface Props {
    children: Section;
    animationType?: 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in';
}

function Animation({ children: { Component, props }, animationType = 'fade-in' }: Props) {
    // Classes de animação do Tailwind
    const animationClasses = {
        'fade-in': 'animate-fade-in',
        'slide-left': 'animate-slide-left',
        'slide-right': 'animate-slide-right',
        'zoom-in': 'animate-zoom-in',
    };

    const animationClass = animationClasses[animationType];

    return (
        <div className={animationClass}>
            <Component {...props} />
        </div>
    );
}

export default Animation;