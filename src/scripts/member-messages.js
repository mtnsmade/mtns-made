/**
 * MTNS MADE - Member Messages Dashboard
 * Displays and manages messages received through the contact form
 *
 * Usage: Add to member dashboard page
 * Container: .messages-container or #messages-container
 */

(function() {
  'use strict';

  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH';

  let supabase;
  let currentMember = null;
  let messages = [];

  // Inject styles
  const styles = `
    .messages-section {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .messages-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .messages-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
    .messages-badge {
      background: #dc3545;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
      margin-left: 8px;
    }
    .messages-empty {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    .messages-empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .message-card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      transition: box-shadow 0.2s;
    }
    .message-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .message-card.unread {
      border-left: 4px solid #333;
    }
    .message-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px;
      cursor: pointer;
    }
    .message-sender {
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
    }
    .message-subject {
      color: #666;
      margin: 0;
      font-size: 14px;
    }
    .message-meta {
      text-align: right;
      flex-shrink: 0;
      margin-left: 16px;
    }
    .message-date {
      font-size: 12px;
      color: #999;
    }
    .message-unread-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #333;
      border-radius: 50%;
      margin-left: 8px;
    }
    .message-body {
      display: none;
      padding: 0 16px 16px;
      border-top: 1px solid #eee;
    }
    .message-body.expanded {
      display: block;
    }
    .message-content {
      background: #f9f9f9;
      padding: 16px;
      border-radius: 8px;
      margin-top: 16px;
      white-space: pre-wrap;
    }
    .message-contact-info {
      margin-top: 16px;
      padding: 12px;
      background: #fff;
      border: 1px solid #eee;
      border-radius: 8px;
      font-size: 14px;
    }
    .message-contact-info p {
      margin: 4px 0;
    }
    .message-contact-info a {
      color: #0066cc;
    }
    .message-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    .message-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
    }
    .message-btn-primary {
      background: #333;
      color: #fff;
    }
    .message-btn-primary:hover {
      background: #555;
    }
    .message-btn-secondary {
      background: #f0f0f0;
      color: #333;
    }
    .message-btn-secondary:hover {
      background: #e0e0e0;
    }
    .reply-form {
      margin-top: 16px;
      display: none;
    }
    .reply-form.visible {
      display: block;
    }
    .reply-textarea {
      width: 100%;
      min-height: 120px;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
      box-sizing: border-box;
    }
    .reply-actions {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }
    .replies-section {
      margin-top: 16px;
      border-top: 1px solid #eee;
      padding-top: 16px;
    }
    .replies-title {
      font-size: 14px;
      font-weight: 600;
      color: #666;
      margin-bottom: 12px;
    }
    .reply-item {
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .reply-item.from-member {
      background: #e8f4f8;
      margin-left: 20px;
    }
    .reply-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
      color: #666;
    }
    .reply-content {
      white-space: pre-wrap;
      font-size: 14px;
    }
    .loading-spinner {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `;

  function injectStyles() {
    if (!document.getElementById('messages-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'messages-styles';
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }
  }

  async function init() {
    const container = document.querySelector('.messages-container') ||
                      document.getElementById('messages-container');

    if (!container) {
      console.log('Messages container not found');
      return;
    }

    injectStyles();

    // Initialize Supabase
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Get current member from Memberstack
    try {
      const memberstack = window.$memberstackDom;
      if (!memberstack) {
        container.innerHTML = '<p>Please log in to view your messages.</p>';
        return;
      }

      const { data: member } = await memberstack.getCurrentMember();
      if (!member) {
        container.innerHTML = '<p>Please log in to view your messages.</p>';
        return;
      }

      currentMember = member;
      console.log('Messages: Member loaded:', member.id);

      // Show loading state
      container.innerHTML = '<div class="loading-spinner">Loading messages...</div>';

      // Load messages
      await loadMessages(container);
    } catch (error) {
      console.error('Messages init error:', error);
      container.innerHTML = '<p>Error loading messages. Please refresh the page.</p>';
    }
  }

  async function loadMessages(container) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('memberstack_id', currentMember.id)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      messages = data || [];
      renderMessages(container);
    } catch (error) {
      console.error('Error loading messages:', error);
      container.innerHTML = '<p>Error loading messages. Please try again.</p>';
    }
  }

  function renderMessages(container) {
    const unreadCount = messages.filter(m => !m.is_read).length;

    let html = `
      <div class="messages-section">
        <div class="messages-header">
          <h2 class="messages-title">
            Messages
            ${unreadCount > 0 ? `<span class="messages-badge">${unreadCount} new</span>` : ''}
          </h2>
        </div>
    `;

    if (messages.length === 0) {
      html += `
        <div class="messages-empty">
          <div class="messages-empty-icon">📬</div>
          <h3>No messages yet</h3>
          <p>When someone contacts you through your MTNS MADE profile, their messages will appear here.</p>
        </div>
      `;
    } else {
      html += '<div class="messages-list">';
      messages.forEach(message => {
        html += renderMessageCard(message);
      });
      html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;

    // Attach event listeners
    attachEventListeners(container);
  }

  function renderMessageCard(message) {
    const date = new Date(message.created_at);
    const dateStr = date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
    const timeStr = date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });

    const replies = message.replies || [];

    return `
      <div class="message-card ${message.is_read ? '' : 'unread'}" data-message-id="${message.id}">
        <div class="message-card-header">
          <div>
            <p class="message-sender">${escapeHtml(message.sender_name)}</p>
            <p class="message-subject">${escapeHtml(message.subject)}</p>
          </div>
          <div class="message-meta">
            <span class="message-date">${dateStr} ${timeStr}</span>
            ${!message.is_read ? '<span class="message-unread-dot"></span>' : ''}
          </div>
        </div>
        <div class="message-body" id="message-body-${message.id}">
          <div class="message-content">${escapeHtml(message.message)}</div>

          <div class="message-contact-info">
            <p><strong>From:</strong> ${escapeHtml(message.sender_name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${escapeHtml(message.sender_email)}">${escapeHtml(message.sender_email)}</a></p>
            ${message.sender_phone ? `<p><strong>Phone:</strong> <a href="tel:${escapeHtml(message.sender_phone)}">${escapeHtml(message.sender_phone)}</a></p>` : ''}
          </div>

          ${replies.length > 0 ? `
            <div class="replies-section">
              <p class="replies-title">Conversation (${replies.length} ${replies.length === 1 ? 'reply' : 'replies'})</p>
              ${replies.map(reply => `
                <div class="reply-item ${reply.from === 'member' ? 'from-member' : ''}">
                  <div class="reply-header">
                    <span>${reply.from === 'member' ? 'You' : message.sender_name}</span>
                    <span>${new Date(reply.created_at).toLocaleString('en-AU')}</span>
                  </div>
                  <div class="reply-content">${escapeHtml(reply.message)}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="message-actions">
            <button class="message-btn message-btn-primary" onclick="toggleReplyForm('${message.id}')">
              Reply
            </button>
            <button class="message-btn message-btn-secondary" onclick="archiveMessage('${message.id}')">
              Archive
            </button>
          </div>

          <div class="reply-form" id="reply-form-${message.id}">
            <textarea class="reply-textarea" id="reply-text-${message.id}" placeholder="Write your reply..."></textarea>
            <div class="reply-actions">
              <button class="message-btn message-btn-primary" onclick="sendReply('${message.id}')">
                Send Reply
              </button>
              <button class="message-btn message-btn-secondary" onclick="toggleReplyForm('${message.id}')">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function attachEventListeners(container) {
    // Click on message header to expand/collapse
    container.querySelectorAll('.message-card-header').forEach(header => {
      header.addEventListener('click', async function() {
        const card = this.closest('.message-card');
        const messageId = card.dataset.messageId;
        const body = document.getElementById('message-body-' + messageId);

        if (body.classList.contains('expanded')) {
          body.classList.remove('expanded');
        } else {
          body.classList.add('expanded');

          // Mark as read if unread
          if (card.classList.contains('unread')) {
            await markAsRead(messageId);
            card.classList.remove('unread');
            card.querySelector('.message-unread-dot')?.remove();
            updateUnreadBadge();
          }
        }
      });
    });
  }

  async function markAsRead(messageId) {
    try {
      await supabase
        .from('messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', messageId);

      // Update local state
      const message = messages.find(m => m.id === messageId);
      if (message) {
        message.is_read = true;
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  function updateUnreadBadge() {
    const unreadCount = messages.filter(m => !m.is_read).length;
    const badge = document.querySelector('.messages-badge');

    if (unreadCount > 0) {
      if (badge) {
        badge.textContent = unreadCount + ' new';
      }
    } else {
      badge?.remove();
    }
  }

  // Global functions for button onclick handlers
  window.toggleReplyForm = function(messageId) {
    const form = document.getElementById('reply-form-' + messageId);
    form.classList.toggle('visible');
    if (form.classList.contains('visible')) {
      document.getElementById('reply-text-' + messageId).focus();
    }
  };

  window.sendReply = async function(messageId) {
    const textarea = document.getElementById('reply-text-' + messageId);
    const replyText = textarea.value.trim();

    if (!replyText) {
      alert('Please enter a reply message.');
      return;
    }

    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    // Add reply to the message
    const newReply = {
      created_at: new Date().toISOString(),
      message: replyText,
      from: 'member'
    };

    const updatedReplies = [...(message.replies || []), newReply];

    try {
      // Update in database
      const { error } = await supabase
        .from('messages')
        .update({ replies: updatedReplies })
        .eq('id', messageId);

      if (error) throw error;

      // Send email notification to sender
      await fetch(SUPABASE_URL + '/functions/v1/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: message.sender_email,
          subject: 'Re: ' + message.subject + ' - Reply from MTNS MADE',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #333; color: #fff; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Reply from MTNS MADE</h1>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <p>Hi ${message.sender_name},</p>
                <p>You've received a reply to your enquiry:</p>
                <div style="background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <p style="white-space: pre-wrap;">${replyText.replace(/\n/g, '<br>')}</p>
                </div>
                <p style="color: #666; font-size: 14px;">You can reply directly to this email to continue the conversation.</p>
              </div>
            </div>
          `,
          replyTo: currentMember.auth?.email
        })
      });

      // Update local state
      message.replies = updatedReplies;

      // Re-render the container
      const container = document.querySelector('.messages-container') ||
                        document.getElementById('messages-container');
      renderMessages(container);

      // Expand the message we just replied to
      const body = document.getElementById('message-body-' + messageId);
      if (body) body.classList.add('expanded');

    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply. Please try again.');
    }
  };

  window.archiveMessage = async function(messageId) {
    if (!confirm('Archive this message? You can find it in your archived messages later.')) {
      return;
    }

    try {
      await supabase
        .from('messages')
        .update({ is_archived: true })
        .eq('id', messageId);

      // Remove from local state
      messages = messages.filter(m => m.id !== messageId);

      // Re-render
      const container = document.querySelector('.messages-container') ||
                        document.getElementById('messages-container');
      renderMessages(container);
    } catch (error) {
      console.error('Error archiving message:', error);
      alert('Error archiving message. Please try again.');
    }
  };

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
