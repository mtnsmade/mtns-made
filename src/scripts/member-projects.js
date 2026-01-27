// Member Projects Script
// Displays, creates, edits, and deletes member projects using Memberstack JSON data
// Syncs to Webflow CMS via Zapier webhooks

(function() {
  console.log('Member projects script loaded');

  // ============================================
  // ZAPIER WEBHOOK CONFIGURATION
  // Replace these URLs with your Zapier webhook URLs
  // ============================================
  const WEBHOOKS = {
    create: 'YOUR_ZAPIER_CREATE_WEBHOOK_URL',
    update: 'YOUR_ZAPIER_UPDATE_WEBHOOK_URL',
    delete: 'YOUR_ZAPIER_DELETE_WEBHOOK_URL'
  };

  let currentMember = null;
  let projects = [];

  // Styles
  const styles = `
    .mp-container {
      font-family: inherit;
      max-width: 600px;
    }
    .mp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .mp-header h2 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }
    .mp-btn {
      background: #333;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }
    .mp-btn:hover {
      background: #555;
    }
    .mp-btn:disabled {
      background: #999;
      cursor: not-allowed;
    }
    .mp-btn-secondary {
      background: #fff;
      color: #333;
      border: 1px solid #ddd;
    }
    .mp-btn-secondary:hover {
      background: #f5f5f5;
    }
    .mp-btn-danger {
      background: #dc3545;
    }
    .mp-btn-danger:hover {
      background: #c82333;
    }
    .mp-btn-small {
      padding: 6px 12px;
      font-size: 12px;
    }
    .mp-loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    .mp-empty {
      text-align: center;
      padding: 40px;
      background: #f9f9f9;
      border-radius: 8px;
      border: 2px dashed #ddd;
    }
    .mp-empty p {
      margin: 0 0 16px 0;
      color: #666;
    }
    .mp-project-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 12px;
      background: #fff;
      overflow: hidden;
    }
    .mp-project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
    }
    .mp-project-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    .mp-project-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
      border-top: 0 solid #e0e0e0;
    }
    .mp-project-content.open {
      max-height: 800px;
      border-top-width: 1px;
    }
    .mp-project-fields {
      padding: 20px;
    }
    .mp-field {
      margin-bottom: 16px;
    }
    .mp-field:last-child {
      margin-bottom: 0;
    }
    .mp-field-label {
      font-size: 12px;
      font-weight: 600;
      color: #666;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .mp-field-value {
      padding: 8px 12px;
      background: #f5f5f5;
      border-radius: 4px;
      cursor: pointer;
      min-height: 20px;
      color: #333;
      transition: background 0.2s;
    }
    .mp-field-value:hover {
      background: #eee;
    }
    .mp-field-value.empty {
      color: #999;
      font-style: italic;
    }
    .mp-field-input {
      width: 100%;
      padding: 8px 12px;
      border: 2px solid #333;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
    }
    .mp-field-input:focus {
      outline: none;
      border-color: #555;
    }
    textarea.mp-field-input {
      min-height: 80px;
      resize: vertical;
    }
    .mp-project-actions {
      display: flex;
      gap: 10px;
      padding: 0 20px 20px;
      justify-content: flex-end;
    }
    .mp-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    .mp-modal {
      background: #fff;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }
    .mp-modal-header {
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
    }
    .mp-modal-header h3 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }
    .mp-modal-body {
      padding: 20px;
    }
    .mp-modal-footer {
      padding: 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    .mp-form-field {
      margin-bottom: 16px;
    }
    .mp-form-field label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
    }
    .mp-form-field label span {
      color: #dc3545;
    }
    .mp-form-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
    }
    .mp-form-input:focus {
      outline: none;
      border-color: #333;
    }
    textarea.mp-form-input {
      min-height: 80px;
      resize: vertical;
    }
    .mp-sync-status {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    .mp-sync-status.syncing {
      color: #f0ad4e;
    }
    .mp-sync-status.synced {
      color: #5cb85c;
    }
    .mp-sync-status.error {
      color: #dc3545;
    }
  `;

  // Field definitions
  const FIELDS = [
    { key: 'short_description', label: 'Short Description', type: 'text' },
    { key: 'project_description', label: 'Project Description', type: 'textarea' },
    { key: 'key_detail', label: 'Key Detail', type: 'text' },
    { key: 'external_link', label: 'External Link', type: 'url' },
    { key: 'display_order', label: 'Display Order', type: 'number' }
  ];

  // Generate unique ID
  function generateId() {
    return 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Send webhook to Zapier
  async function sendWebhook(action, project) {
    const webhookUrl = WEBHOOKS[action];

    if (!webhookUrl || webhookUrl.includes('YOUR_ZAPIER')) {
      console.warn(`Webhook not configured for action: ${action}`);
      return { success: false, error: 'Webhook not configured' };
    }

    // Get member's Webflow ID from custom fields
    const memberWebflowId = currentMember.customFields?.['webflow-member-id'] || '';

    const payload = {
      action: action,
      project_id: project.id,
      webflow_item_id: project.webflow_item_id || '',
      member_webflow_id: memberWebflowId,
      memberstack_id: currentMember.id,
      // Project fields mapped to Webflow field names
      name: project.project_name,
      'project-short-description': project.short_description || '',
      'project-description-editable': project.project_description || '',
      'key-detail': project.key_detail || '',
      'project-external-link': project.external_link || '',
      'display-order': project.display_order || 0,
      'portfolio-item-id': project.id,
      'memberstack-id': currentMember.id
    };

    console.log(`Sending ${action} webhook:`, payload);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        mode: 'no-cors' // Zapier webhooks don't return CORS headers
      });

      console.log(`Webhook ${action} sent successfully`);
      return { success: true };
    } catch (error) {
      console.error(`Webhook ${action} failed:`, error);
      return { success: false, error: error.message };
    }
  }

  // Initialize
  async function init() {
    const container = document.querySelector('.vibe-test');
    if (!container) {
      console.warn('Could not find .vibe-test container');
      return;
    }

    // Add styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Create main container
    const wrapper = document.createElement('div');
    wrapper.className = 'mp-container';
    wrapper.innerHTML = '<div class="mp-loading">Loading projects...</div>';
    container.appendChild(wrapper);

    try {
      // Wait for Memberstack to be available
      await waitForMemberstack();

      // Get current member
      const { data: member } = await window.$memberstackDom.getCurrentMember();
      if (!member) {
        wrapper.innerHTML = '<div class="mp-loading">Please log in to view your projects.</div>';
        return;
      }
      currentMember = member;
      console.log('Current member:', currentMember.id);
      console.log('Member Webflow ID:', currentMember.customFields?.['webflow-member-id']);

      // Load projects from member JSON
      await loadProjects();

      // Render projects
      renderProjects(wrapper);
    } catch (error) {
      console.error('Error initializing member projects:', error);
      wrapper.innerHTML = '<div class="mp-loading">Error loading projects. Please refresh the page.</div>';
    }
  }

  // Wait for Memberstack to be ready
  function waitForMemberstack() {
    return new Promise((resolve) => {
      if (window.$memberstackDom) {
        resolve();
      } else {
        const check = setInterval(() => {
          if (window.$memberstackDom) {
            clearInterval(check);
            resolve();
          }
        }, 100);
      }
    });
  }

  // Load projects from member JSON
  async function loadProjects() {
    try {
      const { data } = await window.$memberstackDom.getMemberJSON();
      projects = (data && data.projects) || [];
      // Sort by display_order
      projects.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      console.log('Loaded projects:', projects.length);
    } catch (error) {
      console.error('Error loading projects:', error);
      projects = [];
    }
  }

  // Save projects to member JSON
  async function saveProjects() {
    try {
      // Get existing JSON first to preserve other data
      const { data: existingData } = await window.$memberstackDom.getMemberJSON();
      const mergedData = { ...existingData, projects: projects };

      const result = await window.$memberstackDom.updateMemberJSON({
        json: mergedData
      });
      console.log('Projects saved:', result);
    } catch (error) {
      console.error('Error saving projects:', error);
      throw error;
    }
  }

  // Render projects list
  function renderProjects(wrapper) {
    if (projects.length === 0) {
      wrapper.innerHTML = `
        <div class="mp-empty">
          <p>You don't have any projects yet</p>
          <button class="mp-btn" id="mp-add-first">Add Your First Project</button>
        </div>
      `;
      wrapper.querySelector('#mp-add-first').addEventListener('click', () => openAddModal(wrapper));
      return;
    }

    let html = `
      <div class="mp-header">
        <h2>My Projects</h2>
        <button class="mp-btn" id="mp-add-project">Add Another Project</button>
      </div>
      <div class="mp-projects-list">
    `;

    projects.forEach((project, index) => {
      html += renderProjectCard(project, index);
    });

    html += '</div>';
    wrapper.innerHTML = html;

    // Add event listeners
    wrapper.querySelector('#mp-add-project').addEventListener('click', () => openAddModal(wrapper));

    // Project card listeners
    wrapper.querySelectorAll('.mp-project-card').forEach((card, index) => {
      const project = projects[index];
      setupProjectCard(card, project, wrapper);
    });
  }

  // Render a single project card
  function renderProjectCard(project, index) {
    let fieldsHtml = '';
    FIELDS.forEach(field => {
      const value = project[field.key] || '';
      fieldsHtml += `
        <div class="mp-field" data-field="${field.key}">
          <div class="mp-field-label">${field.label}</div>
          <div class="mp-field-value ${!value ? 'empty' : ''}" data-type="${field.type}">
            ${value || 'Click to add...'}
          </div>
        </div>
      `;
    });

    return `
      <div class="mp-project-card" data-project-id="${project.id}">
        <div class="mp-project-header">
          <h3 class="mp-project-title">${project.project_name || 'Untitled Project'}</h3>
          <button class="mp-btn mp-btn-secondary mp-btn-small mp-edit-btn">Edit Project</button>
        </div>
        <div class="mp-project-content">
          <div class="mp-project-fields">
            ${fieldsHtml}
          </div>
          <div class="mp-project-actions">
            <button class="mp-btn mp-btn-danger mp-btn-small mp-delete-btn">Delete Project</button>
          </div>
        </div>
      </div>
    `;
  }

  // Setup event listeners for a project card
  function setupProjectCard(card, project, wrapper) {
    const content = card.querySelector('.mp-project-content');
    const editBtn = card.querySelector('.mp-edit-btn');
    const deleteBtn = card.querySelector('.mp-delete-btn');

    // Toggle expand/collapse
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = content.classList.toggle('open');
      editBtn.textContent = isOpen ? 'Close' : 'Edit Project';
    });

    // Inline editing for each field
    card.querySelectorAll('.mp-field-value').forEach(fieldValue => {
      fieldValue.addEventListener('click', () => {
        startFieldEdit(fieldValue, project, wrapper);
      });
    });

    // Delete
    deleteBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this project?')) {
        deleteBtn.disabled = true;
        deleteBtn.textContent = 'Deleting...';

        try {
          // Send delete webhook to Zapier first
          await sendWebhook('delete', project);

          // Then remove from local data
          projects = projects.filter(p => p.id !== project.id);
          await saveProjects();
          renderProjects(wrapper);
        } catch (error) {
          console.error('Error deleting project:', error);
          alert('Error deleting project. Please try again.');
          deleteBtn.disabled = false;
          deleteBtn.textContent = 'Delete Project';
        }
      }
    });
  }

  // Start inline field editing
  function startFieldEdit(fieldValue, project, wrapper) {
    const field = fieldValue.closest('.mp-field');
    const fieldKey = field.dataset.field;
    const fieldDef = FIELDS.find(f => f.key === fieldKey);
    const currentValue = project[fieldKey] || '';

    // Create input
    const isTextarea = fieldDef.type === 'textarea';
    const input = document.createElement(isTextarea ? 'textarea' : 'input');
    input.className = 'mp-field-input';
    input.value = currentValue;
    if (!isTextarea) {
      input.type = fieldDef.type === 'number' ? 'number' : 'text';
    }

    fieldValue.replaceWith(input);
    input.focus();

    // Save on blur
    const saveField = async () => {
      const newValue = input.value;
      const oldValue = project[fieldKey];
      project[fieldKey] = fieldDef.type === 'number' ? (parseInt(newValue) || 0) : newValue;

      // Restore display first
      const newFieldValue = document.createElement('div');
      newFieldValue.className = 'mp-field-value ' + (!newValue ? 'empty' : '');
      newFieldValue.dataset.type = fieldDef.type;
      newFieldValue.textContent = newValue || 'Click to add...';
      input.replaceWith(newFieldValue);

      // Re-attach click listener
      newFieldValue.addEventListener('click', () => {
        startFieldEdit(newFieldValue, project, wrapper);
      });

      // Only save if value changed
      if (newValue !== oldValue) {
        try {
          await saveProjects();
          // Send update webhook to Zapier
          await sendWebhook('update', project);
        } catch (error) {
          console.error('Error updating field:', error);
        }
      }
    };

    input.addEventListener('blur', saveField);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !isTextarea) {
        input.blur();
      }
      if (e.key === 'Escape') {
        input.value = currentValue;
        input.blur();
      }
    });
  }

  // Open add project modal
  function openAddModal(wrapper) {
    const modal = document.createElement('div');
    modal.className = 'mp-modal-overlay';
    modal.innerHTML = `
      <div class="mp-modal">
        <div class="mp-modal-header">
          <h3>Add New Project</h3>
        </div>
        <div class="mp-modal-body">
          <div class="mp-form-field">
            <label>Project Name <span>*</span></label>
            <input type="text" class="mp-form-input" id="mp-form-project_name" required>
          </div>
          <div class="mp-form-field">
            <label>Short Description</label>
            <input type="text" class="mp-form-input" id="mp-form-short_description">
          </div>
          <div class="mp-form-field">
            <label>Project Description</label>
            <textarea class="mp-form-input" id="mp-form-project_description"></textarea>
          </div>
          <div class="mp-form-field">
            <label>Key Detail</label>
            <input type="text" class="mp-form-input" id="mp-form-key_detail">
          </div>
          <div class="mp-form-field">
            <label>External Link</label>
            <input type="url" class="mp-form-input" id="mp-form-external_link" placeholder="https://">
          </div>
          <div class="mp-form-field">
            <label>Display Order</label>
            <input type="number" class="mp-form-input" id="mp-form-display_order" value="0">
          </div>
        </div>
        <div class="mp-modal-footer">
          <button class="mp-btn mp-btn-secondary" id="mp-modal-cancel">Cancel</button>
          <button class="mp-btn" id="mp-modal-save">Create Project</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Cancel button
    modal.querySelector('#mp-modal-cancel').addEventListener('click', () => {
      modal.remove();
    });

    // Save button
    const saveBtn = modal.querySelector('#mp-modal-save');
    saveBtn.addEventListener('click', async () => {
      const projectName = modal.querySelector('#mp-form-project_name').value.trim();

      if (!projectName) {
        alert('Project name is required');
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Creating...';

      const newProject = {
        id: generateId(),
        project_name: projectName,
        short_description: modal.querySelector('#mp-form-short_description').value,
        project_description: modal.querySelector('#mp-form-project_description').value,
        key_detail: modal.querySelector('#mp-form-key_detail').value,
        external_link: modal.querySelector('#mp-form-external_link').value,
        display_order: parseInt(modal.querySelector('#mp-form-display_order').value) || 0,
        created_at: new Date().toISOString()
      };

      try {
        projects.push(newProject);
        projects.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        await saveProjects();

        // Send create webhook to Zapier
        await sendWebhook('create', newProject);

        modal.remove();
        renderProjects(wrapper);
      } catch (error) {
        console.error('Error creating project:', error);
        projects.pop(); // Remove the project we just added
        alert('Error creating project. Please try again.');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Create Project';
      }
    });

    // Focus first field
    modal.querySelector('#mp-form-project_name').focus();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
