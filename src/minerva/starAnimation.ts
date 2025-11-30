/**
 * Star Animation.
 *
 * Direct TS port of the original Webflow cloneable script.
 *
 * @author <cabal@digerati.design>
 */

// GSAP globals (loaded via <script>, not imported)
declare const TweenLite: any,
    TimelineMax: any,
    RoughEase: any,
    Linear: any;

export const starAnimation = () => {
    const baseStar = document.querySelector<HTMLElement>('[dd-animation="star"]');
    if (!baseStar) {
        return;
    }

    const appearMin = 0.3,
        appearMax = 0.8,
        delayMin = 2,
        delayMax = 6,
        durationMin = 0.3,
        durationMax = 1,
        numAnimations = 50,
        numStars = 300;

    let stars: { element: HTMLElement; timeline: any }[] = [];
    const eases: any[] = [];

    for (let i = 0; i < numAnimations; i++) {
        const ease = new RoughEase({
            template: Linear.easeNone,
            strength: random(1, 3),
            points: Math.floor(random(50, 200)),
            taper: 'both',
            randomize: true,
            clamp: true,
        });

        eases.push(ease);
    }

    // Wait for images to load
    window.addEventListener('load', onLoad);
    window.addEventListener('resize', onResize);

    function onLoad() {
        createStars();
        document.body.removeChild(baseStar);
    }

    function onResize() {
        clearStars();
        createStars();
    }

    function createStars() {
        const twinklingStars = document.querySelectorAll<HTMLElement>(
            '[dd-animation="background"]',
        );

        twinklingStars.forEach((element) => {
            const elementWidth = element.offsetWidth;
            const elementHeight = element.offsetHeight;

            for (let i = 0; i < numStars; i++) {
                stars.push(createStar(element, elementWidth, elementHeight));
            }
        });
    }

    function clearStars() {
        stars.forEach((star) => {
            if (star.element.parentNode) {
                star.element.parentNode.removeChild(star.element);
            }
            star.timeline.kill();
        });

        stars = [];
    }

    function createStar(parentElement: HTMLElement, width: number, height: number) {
        const star = baseStar.cloneNode(true) as HTMLElement;
        parentElement.appendChild(star);

        TweenLite.set(star, {
            rotation: random(360),
            xPercent: -50,
            yPercent: -50,
            scale: 0,
            x: random(width),
            y: random(height),
        });

        const tl = new TimelineMax({ repeat: -1, yoyo: true });

        for (let i = 0; i < numAnimations; i++) {
            const ease1 = eases[Math.floor(random(numAnimations))];
            const ease2 = eases[Math.floor(random(numAnimations))];

            const alpha = random(0.7, 1);
            const scale = random(0.15, 0.4);

            const appear = '+=' + random(appearMin, appearMax);
            const delay = '+=' + random(delayMin, delayMax);
            const duration1 = random(durationMin, durationMax);
            const duration2 = random(durationMin, durationMax);

            tl.to(star, duration1, { autoAlpha: alpha, scale: scale, ease: ease1 }, delay)
                .to(star, duration2, { autoAlpha: 0, scale: 0, ease: ease2 }, appear);
        }

        tl.progress(random(1));

        return {
            element: star,
            timeline: tl,
        };
    }

    function random(min: number, max?: number): number {
        if (max == null) { max = min; min = 0; }
        if (min > max) { const tmp = min; min = max; max = tmp; }
        return min + (max - min) * Math.random();
    }
};
