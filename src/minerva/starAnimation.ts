/**
 * Star Animation.
 *
 * @author <cabal@digerati.design>
 */

// GSAP globals (loaded via <script>, not imported)
declare const TweenLite: any,
    TimelineMax: any,
    RoughEase: any,
    Linear: any;

export const starAnimation = () => {
    const baseStar = document.querySelector<HTMLElement>('[dd-animation="star"]'),
        containers = document.querySelectorAll<HTMLElement>('[dd-animation="background"]');

    if (!baseStar || !containers.length) {
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

    const stars: { element: HTMLElement; timeline: any }[] = [],
        eases: any[] = [];

    const random = (min: number, max?: number) => {
        if (max == null) { max = min; min = 0; }
        if (min > max) { const tmp = min; min = max; max = tmp; }
        return min + (max - min) * Math.random();
    };

    // Prebuild RoughEase instances
    for (let i = 0; i < numAnimations; i++) {
        eases.push(
            new RoughEase({
                template: Linear.easeNone,
                strength: random(1, 3),
                points: Math.floor(random(50, 200)),
                taper: 'both',
                randomize: true,
                clamp: true,
            })
        );
    }

    const createStar = (parent: HTMLElement, width: number, height: number) => {
        const star = baseStar.cloneNode(true) as HTMLElement;

        TweenLite.set(star, {
            position: 'absolute',
            top: 0,
            left: 0,
            rotation: random(360),
            xPercent: -50,
            yPercent: -50,
            scale: 0,
            x: random(width),
            y: random(height),
            pointerEvents: 'none',
        });

        const tl = new TimelineMax({ repeat: -1, yoyo: true });

        for (let i = 0; i < numAnimations; i++) {
            const ease1 = eases[Math.floor(random(numAnimations))],
                ease2 = eases[Math.floor(random(numAnimations))],
                alpha = random(0.7, 1),
                scale = random(0.15, 0.4),
                appear = `+=${random(appearMin, appearMax)}`,
                delay = `+=${random(delayMin, delayMax)}`,
                dur1 = random(durationMin, durationMax),
                dur2 = random(durationMin, durationMax);

            tl.to(star, dur1, { autoAlpha: alpha, scale, ease: ease1 }, delay)
                .to(star, dur2, { autoAlpha: 0, scale: 0, ease: ease2 }, appear);
        }

        tl.progress(random(1));
        parent.appendChild(star);
        return { element: star, timeline: tl };
    };

    const createStars = () => {
        containers.forEach((el) => {
            TweenLite.set(el, {
                position: el.style.position || 'relative',
                overflow: el.style.overflow || 'hidden',
            });

            const width = el.offsetWidth,
                height = el.offsetHeight;

            for (let i = 0; i < numStars; i++) {
                stars.push(createStar(el, width, height));
            }
        });
    };

    const clearStars = () => {
        stars.forEach(({ element, timeline }) => {
            timeline.kill();
            element.remove();
        });
        stars.length = 0;
    };

    const onLoad = () => {
        createStars();
        baseStar.remove();
    };

    const onResize = () => {
        clearStars();
        createStars();
    };

    window.addEventListener('load', onLoad);
    window.addEventListener('resize', onResize);
};
