import type { MouseEvent } from "react";

/**
 * Mouse-tracking props for cards styled with the `.card-spotlight` utility.
 * Spreads `--spot-x` / `--spot-y` CSS custom properties onto the card element
 * so the radial glow follows the cursor with zero re-renders.
 *
 * Usage: `<div className="card-spotlight ..." {...spotlightProps}>`
 */
export const spotlightProps = {
  onMouseMove: (event: MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  },
};
