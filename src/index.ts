import { skipToMainContent } from "$digerati/skipToMainContent";
import { currentYear } from "$digerati/currentYear";
import { displayGiftVariants, cleanFormPostData } from "$minerva/giftForm";
import { starAnimation } from "$minerva/starAnimation";

window.Webflow || [];
window.Webflow.push(() => {
  skipToMainContent();
  currentYear();
  cleanFormPostData();
  displayGiftVariants();
  starAnimation();
});