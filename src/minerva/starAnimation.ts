/**
 * Star Animation (Safari Debug Mode).
 *
 * Direct TS port of the original Webflow cloneable script
 * with detailed logging to debug Safari behaviour.
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

    const random = (min: number, max?: number): number => {
        if (max == null) { max = min; min = 0; }
        if (min > max) { const tmp = min; min = max; max = tmp; }
        return min + (max - min) * Math.random();
    };

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

    // --- LOAD / RESIZE WIRING WITH READY STATE CHECK ---
    console.log('[Safari Debug] document.readyState:', document.readyState);

    const onLoad = () => {
        console.group('%c[Safari Debug] onLoad()', 'color: cyan');
        console.log('[onLoad] Fired.');
        createStars();

        try {
            baseStar.remove();
            console.log('[onLoad] baseStar removed.');
        } catch (e) {
            console.warn('[onLoad] Could not remove baseStar:', e);
        }
        console.groupEnd();
    };

    const onResize = () => {
        console.group('%c[Safari Debug] onResize()', 'color: yellow');
        clearStars();
        createStars();
        console.groupEnd();
    };

    if (document.readyState === 'complete') {
        console.log('[Safari Debug] load already fired → calling onLoad() immediately.');
        onLoad();
    } else {
        console.log('[Safari Debug] attaching window.load listener.');
        window.addEventListener('load', onLoad);
    }

    console.log('[Safari Debug] attaching window.resize listener.');
    window.addEventListener('resize', onResize);

    // --- CORE STAR LOGIC ---

    function createStars() {
        console.group('[Safari Debug] createStars()');
        const twinklingStars = document.querySelectorAll<HTMLElement>('[dd-animation="background"]');
        console.log('[Safari Debug] Containers found:', twinklingStars.length);

        twinklingStars.forEach((element, index) => {
            // Read per-container star count
            const customCountAttr = element.getAttribute('dd-star-count');
            const thisContainerStarCount = customCountAttr
                ? parseInt(customCountAttr, 10)
                : numStars;

            console.log(
                `[Safari Debug] Container ${index + 1}: using star count = ${thisContainerStarCount}`
            );

            // Ensure overlay positioning
            if (!element.style.position) element.style.position = 'relative';
            if (!element.style.overflow) element.style.overflow = 'hidden';

            const elementWidth = element.offsetWidth;
            const elementHeight = element.offsetHeight;

            console.log(
                `[Safari Debug] Container ${index + 1}: size = ${elementWidth} x ${elementHeight}`
            );

            for (let i = 0; i < thisContainerStarCount; i++) {
                if (i === 0) console.log('[Safari Debug] Creating first star in container', index + 1);
                stars.push(createStar(element, elementWidth, elementHeight));
            }
        });

        console.log('[Safari Debug] Total stars created:', stars.length);
        console.groupEnd();
    }

    function clearStars() {
        console.group('[Safari Debug] clearStars()');
        stars.forEach((star, i) => {
            if (i === 0) console.log('[Safari Debug] Killing first timeline + removing star');
            star.timeline.kill();
            star.element.remove();
        });
        console.log('[Safari Debug] Stars removed:', stars.length);
        stars = [];
        console.groupEnd();
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

    console.groupEnd();
};