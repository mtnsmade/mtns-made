/**
 * MTNS MADE - Contact Member Form Handler
 * Intercepts the Webflow contact form and submits to Supabase Edge Function
 *
 * Usage: Add to member profile pages
 * Expects a form with class "contact-member-form" or id "contact-member-form"
 * Hidden fields needed:
 *   - memberstack-id: The member's Memberstack ID
 *   - member-name: The member's display name
 */

(function() {
  'use strict';

  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';

  // Wait for DOM ready
  function init() {
    // Find the contact form
    const form = document.querySelector('.contact-member-form') ||
                 document.getElementById('contact-member-form') ||
                 document.querySelector('[data-form="contact-member"]');

    if (!form) {
      console.log('Contact member form not found on this page');
      return;
    }

    console.log('Contact member form found, attaching handler');

    // Get member info from hidden fields or data attributes
    const memberstackId = form.querySelector('[name="memberstack-id"]')?.value ||
                          form.querySelector('[name="memberstack"]')?.value ||
                          form.dataset.memberstackId ||
                          document.querySelector('[data-memberstack-id]')?.dataset.memberstackId;

    const memberName = form.querySelector('[name="member-name"]')?.value ||
                       form.querySelector('[name="first-name"]')?.value ||
                       form.dataset.memberName ||
                       document.querySelector('[data-member-name]')?.dataset.memberName ||
                       document.querySelector('.member-name')?.textContent?.trim();

    if (!memberstackId) {
      console.error('Memberstack ID not found for contact form');
      return;
    }

    // Store for form submission
    form.dataset.memberstackId = memberstackId;
    form.dataset.memberName = memberName || 'Member';

    // Prevent default Webflow form submission
    form.addEventListener('submit', handleSubmit);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.target;
    const submitBtn = form.querySelector('[type="submit"]') || form.querySelector('input[type="submit"]');
    const originalBtnText = submitBtn?.value || submitBtn?.textContent;

    // Get form fields (support various Webflow naming conventions)
    const senderName = form.querySelector('[name="name"], [name="Name"], [name="sender-name"], [name="Your-Name"]')?.value?.trim();
    const senderEmail = form.querySelector('[name="email"], [name="Email"], [name="your-email"], [name="Your-Email"]')?.value?.trim();
    const senderPhone = form.querySelector('[name="phone"], [name="Phone"], [name="contact-number"], [name="Contact-Number"]')?.value?.trim();
    const subject = form.querySelector('[name="subject"], [name="Subject"], [name="subject-of-enquiry"], [name="Subject-Of-Enquiry"], [name="Subject-of-Enquiry"]')?.value?.trim();
    const message = form.querySelector('[name="message"], [name="Message"], [name="your-message"], [name="Your-Message"]')?.value?.trim();

    // Validate
    if (!senderName || !senderEmail || !subject || !message) {
      showFormMessage(form, 'Please fill in all required fields.', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      showFormMessage(form, 'Please enter a valid email address.', 'error');
      return;
    }

    // Show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      if (submitBtn.tagName === 'INPUT') {
        submitBtn.value = 'Sending...';
      } else {
        submitBtn.textContent = 'Sending...';
      }
    }

    try {
      const response = await fetch(SUPABASE_URL + '/functions/v1/contact-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderName,
          senderEmail,
          senderPhone: senderPhone || null,
          subject,
          message,
          memberstackId: form.dataset.memberstackId,
          memberName: form.dataset.memberName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message
        showFormMessage(form, 'Your message has been sent! The member will receive a notification and can reply through their dashboard.', 'success');
        form.reset();

        // Hide form fields, show success state
        const formFields = form.querySelector('.form-fields') || form;
        const successDiv = form.querySelector('.w-form-done');
        if (successDiv) {
          formFields.style.display = 'none';
          successDiv.style.display = 'block';
        }
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showFormMessage(form, 'Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      // Reset button
      if (submitBtn) {
        submitBtn.disabled = false;
        if (submitBtn.tagName === 'INPUT') {
          submitBtn.value = originalBtnText;
        } else {
          submitBtn.textContent = originalBtnText;
        }
      }
    }
  }

  function showFormMessage(form, message, type) {
    // Try to use Webflow's built-in success/error divs
    const successDiv = form.querySelector('.w-form-done');
    const errorDiv = form.querySelector('.w-form-fail');

    if (type === 'success' && successDiv) {
      successDiv.style.display = 'block';
      successDiv.textContent = message;
      if (errorDiv) errorDiv.style.display = 'none';
    } else if (type === 'error' && errorDiv) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = message;
      if (successDiv) successDiv.style.display = 'none';
    } else {
      // Fallback: create/update a message div
      let msgDiv = form.querySelector('.form-message');
      if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.className = 'form-message';
        form.insertBefore(msgDiv, form.firstChild);
      }

      msgDiv.textContent = message;
      msgDiv.style.cssText = type === 'success'
        ? 'padding: 12px; background: #d4edda; color: #155724; border-radius: 4px; margin-bottom: 16px;'
        : 'padding: 12px; background: #f8d7da; color: #721c24; border-radius: 4px; margin-bottom: 16px;';
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
