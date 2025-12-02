/**
 * Display Gift Variants.
 *
 * @author <cabal@digerati.design>
 */
export const displayGiftVariants = () => {
    const gifts = document.querySelectorAll('[dd-gift="type"]');
    if (!gifts) {
        return;
    }

    /**
     * Disable Gift Variants.
     */
    const disableGiftVariants = () => {
        const allGiftVariants = document.querySelectorAll('[dd-gift="variants"]');
        allGiftVariants.forEach(variant => {
            variant.classList.add('hide');
            const variantRadioButtons = variant.querySelectorAll('input[type="radio"]');
            if (!variantRadioButtons) {
                return;
            }
            variantRadioButtons.forEach(variantRadioButton => {
                variantRadioButton.setAttribute('disabled', 'true');
            });
        });
    };

    disableGiftVariants();

    /**
     * Add Click Handler.
     */
    gifts.forEach(gift => {
        gift.addEventListener('click', (event: MouseEvent): void => {
            const target = event.target as HTMLElement | null;

            const giftVariants = gift.querySelector<HTMLElement>('[dd-gift="variants"]');

            // If click is inside the variants area, let the radios behave normally
            if (giftVariants && target && giftVariants.contains(target)) {
                return; // no preventDefault, no custom logic
            }

            // From here on, it's a click on the card itself (not on a variant radio/label)
            event.preventDefault();

            // Collapse / disable all variants first
            disableGiftVariants();

            // Show + enable variants only if this gift actually has them
            if (giftVariants) {
                giftVariants.classList.remove('hide');

                const giftVariantRadioButtons = giftVariants.querySelectorAll('input[type="radio"]');
                if (giftVariantRadioButtons) {
                    giftVariantRadioButtons.forEach(giftVariantRadioButton => {
                        giftVariantRadioButton.removeAttribute('disabled');
                    });
                }
            }

            // Always select the *main* Gift radio (works for gifts with OR without variants)
            const mainGiftRadio =
                gift.querySelector<HTMLInputElement>('input[type="radio"][name="Gift"]') ||
                gift.querySelector<HTMLInputElement>('input[type="radio"][data-name="Gift"]');

            if (mainGiftRadio) {
                mainGiftRadio.checked = true;
                mainGiftRadio.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // Smooth scroll the clicked gift into view
            if (gift instanceof HTMLElement) {
                gift.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center', // or 'start' if you prefer
                    inline: 'nearest',
                });
            }
        });
    });
};

/**
 * Clean Form POST Data.
 *
 * @author <cabal@digerati.design>
 */
export const cleanFormPostData = () => {
    const submitButton = document.querySelector('input[type="submit"]');
    if (!submitButton) {
        return;
    }
    submitButton.addEventListener('click', () => {
        const giftForm = document.querySelector('form');
        if (!giftForm) {
            return;
        }
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        if (!radioButtons) {
            return;
        }
        radioButtons.forEach(radioButton => {
            if ((radioButton as HTMLInputElement).disabled) {
                radioButton.remove();
            }
        });
    });
};
