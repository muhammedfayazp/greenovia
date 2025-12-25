// Modern Collection Page Enhancements for Greenovia

document.addEventListener('DOMContentLoaded', function() {
  
  // Add star ratings to all product cards
  function addStarRatings() {
    const productCards = document.querySelectorAll('.card__content');
    
    productCards.forEach(card => {
      // Check if rating already exists
      if (card.querySelector('.product-rating')) return;
      
      // Find price element
      const priceElement = card.querySelector('.price');
      if (!priceElement) return;
      
      // Create rating HTML
      const ratingHTML = `
        <div class="product-rating" style="display:flex;align-items:center;justify-content:center;gap:6px;margin:8px 0;">
          <div class="product-stars" style="display:flex;gap:2px;">
            ${generateStars(5)}
          </div>
          <span class="product-review-count" style="font-size:13px;color:#666;">228</span>
        </div>
      `;
      
      // Insert after price
      priceElement.insertAdjacentHTML('afterend', ratingHTML);
    });
  }
  
  // Generate star SVGs
  function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      starsHTML += `
        <svg class="product-star" viewBox="0 0 24 24" style="width:14px;height:14px;fill:#ffc107;">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      `;
    }
    return starsHTML;
  }
  
  // Add HOT badges to products with "hot" or "trending" tags
  function addHotBadges() {
    const productCards = document.querySelectorAll('.card-wrapper');
    
    productCards.forEach(card => {
      // Check if already has badge
      if (card.querySelector('.card__badge')) return;
      
      // Get product URL to check tags (if available in data attributes)
      const productLink = card.querySelector('.card__heading a');
      if (!productLink) return;
      
      // Random assignment for demo (replace with actual tag checking)
      const isHot = Math.random() > 0.7; // 30% chance
      
      if (isHot) {
        const mediaElement = card.querySelector('.card__media');
        if (mediaElement) {
          const badgeHTML = '<span class="card__badge" style="position:absolute;top:12px;right:12px;background:#ff6b35;color:#fff;padding:4px 12px;border-radius:4px;font-size:12px;font-weight:700;z-index:2;">HOT</span>';
          mediaElement.style.position = 'relative';
          mediaElement.insertAdjacentHTML('beforeend', badgeHTML);
        }
      }
    });
  }
  
  // Initialize enhancements
  addStarRatings();
  addHotBadges();
  
  // Re-apply on infinite scroll or AJAX load
  if (window.Shopify && window.Shopify.bind) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          setTimeout(() => {
            addStarRatings();
            addHotBadges();
          }, 100);
        }
      });
    });
    
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
      observer.observe(productGrid, {
        childList: true,
        subtree: true
      });
    }
  }
  
});
