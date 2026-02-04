/**
 * MTNS MADE - Responsive Navigation
 * Adds fluid scaling for nav elements within desktop breakpoint
 * Uses CSS clamp() for smooth transitions between min/max sizes
 */

(function() {
  'use strict';

  // Configuration - adjust these values as needed
  const CONFIG = {
    // Viewport range for scaling (desktop breakpoint)
    viewportMin: 992,   // px - start of desktop
    viewportMax: 1440,  // px - max scaling point

    // Logo sizing
    logo: {
      minWidth: 100,    // px at viewport min
      maxWidth: 140,    // px at viewport max
    },

    // Nav link font size
    navLinks: {
      minSize: 12,      // px at viewport min
      maxSize: 15,      // px at viewport max
    },

    // Nav link gap/spacing
    navGap: {
      minGap: 16,       // px at viewport min
      maxGap: 32,       // px at viewport max
    },

    // Button font size
    buttons: {
      minSize: 11,      // px at viewport min
      maxSize: 14,      // px at viewport max
    },

    // Button padding
    buttonPadding: {
      minX: 12,         // px horizontal at viewport min
      maxX: 20,         // px horizontal at viewport max
      minY: 6,          // px vertical at viewport min
      maxY: 10,         // px vertical at viewport max
    }
  };

  // Helper function to generate clamp() value
  function fluidValue(minVal, maxVal, minVw = CONFIG.viewportMin, maxVw = CONFIG.viewportMax) {
    // Calculate the slope
    const slope = (maxVal - minVal) / (maxVw - minVw);
    // Calculate the y-intercept
    const intercept = minVal - slope * minVw;
    // Convert to vw
    const slopeVw = slope * 100;

    return `clamp(${minVal}px, ${intercept.toFixed(2)}px + ${slopeVw.toFixed(4)}vw, ${maxVal}px)`;
  }

  // Inject responsive styles
  function injectStyles() {
    const styleId = 'mtns-nav-responsive';

    // Remove existing if present
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = styleId;

    style.textContent = `
      /* MTNS MADE Responsive Navigation */
      /* Fluid scaling within desktop breakpoint (${CONFIG.viewportMin}px - ${CONFIG.viewportMax}px) */

      @media screen and (min-width: ${CONFIG.viewportMin}px) {
        /* Logo fluid sizing */
        .global-nav-logo,
        .global-nav-logo img {
          width: ${fluidValue(CONFIG.logo.minWidth, CONFIG.logo.maxWidth)} !important;
          height: auto !important;
        }

        /* Nav links fluid font size */
        .global-nav-link {
          font-size: ${fluidValue(CONFIG.navLinks.minSize, CONFIG.navLinks.maxSize)} !important;
        }

        /* Nav desktop container fluid gap */
        .global-nav-desktop {
          gap: ${fluidValue(CONFIG.navGap.minGap, CONFIG.navGap.maxGap)} !important;
        }

        /* Button fluid sizing */
        .global-nav-burger-tools .button,
        .buttons .button,
        .nav-button .button {
          font-size: ${fluidValue(CONFIG.buttons.minSize, CONFIG.buttons.maxSize)} !important;
          padding-left: ${fluidValue(CONFIG.buttonPadding.minX, CONFIG.buttonPadding.maxX)} !important;
          padding-right: ${fluidValue(CONFIG.buttonPadding.minX, CONFIG.buttonPadding.maxX)} !important;
          padding-top: ${fluidValue(CONFIG.buttonPadding.minY, CONFIG.buttonPadding.maxY)} !important;
          padding-bottom: ${fluidValue(CONFIG.buttonPadding.minY, CONFIG.buttonPadding.maxY)} !important;
        }

        /* Dropdown toggle text fluid sizing */
        .global-nav-dropdown {
          font-size: ${fluidValue(CONFIG.navLinks.minSize, CONFIG.navLinks.maxSize)} !important;
        }
      }
    `;

    document.head.appendChild(style);
    console.log('MTNS Nav Responsive: Fluid styles injected');
  }

  // Initialize
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectStyles);
    } else {
      injectStyles();
    }
  }

  // Expose config for runtime adjustments
  window.MTNSNavResponsive = {
    config: CONFIG,
    refresh: injectStyles,
    fluidValue: fluidValue
  };

  init();
})();
