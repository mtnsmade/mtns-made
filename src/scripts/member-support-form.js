/**
 * MTNS MADE - Member Support Ticket Form
 * Lets a logged-in member submit a support ticket and see their own tickets.
 *
 * Usage: Add to /profile/support
 * Container: #support-form-root
 */

(function() {
  'use strict';

  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc3p3b210eGtwamVnYmpiaXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMTE5MzUsImV4cCI6MjA4NTg4NzkzNX0.TJPI5NQmWHR6F5eGVZH26Mzj601RDp5bgcpYZFVymwQ';

  let currentMember = null;

  const styles = `
    .support-form-section {
      font-family: inherit;
    }
    .support-form input[type="text"],
    .support-form textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
      margin-bottom: 16px;
    }
    .support-form textarea {
      min-height: 140px;
      resize: vertical;
    }
    .support-form label {
      display: block;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
      font-size: 14px;
    }
    .support-form-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      background: #333;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }
    .support-form-btn:hover {
      background: #555;
    }
    .support-form-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .support-form-message {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
    }
    .support-form-message.success {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .support-form-message.error {
      background: #fdecea;
      color: #c0392b;
    }
    .support-tickets-list {
      margin-top: 32px;
    }
    .support-tickets-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    .support-ticket-item {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .support-ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }
    .support-ticket-title {
      font-weight: 600;
      color: #333;
      margin: 0;
    }
    .support-ticket-status {
      font-size: 12px;
      font-weight: 600;
      color: #666;
      white-space: nowrap;
    }
    .support-ticket-date {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
    }
    .support-tickets-empty {
      color: #666;
      font-size: 14px;
    }

    .support-faq {
      margin-top: 32px;
    }
    .support-faq-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
    }
    .support-faq details {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .support-faq summary {
      cursor: pointer;
      list-style: none;
      padding: 14px 44px 14px 16px;
      font-weight: 600;
      font-size: 15px;
      color: #333;
      position: relative;
    }
    .support-faq summary::-webkit-details-marker {
      display: none;
    }
    .support-faq summary::after {
      content: '+';
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      font-weight: 400;
      line-height: 1;
    }
    .support-faq details[open] summary::after {
      content: '\\2212';
    }
    .support-faq-answer {
      padding: 0 16px 16px 16px;
      font-size: 14px;
      line-height: 1.6;
      color: #444;
    }
    .support-faq-answer h2 {
      font-size: 16px;
      margin: 0 0 8px 0;
    }
    .support-faq-answer h3 {
      font-size: 14px;
      margin: 16px 0 4px 0;
    }
    .support-faq-answer p {
      margin: 0 0 8px 0;
    }
    .support-faq-answer ul {
      margin: 0 0 8px 0;
      padding-left: 20px;
    }
  `;

  const STATUS_LABELS = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    feedback_needed: 'Feedback Needed',
    complete: 'Complete',
    stalled: 'Stalled',
  };

  function injectStyles() {
    if (!document.getElementById('support-form-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'support-form-styles';
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async function init() {
    const container = document.getElementById('support-form-root');
    if (!container) {
      console.log('Support form container not found');
      return;
    }

    injectStyles();

    const memberstack = window.$memberstackDom;
    if (!memberstack) {
      container.innerHTML = '<p>Please log in to submit a support ticket.</p>';
      return;
    }

    const { data: member } = await memberstack.getCurrentMember();
    if (!member) {
      container.innerHTML = '<p>Please log in to submit a support ticket.</p>';
      return;
    }

    currentMember = member;
    render(container);
    await loadTickets(container);
    loadFaqs();
  }

  function render(container) {
    container.innerHTML = `
      <div class="support-form-section">
        <div id="support-form-message"></div>
        <form class="support-form" id="support-form">
          <label for="support-title">Subject</label>
          <input type="text" id="support-title" required maxlength="200">
          <label for="support-description">Message</label>
          <textarea id="support-description" required></textarea>
          <button type="submit" class="support-form-btn" id="support-submit-btn">Submit Ticket</button>
        </form>
        <div class="support-tickets-list">
          <div class="support-tickets-title">My Support Tickets</div>
          <div id="support-tickets-container">Loading...</div>
        </div>
        <div id="support-faq-container"></div>
      </div>
    `;

    document.getElementById('support-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      await submitTicket(container);
    });
  }

  async function submitTicket(container) {
    const titleInput = document.getElementById('support-title');
    const descriptionInput = document.getElementById('support-description');
    const submitBtn = document.getElementById('support-submit-btn');
    const messageEl = document.getElementById('support-form-message');

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    if (!title || !description) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    messageEl.innerHTML = '';

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/submit-support-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          mode: 'create',
          memberstackId: currentMember.id,
          memberName: [currentMember.customFields?.['first-name'], currentMember.customFields?.['last-name']].filter(Boolean).join(' ') || currentMember.auth?.email || '',
          memberEmail: currentMember.auth?.email || '',
          title,
          description,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to submit ticket');

      messageEl.innerHTML = '<div class="support-form-message success">Your ticket has been submitted. We\'ll be in touch soon.</div>';
      titleInput.value = '';
      descriptionInput.value = '';
      await loadTickets(container);
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      messageEl.innerHTML = '<div class="support-form-message error">Something went wrong submitting your ticket. Please try again.</div>';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Ticket';
    }
  }

  async function loadTickets(container) {
    const ticketsContainer = document.getElementById('support-tickets-container');
    if (!ticketsContainer) return;

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/submit-support-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          mode: 'list',
          memberstackId: currentMember.id,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to load tickets');

      renderTickets(ticketsContainer, result.tickets || []);
    } catch (error) {
      console.error('Error loading support tickets:', error);
      ticketsContainer.innerHTML = '<p class="support-tickets-empty">Error loading your tickets.</p>';
    }
  }

  // Member FAQs (same source as the dashboard accordion: published "Member FAQ"
  // items from the Webflow FAQ collection via the get-member-faqs edge function).
  // Shown under the form and tickets. A failure here must never affect the form.
  async function loadFaqs() {
    const faqContainer = document.getElementById('support-faq-container');
    if (!faqContainer) return;

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/get-member-faqs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: '{}',
      });
      const result = await response.json();
      if (!result.success || !result.faqs || result.faqs.length === 0) return;

      faqContainer.innerHTML = `
        <div class="support-faq">
          <div class="support-faq-title">Member FAQs</div>
          ${result.faqs.map(faq => `
            <details>
              <summary>${escapeHtml(faq.question)}</summary>
              <div class="support-faq-answer">${faq.answer}</div>
            </details>
          `).join('')}
        </div>
      `;
    } catch (error) {
      console.error('Error loading member FAQs:', error);
    }
  }

  function renderTickets(container, tickets) {
    if (tickets.length === 0) {
      container.innerHTML = '<p class="support-tickets-empty">You haven\'t submitted any support tickets yet.</p>';
      return;
    }

    container.innerHTML = tickets.map(ticket => {
      const date = new Date(ticket.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
      const statusLabel = STATUS_LABELS[ticket.status] || ticket.status;
      return `
        <div class="support-ticket-item">
          <div class="support-ticket-header">
            <p class="support-ticket-title">${escapeHtml(ticket.title)}</p>
            <span class="support-ticket-status">${escapeHtml(statusLabel)}</span>
          </div>
          <div class="support-ticket-date">Submitted ${date}</div>
        </div>
      `;
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
