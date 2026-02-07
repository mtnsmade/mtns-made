(function(){const d=`<svg width="200" height="20" viewBox="0 0 151 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_loader)">
<path d="M12.4863 0.209707L7.22333 8.93708L1.96031 0.209707H0V14.793H2.78599V6.66785L6.25382 12.3974H8.19283L11.6607 6.66785V14.793H14.4467V0.209707H12.4863Z" fill="white"/>
<path d="M21.8086 0.209708V2.70747H25.6253V14.793H28.4113V2.70747H32.2307V0.209708H21.8086Z" fill="white"/>
<path d="M49.4714 0.209708V9.70872L41.4198 0.209708H39.4595V14.793H42.2455V5.29126L50.2971 14.793H52.2574V0.209708H49.4714Z" fill="white"/>
<path d="M60.1863 10.8971C61.012 11.8139 62.2718 12.5022 63.5929 12.5022C64.8314 12.5022 65.6971 11.7306 65.6971 10.6686C65.6971 8.79459 63.0149 8.56336 61.0733 7.418C59.9386 6.75121 59.0304 5.75103 59.0304 4.10557C59.0304 1.50027 61.4035 0 63.798 0C65.2629 0 66.6266 0.354902 67.9876 1.3739L66.544 3.45761C65.9661 2.91719 64.9966 2.50045 64.0457 2.50045C62.9936 2.50045 61.8164 2.96021 61.8164 4.08406C61.8164 6.43933 68.483 5.70801 68.483 10.6256C68.483 13.2094 66.1925 15 63.5902 15C61.6512 15 59.8534 14.188 58.3672 12.8114L60.1837 10.8944L60.1863 10.8971Z" fill="white"/>
<path d="M95.6211 0.209708L90.3581 8.93708L85.0951 0.209708H83.1348V14.793H85.9208V6.66785L89.3886 12.3974H91.3276L94.7954 6.66785V14.793H97.5814V0.209708H95.6211Z" fill="white"/>
<path d="M132.023 4.3341C131.219 3.31241 130.041 2.71016 128.329 2.71016H126.265V12.2925H128.329C130.041 12.2925 131.219 11.6876 132.023 10.6686C132.683 9.83509 133.075 8.71123 133.075 7.50134C133.075 6.29144 132.683 5.16759 132.023 4.3341ZM128.02 0.209708C130.31 0.209708 131.818 0.709798 132.992 1.58361C134.766 2.91718 135.861 5.08424 135.861 7.50134C135.861 9.91844 134.766 12.0855 132.992 13.4191C131.815 14.2929 130.31 14.793 128.02 14.793H123.479V0.209708H128.02Z" fill="white"/>
<path d="M142.125 0.209708V14.793H151V12.2925H144.911V8.22996H149.349V5.72951H144.911V2.70747H150.795V0.209708H142.125Z" fill="white"/>
<path d="M110.143 4.75084L112.814 11.0262H107.476L110.143 4.75084ZM109.173 0.209708L102.98 14.793H105.889L106.419 13.5374H113.885L114.415 14.793H117.326L111.133 0.209708H109.173Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_loader">
<rect width="151" height="15" fill="white"/>
</clipPath>
</defs>
</svg>`,c=`
    .mtns-page-loader {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #353435;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      transition: opacity 0.5s ease, visibility 0.5s ease;
    }

    .mtns-page-loader.loaded {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .mtns-page-loader-logo {
      margin-bottom: 20px;
    }

    .mtns-page-loader-logo svg {
      width: 200px;
      height: auto;
    }

    .mtns-page-loader-text {
      font-family: "Mtnsmade Regular", "Mtnsmade Light", sans-serif;
      font-size: 12px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.6);
      animation: mtns-pulse 1.5s ease-in-out infinite;
    }

    .mtns-page-loader-percent {
      position: fixed;
      bottom: 40px;
      right: 50px;
      font-family: "Mtnsmade Light", "Mtnsmade Regular", sans-serif;
      font-size: 120px;
      font-weight: 300;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1;
    }

    @media (max-width: 768px) {
      .mtns-page-loader-percent {
        font-size: 80px;
        bottom: 30px;
        right: 30px;
      }
    }

    @keyframes mtns-pulse {
      0%, 100% {
        opacity: 0.3;
      }
      50% {
        opacity: 1;
      }
    }
  `,a=document.createElement("style");a.id="mtns-loader-styles",a.textContent=c,document.head.appendChild(a);const t=document.createElement("div");t.className="mtns-page-loader",t.innerHTML=`
    <div class="mtns-page-loader-logo">${d}</div>
    <div class="mtns-page-loader-text">Loading</div>
    <div class="mtns-page-loader-percent">0</div>
  `,document.body?document.body.insertBefore(t,document.body.firstChild):document.addEventListener("DOMContentLoaded",()=>{document.body.insertBefore(t,document.body.firstChild)});const m=t.querySelector(".mtns-page-loader-percent");let n=0,e=0,i;function o(){n<e?(n+=1,m.textContent=n,i=requestAnimationFrame(o)):n<100&&(i=requestAnimationFrame(o))}o();function p(){const l=performance.getEntriesByType("resource");document.readyState==="loading"?e=Math.min(30,e+5):document.readyState==="interactive"?e=Math.max(e,50):document.readyState==="complete"&&(e=100);const f=50,g=l.length,u=Math.min(90,Math.floor(g/f*90));e=Math.max(e,u)}const s=setInterval(()=>{p(),e>=100&&clearInterval(s)},100),h=setInterval(()=>{e<90&&document.readyState!=="complete"&&(e=Math.min(90,e+Math.random()*3))},200);function r(){clearInterval(s),clearInterval(h),e=100;const l=setInterval(()=>{n>=100&&(clearInterval(l),cancelAnimationFrame(i),setTimeout(()=>{t.classList.add("loaded"),setTimeout(()=>{t.remove(),a.remove()},500)},200))},50)}document.readyState==="complete"?r():window.addEventListener("load",r)})();
