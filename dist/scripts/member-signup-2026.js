(function(){console.log("Member signup 2026 script loaded");const c={emerging:{name:"Emerging",planId:"pln_emerging-i59k0l22",monthlyPriceId:"prc_emerging-monthly-pjfn0zg0",yearlyPriceId:"prc_emerging-subscription-gsa206gw"},professional:{name:"Professional",planId:"pln_professional-ic970osr",monthlyPriceId:"prc_professional-monthly-ilg80e59",yearlyPriceId:"prc_professional-subscription-4z9m0lla"},"not-for-profit":{name:"Not For Profit",planId:"pln_not-for-profit-qaa106a4",monthlyPriceId:"prc_not-for-profit-monthly-t1gb0etf",yearlyPriceId:"prc_not-for-profit-subscription-w69j0l9k"},"small-business":{name:"Small Business",planId:"pln_small-business-qsa506lc",monthlyPriceId:"prc_small-business-monthly-3zgd0ga2",yearlyPriceId:"prc_small-business-subscription-jpa606e1"},"large-business":{name:"Large Business",planId:"pln_medium-large-business-9qa706pj",monthlyPriceId:"prc_medium-large-business-monthly-i2fl0z2d",yearlyPriceId:"prc_medium-large-business-subscription-g6a806rj"},"spaces-suppliers":{name:"Spaces / Suppliers",planId:"pln_creative-spaces-suppliers-ck5s08g3",monthlyPriceId:"prc_spaces-suppliers-monthly-odbt0bpb",yearlyPriceId:"prc_spaces-suppliers-yearly-o0bo07rj"}},I=[{id:"64bfb65db1569eeda7582433",name:"Bell",slug:"bell"},{id:"64bfb65dc335367110321546",name:"Bilpin",slug:"bilpin"},{id:"64bfb65d757e05b74ba0e403",name:"Blackheath",slug:"blackheath"},{id:"64bfb65d6a8497d80eb5b5c6",name:"Blaxland",slug:"blaxland"},{id:"64bfb65d409f7c767042076c",name:"Bullaburra",slug:"bullaburra"},{id:"64bfb65d409f7c767042076d",name:"Faulconbridge",slug:"faulconbridge"},{id:"64bfb65d655ee21e8c72ee13",name:"Glenbrook",slug:"glenbrook"},{id:"64bfb65d2cc46c71a5be8efb",name:"Hazelbrook",slug:"hazelbrook"},{id:"64bfb65d7519806dd636ca2a",name:"Katoomba",slug:"katoomba"},{id:"64bfb65e2cc46c71a5be8f19",name:"Lapstone",slug:"lapstone"},{id:"64bfb65e57a4cc3165c39201",name:"Lawson",slug:"lawson"},{id:"64bfb65ec791453caa2f9d46",name:"Leura",slug:"leura"},{id:"64bfb65ec791453caa2f9d4f",name:"Linden",slug:"linden"},{id:"64bfb65e75299ea8759da3c3",name:"Medlow Bath",slug:"medlow-bath"},{id:"64bfb65ec016ed44dbb8add3",name:"Megalong Valley",slug:"megalong-valley"},{id:"64bfb65ec7c3a0d4663a1577",name:"Mount Irvine",slug:"mount-irvine"},{id:"64bfb65fafe29b2df8a63f02",name:"Mount Tomah",slug:"mount-tomah"},{id:"64bfb65f7519806dd636cccf",name:"Mount Victoria",slug:"mount-victoria"},{id:"64bfb65f2cc46c71a5be9045",name:"Mount Wilson",slug:"mount-wilson"},{id:"6733dfdf795b2df6a1573dd1",name:"Penrith",slug:"penrith"},{id:"64bfb65f2cc46c71a5be907d",name:"Springwood",slug:"springwood"},{id:"64bfb65feec6228116d7a9f3",name:"Sun Valley",slug:"sun-valley"},{id:"64bfb65f73964b051a9b6baf",name:"Valley Heights",slug:"valley-heights"},{id:"64bfb65fd304d7de5fc6ecf0",name:"Warrimoo",slug:"warrimoo"},{id:"64bfb65f9f89e1af537ca7e1",name:"Wentworth Falls",slug:"wentworth-falls"},{id:"64bfb65fc3353671103219b0",name:"Winmalee",slug:"winmalee"},{id:"64bfb65f363259218e7640bf",name:"Woodford",slug:"woodford"},{id:"64bfb66060c8908f983dd9e6",name:"Yellow Rock",slug:"yellow-rock"}],S=`
    .ms-container {
      font-family: inherit;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    .ms-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .ms-header h2 {
      margin: 0 0 8px 0;
      font-size: 28px;
      color: #333;
    }
    .ms-header p {
      margin: 0;
      color: #666;
      font-size: 16px;
    }
    .ms-membership-badge {
      display: inline-block;
      background: #333;
      color: #fff;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-top: 12px;
    }
    .ms-form {
      background: #fff;
      border-radius: 8px;
      padding: 32px;
      border: 1px solid #e0e0e0;
    }
    .ms-form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 600px) {
      .ms-form-row {
        grid-template-columns: 1fr;
      }
      .ms-form {
        padding: 24px 16px;
      }
    }
    .ms-form-field {
      margin-bottom: 20px;
    }
    .ms-form-field.full-width {
      grid-column: 1 / -1;
    }
    .ms-form-field label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      text-align: left;
    }
    .ms-form-field label span {
      color: #dc3545;
    }
    .ms-form-field .ms-hint {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .ms-form-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .ms-form-input:focus {
      outline: none;
      border-color: #333;
    }
    .ms-form-input.error {
      border-color: #dc3545;
    }
    select.ms-form-input {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 36px;
    }
    .ms-error-msg {
      font-size: 12px;
      color: #dc3545;
      margin-top: 4px;
      display: none;
    }
    .ms-error-msg.visible {
      display: block;
    }
    .ms-checkbox-field {
      margin-bottom: 16px;
    }
    .ms-checkbox-field label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-weight: 400;
      cursor: pointer;
    }
    .ms-checkbox-field input[type="checkbox"] {
      margin-top: 3px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
    .ms-checkbox-field a {
      color: #007bff;
      text-decoration: underline;
    }
    .ms-btn {
      background: #333;
      color: #fff;
      border: none;
      padding: 14px 28px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: background 0.2s;
      width: 100%;
      margin-top: 12px;
    }
    .ms-btn:hover {
      background: #555;
    }
    .ms-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .ms-divider {
      display: flex;
      align-items: center;
      margin: 24px 0;
      color: #999;
      font-size: 13px;
    }
    .ms-divider::before,
    .ms-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #ddd;
    }
    .ms-divider::before {
      margin-right: 16px;
    }
    .ms-divider::after {
      margin-left: 16px;
    }
    .ms-login-link {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }
    .ms-login-link a {
      color: #333;
      font-weight: 600;
      text-decoration: none;
    }
    .ms-login-link a:hover {
      text-decoration: underline;
    }
    .ms-loading {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .ms-error-banner {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .ms-info-box {
      padding: 16px;
      background: #e8f4fc;
      border-radius: 8px;
      margin-bottom: 24px;
      border-left: 4px solid #007bff;
    }
    .ms-info-box p {
      margin: 0;
      font-size: 14px;
      color: #333;
      line-height: 1.5;
    }
    .ms-password-requirements {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
      padding-left: 16px;
    }
    .ms-password-requirements li {
      margin-bottom: 4px;
    }
  `;function q(){const e=new URLSearchParams(window.location.search);let r=e.get("type"),s=e.get("billing")||"monthly";if(!r||!c[r]){const i=window.location.pathname.match(/\/join\/signup\/2026\/([^\/]+)/);i&&c[i[1]]?r=i[1]:r=null}return s!=="monthly"&&s!=="yearly"&&(s="monthly"),{type:r,billing:s}}function E(e,r){return`${e} ${r}`.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}function L(){let e='<option value="">Select your suburb...</option>';return I.forEach(r=>{e+=`<option value="${r.id}" data-slug="${r.slug}">${r.name}</option>`}),`<select class="ms-form-input" id="ms-suburb" required>${e}</select>`}function C(){return new Promise((e,r)=>{let s=0;const i=50,a=setInterval(()=>{s++,window.$memberstackDom?(clearInterval(a),e()):s>=i&&(clearInterval(a),r(new Error("Memberstack not loaded")))},100)})}function h(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}function y(e){return e.length>=8}function z(e,r,s){const i=c[r],a=s==="yearly"?"Yearly":"Monthly";e.innerHTML=`
      <div class="ms-container">
        <div class="ms-header">
          <h2>CREATE YOUR ACCOUNT</h2>
          <div class="ms-membership-badge">${i.name} - ${a}</div>
        </div>

        <div class="ms-form">
          <div class="ms-error-banner" id="ms-error-banner" style="display: none;"></div>

          <div class="ms-form-row">
            <div class="ms-form-field">
              <label>First Name <span>*</span></label>
              <input type="text" class="ms-form-input" id="ms-first-name" required>
            </div>
            <div class="ms-form-field">
              <label>Last Name <span>*</span></label>
              <input type="text" class="ms-form-input" id="ms-last-name" required>
            </div>
          </div>

          <div class="ms-form-field">
            <label>Email <span>*</span></label>
            <input type="email" class="ms-form-input" id="ms-email" required>
            <div class="ms-error-msg" id="ms-email-error">Please enter a valid email address</div>
          </div>

          <div class="ms-form-field">
            <label>Suburb <span>*</span></label>
            ${L()}
            <div class="ms-hint">Select the suburb where you live or where the majority of your business activity takes place</div>
          </div>

          <div class="ms-form-field">
            <label>Password <span>*</span></label>
            <input type="password" class="ms-form-input" id="ms-password" required>
            <ul class="ms-password-requirements">
              <li>At least 8 characters</li>
            </ul>
            <div class="ms-error-msg" id="ms-password-error">Password must be at least 8 characters</div>
          </div>

          <div class="ms-divider">Confirmations</div>

          <div class="ms-checkbox-field">
            <label>
              <input type="checkbox" id="ms-confirm-location" required>
              <span>I confirm that I live or work within the Blue Mountains</span>
            </label>
          </div>

          <div class="ms-checkbox-field">
            <label>
              <input type="checkbox" id="ms-confirm-creative" required>
              <span>I confirm that I work in the creative industries as per <a href="#" data-modal="creative-definition">this definition</a></span>
            </label>
          </div>

          <button type="button" class="ms-btn" id="ms-submit-btn">
            Create Account & Continue to Payment
          </button>

          <div class="ms-login-link">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </div>
      </div>
    `,M(e,r,s)}function M(e,r,s){e.querySelector(".ms-form");const i=e.querySelector("#ms-submit-btn"),a=e.querySelector("#ms-email"),l=e.querySelector("#ms-password"),_=e.querySelector("#ms-email-error"),B=e.querySelector("#ms-password-error"),n=e.querySelector("#ms-error-banner");a.addEventListener("blur",()=>{const o=h(a.value);a.classList.toggle("error",!o&&a.value),_.classList.toggle("visible",!o&&a.value)}),l.addEventListener("blur",()=>{const o=y(l.value);l.classList.toggle("error",!o&&l.value),B.classList.toggle("visible",!o&&l.value)}),i.addEventListener("click",async()=>{var k;n.style.display="none";const o=e.querySelector("#ms-first-name").value.trim(),u=e.querySelector("#ms-last-name").value.trim(),p=a.value.trim(),b=l.value,f=e.querySelector("#ms-suburb"),w=f.value,$=((k=f.options[f.selectedIndex])==null?void 0:k.text)||"",N=e.querySelector("#ms-confirm-location").checked,j=e.querySelector("#ms-confirm-creative").checked;if(!o||!u){t(n,"Please enter your first and last name");return}if(!p||!h(p)){t(n,"Please enter a valid email address"),a.classList.add("error");return}if(!w){t(n,"Please select your suburb");return}if(!b||!y(b)){t(n,"Password must be at least 8 characters"),l.classList.add("error");return}if(!N){t(n,"Please confirm that you live or work within the Blue Mountains");return}if(!j){t(n,"Please confirm that you work in the creative industries");return}i.disabled=!0,i.textContent="Creating account...";try{const m=["small-business","large-business","not-for-profit","spaces-suppliers"].includes(r)?"":E(o,u),P=c[r],A=s==="yearly"?P.yearlyPriceId:P.monthlyPriceId,g=await window.$memberstackDom.signupMemberEmailPassword({email:p,password:b,customFields:{"first-name":o,"last-name":u,slug:m,suburb:$,"suburb-id":w,"membership-type":r,"billing-frequency":s,"onboarding-complete":"false"}});if(console.log("Signup result:",g),g.data&&g.data.member)i.textContent="Redirecting to checkout...",await window.$memberstackDom.purchasePlansWithCheckout({priceId:A,successUrl:window.location.origin+"/member/onboarding"});else throw new Error("Signup failed - no member data returned")}catch(d){console.error("Signup error:",d),i.disabled=!1,i.textContent="Create Account & Continue to Payment";let m="An error occurred. Please try again.";d.message&&(d.message.includes("already exists")||d.message.includes("already registered")?m="An account with this email already exists. Please log in instead.":d.message.includes("password")?m="Password does not meet requirements. Please use at least 8 characters.":m=d.message),t(n,m)}})}function t(e,r){e.textContent=r,e.style.display="block",e.scrollIntoView({behavior:"smooth",block:"center"})}function x(e,r){e.innerHTML=`
      <div class="ms-container">
        <div class="ms-form">
          <div class="ms-error-banner" style="display: block;">
            ${r}
          </div>
          <p style="text-align: center; margin-top: 20px;">
            <a href="/join/type" style="color: #333; font-weight: 600;">Choose a membership type</a>
          </p>
        </div>
      </div>
    `}async function v(){const e=document.querySelector(".multi-signup-form");if(!e){console.warn("Could not find .multi-signup-form container");return}const r=document.createElement("style");r.textContent=S,document.head.appendChild(r),e.innerHTML='<div class="ms-loading">Loading...</div>';const{type:s,billing:i}=q();if(!s){x(e,"No membership type specified. Please select a membership type first.");return}try{await C();const{data:a}=await window.$memberstackDom.getCurrentMember();if(a){window.location.href="/member/dashboard";return}z(e,s,i)}catch(a){console.error("Error initializing signup form:",a),x(e,"Error loading signup form. Please refresh the page.")}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",v):v()})();
