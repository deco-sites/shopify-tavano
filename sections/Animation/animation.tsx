
import { Section } from "deco/blocks/section.ts";
import { useId } from "deco-sites/storefront/sdk/useId.ts";


interface Children {
    label: string;
    section: Section;
}

/**
 * @title Animation of 
 */
interface Props {
    animationType?: 'fade-in' | 'fade-in-bottom' | 'slide-left' | 'slide-right' | 'zoom-in';
    /**
     * @default 0.3
     */
    duration?: string;
    children: Children;
}

function Animation({ children, animationType = 'fade-in', duration = "0.3" }: Props) {

    const {section} = children;

    const {Component, props} = section;
    const id = useId()

    // Classes de animação do Tailwind
    const animationClasses = {
        'fade-in': 'animate-fade-in',
        'fade-in-bottom': 'animate-fade-in-bottom',
        'slide-left': 'animate-slide-left',
        'slide-right': 'animate-slide-right',
        'zoom-in': 'animate-zoom-in',
    };

    const animationClass = animationClasses[animationType];

    return (
        <>
            <div id={id} class="opacity-0" style={{animationDuration: duration + "s"}}>
                <Component {...props} />
            </div>
            <script dangerouslySetInnerHTML={{__html:`
                var observer = new IntersectionObserver(function(entries) {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("${animationClass}");
                            entry.target.classList.remove("opacity-0");
                            observer.disconnect();
                        }
                    });
                }, { threshold: 0.50 });
            
                var element = document.getElementById('${id}');
                observer.observe(element);
            `}} />
        </>
    );
}

export default Animation;