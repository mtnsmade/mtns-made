# Memberstack data-ms-* attribute reference

Sourced from memberstack.com/data-attributes (2026-08-07). Full reference — for the
handful actually used on this site, see the main SKILL.md instead.

## Authentication & Login
- `data-ms-form:login` — custom login form
- `data-ms-modal:login` — default Memberstack login modal
- `data-ms-action:login-redirect` — links from public pages to logged-in areas
- `data-ms-action:logout` — ends session, triggers logout redirect
- `data-ms-form:passwordless-login` / `data-ms-form:passwordless-signup` — passwordless flows
- `data-ms-passwordless:step-2` — shown only after valid email submission
- `data-ms-passwordless-button:[Your_Text]` — button text after valid email submitted

## Signup & Registration
- `data-ms-form:signup` — custom sign-up form
- `data-ms-modal:signup` — pre-built signup modal
- `data-ms-signup:hcaptcha:[light|dark]` — captcha on signup forms

## Password Management
- `data-ms-form:forgot-password` / `data-ms-modal:forgot-password`
- `data-ms-form:reset-password`
- `data-ms-member:token` — 6-digit password reset code placeholder
- `data-ms-member:current-password` / `data-ms-member:new-password`

## Plans & Pricing
- `data-ms-plan:add:[Plan_Id]` — add a free plan before/after signup
- `data-ms-plan:remove:[Plan_Id]` — remove a free plan after signup
- `data-ms-price:add:[Price_Id]` — join/add a paid plan alongside existing ones
- `data-ms-price:update:[Price_Id]` — join or switch between paid plans (this is
  what the join/type page's buttons use — see SKILL.md for the gotcha)
- `data-ms-price:removeall` — remove any previously selected paid plans pre-signup
- `data-ms-coupon:[Coupon_ID]` — apply a coupon to a specific pricing button

## Gated Content & Visibility
- `data-ms-content:members` / `data-ms-content:!members` — logged in / logged out
- `data-ms-content:[Content_Id]` — visible to members with access to gated content
- `data-ms-content:is-trialing` / `data-ms-content:!is-trialing`
- `data-ms-content:has-password`
- `data-ms-content:has-failed-payment` — see SKILL.md, relevant to the payment SOP
- `data-ms-content:!verified` — shown if member not email-verified

## Member Data Display
- `data-ms-member:email` / `data-ms-member:id` / `data-ms-member:signup-date`
- `data-ms-member:profile-image`
- `data-ms-member:[Field_Id]` — populate form fields or personalize text from custom fields

## Profile & Account Management
- `data-ms-form:profile` — custom onboarding/profile update form
- `data-ms-form:email` / `data-ms-form:password` — update forms
- `data-ms-modal:profile` — default profile modal
- `data-ms-action:profile-image` — browser upload, updates profile image
- `data-ms-action:resend-verification-email`

## Form Inputs & Validation
- `data-ms-member:[Field_Id]` on checkboxes — records true/false choice
- `data-ms-value:[Value]` — value of a checkbox within a group
- `data-ms-bind:class:[className]` — adds CSS classes to elements

## Styling
- `data-ms-bind:style:[cssProperty:value]`

## Social Authentication
- `data-ms-auth-provider:[Auth_ID]` — login/signup with a social provider
- `data-ms-auth-connected-text:[text]` — button text once connected
- `data-ms-auth-manage-providers` — container for social auth buttons (profile page)
- `data-ms-auth-disconnect:true`

## Billing & Payments
- `data-ms-action:customer-portal` — launches Stripe Customer Portal (see SKILL.md)

## Toast Messages & Notifications
- `data-ms-message:success` / `data-ms-message:error`
- `data-ms-message-text:true` — dynamic explanatory text
- `data-ms-message-close:true` — click to dismiss

## Secure Content Hosting
- `data-ms-secure-html:[Content_ID]`
- `data-ms-secure-link:[Content_ID]`
