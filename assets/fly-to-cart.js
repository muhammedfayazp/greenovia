/**
 * FlyToCart custom element for animating product images to cart
 * This component creates a visual effect of a product "flying" to the cart when added
 */
class FlyToCart extends HTMLElement {
  /** @type {Element} */
  source;

  /** @type {boolean} */
  useSourceSize = false;

  /** @type {Element} */
  destination;

  connectedCallback() {
    this.#animate();
  }

  #animate = async () => {
    const sourceRect = this.source.getBoundingClientRect();
    const destinationRect = this.destination.getBoundingClientRect();

    //Define bezier curve points
    const startPoint = {
      x: sourceRect.left + sourceRect.width / 2,
      y: sourceRect.top + sourceRect.height / 2,
    };

    const endPoint = {
      x: destinationRect.left + destinationRect.width / 2,
      y: destinationRect.top + destinationRect.height / 2,
    };

    // Position the flying thingy back to the start point
    if (this.useSourceSize) {
      this.style.setProperty('--width', `${sourceRect.width}px`);
      this.style.setProperty('--height', `${sourceRect.height}px`);
    }
    this.style.setProperty('--start-x', `${startPoint.x}px`);
    this.style.setProperty('--start-y', `${startPoint.y}px`);
    this.style.setProperty('--travel-x', `${endPoint.x - startPoint.x}px`);
    this.style.setProperty('--travel-y', `${endPoint.y - startPoint.y}px`);
    await Promise.allSettled(this.getAnimations().map((a) => a.finished));
    this.#pulseDestination();
    this.remove();
  };

  /**
   * Gives the destination (the cart icon) a quick "impact" pulse timed to the moment
   * the flying item actually lands, instead of leaving it static once the animation ends.
   */
  #pulseDestination() {
    if (!(this.destination instanceof HTMLElement)) return;

    const destination = this.destination;
    destination.classList.add('fly-to-cart-impact');
    destination.addEventListener(
      'animationend',
      () => destination.classList.remove('fly-to-cart-impact'),
      { once: true }
    );
  }
}

if (!customElements.get('fly-to-cart')) {
  customElements.define('fly-to-cart', FlyToCart);
}
