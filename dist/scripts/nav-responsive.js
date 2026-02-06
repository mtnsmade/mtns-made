(function(){const n={viewportMin:992,viewportMax:1440,logo:{minWidth:120,maxWidth:150},navLinks:{minSize:11,maxSize:14},navGap:{minGap:20,maxGap:40},gridPadding:{minPadding:20,maxPadding:30},buttons:{minSize:11,maxSize:14},buttonPadding:{minX:14,maxX:20,minY:8,maxY:12},searchTextHideBelow:1200};function i(t,o,a=n.viewportMin,p=n.viewportMax){const d=(o-t)/(p-a),m=t-d*a,l=d*100;return`clamp(${t}px, ${m.toFixed(2)}px + ${l.toFixed(4)}vw, ${o}px)`}function e(){const t="mtns-nav-responsive",o=document.getElementById(t);o&&o.remove();const a=document.createElement("style");a.id=t,a.textContent=`
      /* MTNS MADE Responsive Navigation */
      /* Fluid scaling within desktop breakpoint (${n.viewportMin}px - ${n.viewportMax}px) */

      @media screen and (min-width: ${n.viewportMin}px) {
        /* Global Nav Grid fluid padding */
        .global-nav-grid {
          padding-left: ${i(n.gridPadding.minPadding,n.gridPadding.maxPadding)} !important;
          padding-right: ${i(n.gridPadding.minPadding,n.gridPadding.maxPadding)} !important;
        }

        /* Logo fluid sizing */
        .global-nav-logo,
        .global-nav-logo img,
        .global-nav-logo svg {
          width: ${i(n.logo.minWidth,n.logo.maxWidth)} !important;
          height: auto !important;
        }

        /* Nav links fluid font size */
        .global-nav-link {
          font-size: ${i(n.navLinks.minSize,n.navLinks.maxSize)} !important;
          white-space: normal !important;
          text-align: center !important;
          line-height: 1.2 !important;
        }

        /* Nav desktop container fluid gap */
        .global-nav-desktop {
          gap: ${i(n.navGap.minGap,n.navGap.maxGap)} !important;
        }

        /* Button fluid sizing */
        .global-nav-burger-tools .button,
        .buttons .button,
        .nav-button .button {
          font-size: ${i(n.buttons.minSize,n.buttons.maxSize)} !important;
          padding-left: ${i(n.buttonPadding.minX,n.buttonPadding.maxX)} !important;
          padding-right: ${i(n.buttonPadding.minX,n.buttonPadding.maxX)} !important;
          padding-top: ${i(n.buttonPadding.minY,n.buttonPadding.maxY)} !important;
          padding-bottom: ${i(n.buttonPadding.minY,n.buttonPadding.maxY)} !important;
        }

        /* Dropdown toggle text fluid sizing */
        .global-nav-dropdown {
          font-size: ${i(n.navLinks.minSize,n.navLinks.maxSize)} !important;
        }
      }

      /* Search button - hide text below threshold, show only icon */
      @media screen and (min-width: ${n.viewportMin}px) and (max-width: ${n.searchTextHideBelow}px) {
        [button="search-text"] {
          display: none !important;
        }
      }
    `,document.head.appendChild(a),console.log("MTNS Nav Responsive: Fluid styles injected")}function g(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}window.MTNSNavResponsive={config:n,refresh:e,fluidValue:i},g()})();
