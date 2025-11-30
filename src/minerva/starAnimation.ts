/**
 * Star Animation (Safari Debug Mode).
 *
 * @author <cabal@digerati.design>
 */

// GSAP globals (loaded via <script>, not imported)
declare const TweenLite: any,
    TimelineMax: any,
    RoughEase: any,
    Linear: any;

export const starAnimation = () => {
    console.group('%c[Star Animation] Init', 'color: lime');
    console.log('[Safari Debug] Function called.');

    // Check GSAP globals
    console.log('[Safari Debug] GSAP globals:', {
        TweenLite: typeof TweenLite,
        TimelineMax: typeof TimelineMax,
        RoughEase: typeof RoughEase,
        Linear: typeof Linear,
    });

    const baseStar = document.querySelector<HTMLElement>('[dd-animation="star"]');
    console.log('[Safari Debug] baseStar found:', !!baseStar);

    if (!baseStar) {
        console.warn('[Safari Debug] No baseStar... EXITING.');
        console.groupEnd();
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

    console.log('[Safari Debug] Building eases…');
    try {
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
        console.log('[Safari Debug] eases created:', eases.length);
    } catch (err) {
        console.error('[Safari Debug] FAILED creating RoughEase:', err);
        console.groupEnd();
        return;
    }

    // Life-cycle tracking
    console.log('[Safari Debug] Adding window.load + resize listeners.');
    window.addEventListener('load', onLoad);
    window.addEventListener('resize', onResize);

    function onLoad() {
        console.group('%c[Safari Debug] onLoad()', 'color: cyan');
        console.log('[onLoad] Fired in Safari?', true);
        createStars();

        try {
            baseStar.remove();
            console.log('[onLoad] baseStar removed.');
        } catch (e) {
            console.warn('[onLoad] Could not remove baseStar:', e);
        }
        console.groupEnd();
    }

    function onResize() {
        console.group('%c[Safari Debug] onResize()', 'color: yellow');
        clearStars();
        createStars();
        console.groupEnd();
    }

    function createStars() {
        console.group('[Safari Debug] createStars()');
        const twinklingStars = document.querySelectorAll<HTMLElement>('[dd-animation="background"]');
        console.log('[Safari Debug] Containers found:', twinklingStars.length);

        twinklingStars.forEach((element, index) => {
            const w = element.offsetWidth;
            const h = element.offsetHeight;
            console.log(`[Safari Debug] Container ${index + 1}: size = ${w} x ${h}`);

            for (let i = 0; i < numStars; i++) {
                if (i === 0) console.log('[Safari Debug] Creating first star..');
                stars.push(createStar(element, w, h));
            }
        });
        console.log('[Safari Debug] Total stars created:', stars.length);
        console.groupEnd();
    }

    function clearStars() {
        console.group('[Safari Debug] clearStars()');
        stars.forEach((star, i) => {
            if (i === 0) console.log('[Safari Debug] Killing first timeline..');
            star.timeline.kill();
            star.element.remove();
        });
        console.log('[Safari Debug] Stars removed:', stars.length);
        stars = [];
        console.groupEnd();
    }

    function createStar(parent: HTMLElement, width: number, height: number) {
        const star = baseStar.cloneNode(true) as HTMLElement;
        parent.appendChild(star);

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
            tl.to(star, random(durationMin, durationMax), {
                autoAlpha: random(0.7, 1),
                scale: random(0.15, 0.4),
                ease: ease1,
            }, `+=${random(delayMin, delayMax)}`)
                .to(star, random(durationMin, durationMax), {
                    autoAlpha: 0,
                    scale: 0,
                    ease: ease2,
                }, `+=${random(appearMin, appearMax)}`);
        }

        tl.progress(random(1));
        return { element: star, timeline: tl };
    }

    function random(min: number, max?: number): number {
        if (max == null) { max = min; min = 0; }
        if (min > max) { const tmp = min; min = max; max = tmp; }
        return min + (max - min) * Math.random();
    }

    console.groupEnd();
};
