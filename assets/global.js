/**
 * GREENOVIA THEME - MAIN JAVASCRIPT
 * Version: 1.0.0
 */

(function() {
  'use strict';

  // ===== UTILITY FUNCTIONS =====
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // ===== HEADER SCROLL EFFECT =====
  function initHeaderScroll() {
    const header = $('.header');
    if (!header) return;

    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }

  // ===== CART DRAWER =====
  class CartDrawer {
    constructor() {
      this.drawer = $('.cart-drawer');
      this.overlay = $('.cart-drawer__overlay');
      this.closeBtn = $('.cart-drawer__close');
      this.cartIcon = $('.header__icon--cart');
      
      if (this.drawer) {
        this.init();
      }
    }

    init() {
      // Open cart
      if (this.cartIcon) {
        this.cartIcon.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      }

      // Close cart
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.close());
      }

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.drawer.classList.contains('active')) {
          this.close();
        }
      });
    }

    open() {
      this.drawer.classList.add('active');
      this.overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    close() {
      this.drawer.classList.remove('active');
      this.overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    async addItem(variantId, quantity = 1) {
      try {
        const response = await fetch(window.routes.cart_add_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            items: [{
              id: variantId,
              quantity: quantity
            }]
          })
        });

        if (!response.ok) throw new Error('Failed to add item');

        const cart = await response.json();
        this.updateCart(cart);
        this.open();
        this.showNotification('Item added to cart!');
        
        return cart;
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.showNotification('Error adding item to cart', 'error');
        throw error;
      }
    }

    async updateCart(cart) {
      // Update cart count
      const cartCount = $('.header__icon-count');
      if (cartCount) {
        cartCount.textContent = cart.item_count;
      }

      // Update cart drawer content
      await this.renderCart();
    }

    async renderCart() {
      try {
        const response = await fetch('/cart.js');
        const cart = await response.json();
        
        const cartBody = $('.cart-drawer__body');
        if (!cartBody) return;

        if (cart.items.length === 0) {
          cartBody.innerHTML = `
            <div class="cart-empty">
              <p>Your cart is empty</p>
              <a href="/collections/all" class="btn btn-primary">Continue Shopping</a>
            </div>
          `;
          return;
        }

        let html = '<div class="cart-items">';
        
        cart.items.forEach(item => {
          html += `
            <div class="cart-item" data-key="${item.key}">
              <div class="cart-item__image">
                <img src="${item.image}" alt="${item.title}">
              </div>
              <div class="cart-item__details">
                <h4 class="cart-item__title">${item.product_title}</h4>
                ${item.variant_title ? `<p class="cart-item__variant">${item.variant_title}</p>` : ''}
                <div class="cart-item__price">
                  ${this.formatMoney(item.line_price)}
                </div>
                <div class="cart-item__quantity">
                  <button class="qty-btn qty-minus" data-key="${item.key}">-</button>
                  <input type="number" class="qty-input" value="${item.quantity}" min="0" data-key="${item.key}">
                  <button class="qty-btn qty-plus" data-key="${item.key}">+</button>
                </div>
              </div>
              <button class="cart-item__remove" data-key="${item.key}">×</button>
            </div>
          `;
        });
        
        html += '</div>';
        
        cartBody.innerHTML = html;
        
        // Update footer
        const cartFooter = $('.cart-drawer__footer');
        if (cartFooter) {
          cartFooter.innerHTML = `
            <div class="cart-summary">
              <div class="cart-summary__row">
                <span>Subtotal:</span>
                <span class="cart-summary__price">${this.formatMoney(cart.total_price)}</span>
              </div>
              <p class="cart-note">Shipping calculated at checkout</p>
              <a href="/checkout" class="btn btn-primary btn-block">Checkout</a>
              <a href="/cart" class="btn btn-outline btn-block mt-sm">View Cart</a>
            </div>
          `;
        }

        // Attach event listeners
        this.attachCartEventListeners();
        
      } catch (error) {
        console.error('Error rendering cart:', error);
      }
    }

    attachCartEventListeners() {
      // Quantity buttons
      $$('.qty-minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const key = e.target.dataset.key;
          const input = $(`.qty-input[data-key="${key}"]`);
          const newQty = Math.max(0, parseInt(input.value) - 1);
          this.updateQuantity(key, newQty);
        });
      });

      $$('.qty-plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const key = e.target.dataset.key;
          const input = $(`.qty-input[data-key="${key}"]`);
          const newQty = parseInt(input.value) + 1;
          this.updateQuantity(key, newQty);
        });
      });

      // Quantity input
      $$('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
          const key = e.target.dataset.key;
          const newQty = Math.max(0, parseInt(e.target.value));
          this.updateQuantity(key, newQty);
        });
      });

      // Remove buttons
      $$('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const key = e.target.dataset.key;
          this.updateQuantity(key, 0);
        });
      });
    }

    async updateQuantity(key, quantity) {
      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: key,
            quantity: quantity
          })
        });

        if (!response.ok) throw new Error('Failed to update quantity');

        const cart = await response.json();
        await this.updateCart(cart);
        
      } catch (error) {
        console.error('Error updating quantity:', error);
        this.showNotification('Error updating cart', 'error');
      }
    }

    formatMoney(cents) {
      return 'AED ' + (cents / 100).toFixed(2);
    }

    showNotification(message, type = 'success') {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification notification--${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: var(--radius-md);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
      `;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  }

  // ===== PRODUCT QUICK ADD =====
  function initQuickAdd() {
    $$('[data-quick-add]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const variantId = btn.dataset.variantId;
        
        if (!variantId) return;

        btn.textContent = 'Adding...';
        btn.disabled = true;

        try {
          await window.cartDrawer.addItem(variantId);
          btn.textContent = 'Added!';
          setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.disabled = false;
          }, 2000);
        } catch (error) {
          btn.textContent = 'Error';
          setTimeout(() => {
            btn.textContent = 'Add to Cart';
            btn.disabled = false;
          }, 2000);
        }
      });
    });
  }

  // ===== MOBILE MENU =====
  function initMobileMenu() {
    const menuToggle = $('.mobile-menu-toggle');
    const mobileMenu = $('.mobile-menu');
    const menuClose = $('.mobile-menu__close');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    if (menuClose) {
      menuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  }

  // ===== PRODUCT IMAGE GALLERY =====
  function initProductGallery() {
    const mainImage = $('.product__main-image');
    const thumbnails = $$('.product__thumbnail');

    if (!mainImage || thumbnails.length === 0) return;

    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.preventDefault();
        const newSrc = thumb.dataset.image;
        mainImage.src = newSrc;
        
        // Update active state
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }

  // ===== VARIANT SELECTOR =====
  function initVariantSelector() {
    const variantSelects = $$('.variant-select');
    const addToCartBtn = $('.product-form__submit');
    const priceElement = $('.product__price');

    if (variantSelects.length === 0) return;

    variantSelects.forEach(select => {
      select.addEventListener('change', () => {
        updateSelectedVariant();
      });
    });

    function updateSelectedVariant() {
      const selectedOptions = [];
      variantSelects.forEach(select => {
        selectedOptions.push(select.value);
      });

      // Find matching variant
      // This would need product data from Liquid
      // Simplified version here
      if (addToCartBtn && priceElement) {
        addToCartBtn.disabled = false;
      }
    }
  }

  // ===== SEARCH =====
  function initSearch() {
    const searchInput = $('.search-form__input');
    const searchResults = $('.search-results');

    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value;

      if (query.length < 2) {
        if (searchResults) searchResults.style.display = 'none';
        return;
      }

      searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 300);
    });
  }

  async function performSearch(query) {
    try {
      const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`);
      const data = await response.json();
      
      // Display results
      // This would need proper implementation with UI
      console.log('Search results:', data);
      
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  // ===== COUNTDOWN TIMER =====
  function initCountdownTimers() {
    $$('[data-countdown]').forEach(timer => {
      const endDate = new Date(timer.dataset.countdown);
      
      const updateTimer = () => {
        const now = new Date();
        const diff = endDate - now;

        if (diff <= 0) {
          timer.textContent = 'Sale Ended';
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        timer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      };

      updateTimer();
      setInterval(updateTimer, 1000);
    });
  }

  // ===== SCROLL ANIMATIONS =====
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    $$('.product-card, .category-card, .trust-item').forEach(el => {
      observer.observe(el);
    });
  }

  // ===== WISHLIST (Simple LocalStorage Implementation) =====
  class Wishlist {
    constructor() {
      this.items = this.load();
      this.init();
    }

    init() {
      $$('[data-wishlist-toggle]').forEach(btn => {
        const productId = btn.dataset.productId;
        if (this.has(productId)) {
          btn.classList.add('active');
        }

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggle(productId);
          btn.classList.toggle('active');
        });
      });

      this.updateCount();
    }

    load() {
      try {
        return JSON.parse(localStorage.getItem('wishlist') || '[]');
      } catch {
        return [];
      }
    }

    save() {
      localStorage.setItem('wishlist', JSON.stringify(this.items));
      this.updateCount();
    }

    has(productId) {
      return this.items.includes(productId);
    }

    toggle(productId) {
      if (this.has(productId)) {
        this.items = this.items.filter(id => id !== productId);
      } else {
        this.items.push(productId);
      }
      this.save();
    }

    updateCount() {
      const countElement = $('.wishlist-count');
      if (countElement) {
        countElement.textContent = this.items.length;
      }
    }
  }

  // ===== INITIALIZE EVERYTHING =====
  function init() {
    initHeaderScroll();
    window.cartDrawer = new CartDrawer();
    initQuickAdd();
    initMobileMenu();
    initProductGallery();
    initVariantSelector();
    initSearch();
    initCountdownTimers();
    initScrollAnimations();
    window.wishlist = new Wishlist();

    // Initial cart render
    if (window.cartDrawer) {
      window.cartDrawer.renderCart();
    }

    console.log('✅ Greenovia Theme Loaded');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
