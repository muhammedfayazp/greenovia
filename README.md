# Greenovia Shopify Theme

**Version:** 1.0.0  
**A Premium Garden Center E-commerce Theme**

---

## 🌿 Overview

Greenovia is a fully custom Shopify theme designed specifically for garden centers, plant nurseries, and botanical retailers. Built with a 70% Bonsai, 20% Aurelle, and 10% Floralis aesthetic blend, this theme provides a modern, conversion-optimized shopping experience.

## ✨ Features

### Core Features
- ✅ **Responsive Design** - Fully optimized for desktop, tablet, and mobile
- ✅ **Sticky Header** - Fixed navigation that stays visible while scrolling
- ✅ **Cart Drawer** - Slide-out cart with AJAX updates
- ✅ **Product Quick View** - View product details without leaving the collection page
- ✅ **Wishlist System** - LocalStorage-based wishlist functionality
- ✅ **Search Functionality** - Predictive search with live results
- ✅ **Image Galleries** - Multiple product images with zoom
- ✅ **Product Variants** - Size, color, and custom options
- ✅ **Newsletter Signup** - Integrated email capture
- ✅ **Social Media Integration** - Connect all your social channels
- ✅ **Mobile Menu** - Touch-friendly navigation
- ✅ **Trust Badges** - Build customer confidence
- ✅ **Countdown Timers** - Create urgency for sales
- ✅ **Stock Counters** - Show limited availability

### Performance
- Optimized CSS and JavaScript
- Lazy loading images
- Minimal HTTP requests
- Fast page load times
- Google Lighthouse ready

### SEO Optimized
- Semantic HTML5
- Meta tags and Open Graph
- Structured data ready
- Alt text for images
- Clean URL structure

---

## 📦 Installation

### Method 1: Theme Editor (Recommended)

1. **Download the theme**
   - Download the `greenovia-theme` folder
   - Compress it into a ZIP file

2. **Upload to Shopify**
   - Log into your Shopify admin
   - Go to **Online Store** > **Themes**
   - Click **Upload theme**
   - Select your ZIP file
   - Wait for upload to complete

3. **Publish**
   - Click **Actions** > **Publish** on the uploaded theme

### Method 2: Shopify CLI (Advanced)

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Navigate to theme directory
cd greenovia-theme

# Login to your store
shopify login --store your-store.myshopify.com

# Push theme to Shopify
shopify theme push

# Or serve theme for development
shopify theme dev
```

---

## 🎨 Customization

### Theme Settings

Access theme settings in: **Online Store** > **Themes** > **Customize**

#### Colors
- **Primary Color** - Main brand color (default: #2D5016)
- **Secondary Color** - Supporting color (default: #5A7C3E)
- **Accent Color** - Call-to-action buttons (default: #D97D54)
- **Background** - Page background (default: #FAFAF8)
- **Text Colors** - Primary and secondary text colors

#### Typography
- **Heading Font** - Playfair Display (serif)
- **Body Font** - Inter (sans-serif)
- **Navigation Font** - Montserrat (sans-serif)

#### Header
- Upload logo (recommended: 150px wide)
- Enable/disable top announcement bar
- Configure menu links
- Show/hide search bar
- Enable wishlist icon

#### Footer
- Add multiple columns
- Text blocks
- Menu links
- Newsletter signup
- Social media links

### Editing Sections

The theme uses Shopify's section system. Edit sections in the theme customizer:

- **Hero Slider** - Homepage banner with images and CTAs
- **Category Grid** - Showcase product categories
- **Featured Products** - Display featured collection
- **Trust Badges** - Highlight key benefits
- **Announcement Bar** - Top bar messages
- **Newsletter** - Email capture

---

## 🛠️ Development

### File Structure

```
greenovia-theme/
├── assets/
│   ├── greenovia.css       # Main stylesheet
│   ├── global.js           # Main JavaScript
│   └── base.css            # Base styles
├── config/
│   ├── settings_schema.json    # Theme settings
│   └── settings_data.json      # Default settings
├── layout/
│   └── theme.liquid        # Main layout template
├── locales/
│   └── en.default.json     # English translations
├── sections/
│   ├── header.liquid       # Header section
│   ├── footer.liquid       # Footer section
│   └── announcement-bar.liquid
├── snippets/
│   ├── cart-drawer.liquid  # Cart drawer snippet
│   └── meta-tags.liquid    # SEO meta tags
├── templates/
│   ├── index.json          # Homepage template
│   ├── product.json        # Product page template
│   ├── collection.json     # Collection page template
│   └── cart.json           # Cart page template
└── README.md
```

### CSS Variables

The theme uses CSS custom properties for easy customization:

```css
:root {
  --color-primary: #2D5016;
  --color-secondary: #5A7C3E;
  --color-accent: #D97D54;
  --color-background: #FAFAF8;
  --color-text: #2C2C2C;
  
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --font-nav: 'Montserrat', sans-serif;
  
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 2rem;
  --space-lg: 3rem;
  --space-xl: 4rem;
  --space-xxl: 6rem;
}
```

### JavaScript API

#### Cart Drawer

```javascript
// Add item to cart
window.cartDrawer.addItem(variantId, quantity);

// Update cart
window.cartDrawer.renderCart();

// Open/close cart
window.cartDrawer.open();
window.cartDrawer.close();
```

#### Wishlist

```javascript
// Toggle wishlist item
window.wishlist.toggle(productId);

// Check if in wishlist
window.wishlist.has(productId);
```

---

## 📝 Setting Up Content

### 1. Create Navigation Menus

**Main Menu** (header navigation):
1. Go to **Online Store** > **Navigation**
2. Create a menu named "Main Menu"
3. Add links:
   - Indoor Plants → `/collections/indoor-plants`
   - Outdoor Plants → `/collections/outdoor-plants`
   - Tools & Accessories → `/collections/tools`
   - Sale → `/collections/sale`

**Footer Menu**:
1. Create a menu named "Footer"
2. Add links:
   - About Us → `/pages/about`
   - Contact → `/pages/contact`
   - Shipping → `/pages/shipping`
   - Returns → `/pages/returns`

### 2. Create Collections

Create collections for:
- Indoor Plants
- Outdoor Plants
- Succulents & Cacti
- Flowering Plants
- Beginner-Friendly
- Pet-Safe Plants
- Air-Purifying Plants
- Sale Items

### 3. Add Products

For each product, include:
- **Title** - e.g., "Snake Plant (Sansevieria)"
- **Description** - Care instructions and benefits
- **Images** - At least 4-6 high-quality photos
- **Price** - In AED
- **Variants** - Size options (Small, Medium, Large)
- **Tags** - indoor, easy-care, pet-safe, etc.
- **Metafields** (optional):
  - Care level (Easy/Moderate/Advanced)
  - Light needs (Low/Bright/Full Sun)
  - Water frequency (Low/Moderate/High)
  - Pet safe (Yes/No)

### 4. Create Pages

Essential pages:
- **About Us** - Your story and mission
- **Contact** - Contact form and information
- **FAQ** - Common questions
- **Shipping** - Delivery information
- **Returns** - Return policy
- **Plant Care Guide** - Educational content

### 5. Configure Settings

**General Settings**:
- Store name and address
- Email for notifications
- Currency (AED)
- Time zone (Dubai/Abu Dhabi)

**Shipping**:
- Set up shipping zones for UAE
- Configure rates
- Enable local delivery

**Payments**:
- Add payment providers
- Enable Cash on Delivery

---

## 🎯 Best Practices

### Product Photography
- Use high-resolution images (2000x2000px minimum)
- White or neutral backgrounds
- Show multiple angles
- Include scale references
- Showcase plants in context

### SEO
- Write unique meta descriptions
- Use descriptive product titles
- Add alt text to all images
- Create internal links
- Build quality backlinks

### Performance
- Compress images before upload
- Use WebP format when possible
- Limit apps and scripts
- Enable CDN
- Monitor page speed

### Customer Experience
- Clear product descriptions
- Detailed care instructions
- Multiple payment options
- Fast checkout process
- Responsive customer support

---

## 📱 Mobile Optimization

The theme is fully responsive with:
- Mobile-first design approach
- Touch-friendly buttons (44px minimum)
- Swipeable image galleries
- Collapsible menus
- Optimized forms
- Fast mobile checkout

---

## 🔧 Troubleshooting

### Cart Not Updating
- Clear browser cache
- Check JavaScript console for errors
- Verify cart drawer is enabled
- Test in different browser

### Images Not Loading
- Check file size (< 500KB recommended)
- Verify image URLs
- Clear Shopify cache
- Re-upload images

### Mobile Menu Not Opening
- Check JavaScript errors
- Verify mobile-menu element exists
- Test on different devices

### Styling Issues
- Clear browser cache
- Check CSS specificity
- Verify custom CSS
- Test in incognito mode

---

## 🌍 Localization

### Adding Arabic Support

1. **Create Arabic locale file**:
   - Create `locales/ar.json`
   - Translate all text strings

2. **Enable RTL**:
   - Add RTL stylesheet
   - Test layout mirroring
   - Adjust spacing and alignment

3. **Configure Shopify**:
   - Enable Arabic in settings
   - Add Arabic URL structure
   - Test checkout in Arabic

---

## 📞 Support

### Documentation
- Theme documentation: `/docs`
- Shopify Help: https://help.shopify.com
- Liquid documentation: https://shopify.dev/themes/liquid

### Need Help?
- Email: support@greenovia.ae
- Phone: +971-XXX-XXXX
- Live Chat: Available in theme customizer

---

## 📋 Changelog

### Version 1.0.0 (Initial Release)
- Complete theme structure
- Responsive design
- Cart drawer functionality
- Product quick view
- Wishlist system
- Search functionality
- Mobile menu
- SEO optimization
- Performance optimization

---

## 📄 License

This theme is licensed for use with Greenovia stores only. Redistribution or resale is prohibited.

---

## 🙏 Credits

**Fonts**:
- Playfair Display by Claus Eggers Sørensen
- Inter by Rasmus Andersson
- Montserrat by Julieta Ulanovsky

**Icons**:
- Feather Icons (https://feathericons.com)

**Inspiration**:
- Bonsai (Lyra Theme)
- Aurelle (Iris Theme)
- Floralis (Urban Theme)

---

## 🚀 Getting Started Checklist

- [ ] Upload theme to Shopify
- [ ] Configure theme settings (colors, logo)
- [ ] Create navigation menus
- [ ] Add social media links
- [ ] Create collections
- [ ] Add 20+ products
- [ ] Create essential pages
- [ ] Set up shipping zones
- [ ] Configure payment methods
- [ ] Test checkout process
- [ ] Add announcement bar messages
- [ ] Configure newsletter signup
- [ ] Test on mobile devices
- [ ] Optimize images
- [ ] Set up SEO
- [ ] Launch! 🎉

---

**Built with ❤️ for Greenovia**

*Making the world greener, one plant at a time.* 🌿
