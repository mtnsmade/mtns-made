// Member Projects Test Script
// Creates a collapsible project card that inserts into .vibe-test

(function() {
  console.log('Member projects test script loaded');

  // Wait for DOM to be ready
  function init() {
    let container = document.querySelector('.vibe-test');
    if (!container) {
      console.log('.vibe-test not found, appending to body');
      container = document.body;
    }

    // Create the project card
    const card = document.createElement('div');
    card.className = 'member-project-card';
    card.innerHTML = `
      <style>
        .member-project-card {
          font-family: inherit;
          max-width: 500px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          background: #fff;
        }
        .member-project-card h2 {
          margin: 0 0 16px 0;
          font-size: 24px;
          color: #333;
        }
        .member-project-card .view-btn {
          background: #333;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }
        .member-project-card .view-btn:hover {
          background: #555;
        }
        .member-project-card .content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }
        .member-project-card .content.open {
          max-height: 500px;
        }
        .member-project-card .row {
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }
        .member-project-card .row:last-child {
          border-bottom: none;
        }
        .member-project-card .row p {
          margin: 0;
          color: #666;
          line-height: 1.5;
        }
      </style>
      <h2>Example Project Title</h2>
      <button class="view-btn">View Project</button>
      <div class="content">
        <div class="row">
          <p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.</p>
        </div>
        <div class="row">
          <p>Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.</p>
        </div>
        <div class="row">
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.</p>
        </div>
      </div>
    `;

    // Add click handler for toggle
    const btn = card.querySelector('.view-btn');
    const content = card.querySelector('.content');

    btn.addEventListener('click', () => {
      const isOpen = content.classList.toggle('open');
      btn.textContent = isOpen ? 'Close Project' : 'View Project';
    });

    // Insert into container
    container.appendChild(card);
    console.log('Member project card inserted into .vibe-test');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
