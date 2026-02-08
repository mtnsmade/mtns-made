// Profile Checklist - Supabase Version
// Displays profile completion status by reading from Supabase
// Shows which fields are complete/incomplete with links to fix

(function() {
  console.log('Profile checklist Supabase script loaded');

  const SUPABASE_URL = 'https://epszwomtxkpjegbjbixr.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_567NLTP3qU8_ONMFs44eow_WoNrIlCH';

  let supabase = null;

  const styles = `
    .pc-container {
      font-family: inherit;
    }
    .pc-loading {
      padding: 20px;
      text-align: center;
      color: #666;
    }
    .pc-complete-banner {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .pc-complete-icon {
      font-size: 24px;
    }
    .pc-complete-text {
      font-size: 16px;
      font-weight: 500;
    }
    .pc-items {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .pc-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
    }
    .pc-item.complete {
      background: #d4edda;
      color: #155724;
    }
    .pc-item.incomplete {
      background: #f8d7da;
      color: #721c24;
    }
    .pc-item-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }
    .pc-item.complete .pc-item-icon {
      background: #28a745;
      color: #fff;
    }
    .pc-item.incomplete .pc-item-icon {
      background: #dc3545;
      color: #fff;
    }
    .pc-item-text {
      flex: 1;
    }
    .pc-item-link {
      color: inherit;
      text-decoration: underline;
      font-weight: 600;
    }
    .pc-item-link:hover {
      opacity: 0.8;
    }
    .pc-progress {
      margin-bottom: 20px;
    }
    .pc-progress-bar {
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }
    .pc-progress-fill {
      height: 100%;
      background: #28a745;
      transition: width 0.3s ease;
    }
    .pc-progress-text {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }
  `;

  function waitForDependencies() {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;
      const check = setInterval(() => {
        attempts++;
        if (window.$memberstackDom && window.supabase) {
          clearInterval(check);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(check);
          reject(new Error('Dependencies not loaded'));
        }
      }, 100);
    });
  }

  async function getMemberProfile(memberstackId) {
    try {
      // Get member with category counts
      const { data: member, error } = await supabase
        .from('members')
        .select(`
          id,
          profile_image_url,
          header_image_url,
          bio,
          profile_complete,
          suburb_id
        `)
        .eq('memberstack_id', memberstackId)
        .single();

      if (error) throw error;
      if (!member) return null;

      // Check if member has categories
      const { count: categoryCount } = await supabase
        .from('member_sub_directories')
        .select('*', { count: 'exact', head: true })
        .eq('member_id', member.id);

      // Check project count
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('memberstack_id', memberstackId)
        .eq('is_deleted', false);

      return {
        ...member,
        hasCategories: categoryCount > 0,
        projectCount: projectCount || 0
      };
    } catch (error) {
      console.error('Error loading member profile:', error);
      return null;
    }
  }

  function renderChecklist(container, profile) {
    if (!profile) {
      container.innerHTML = '<div class="pc-loading">Unable to load profile data.</div>';
      return;
    }

    const checks = [
      {
        name: 'Profile Picture',
        complete: !!profile.profile_image_url,
        link: '/profile/edit-profile',
        completeText: 'Profile picture added',
        incompleteText: 'No profile picture'
      },
      {
        name: 'Feature Image',
        complete: !!profile.header_image_url,
        link: '/profile/edit-profile',
        completeText: 'Feature image added',
        incompleteText: 'No feature image'
      },
      {
        name: 'Bio',
        complete: profile.bio && profile.bio.length >= 50,
        link: '/profile/edit-profile',
        completeText: 'Bio added',
        incompleteText: 'No bio added'
      },
      {
        name: 'Categories',
        complete: profile.hasCategories,
        link: '/profile/edit-profile',
        completeText: 'Categories selected',
        incompleteText: 'No categories selected'
      },
      {
        name: 'Location',
        complete: !!profile.suburb_id,
        link: '/profile/edit-profile',
        completeText: 'Location set',
        incompleteText: 'No location set'
      },
      {
        name: 'Projects',
        complete: profile.projectCount > 0,
        link: '/profile/edit-portfolio',
        completeText: `${profile.projectCount} project${profile.projectCount !== 1 ? 's' : ''} added`,
        incompleteText: 'No projects added'
      }
    ];

    const completedCount = checks.filter(c => c.complete).length;
    const totalCount = checks.length;
    const allComplete = completedCount === totalCount;
    const percentage = Math.round((completedCount / totalCount) * 100);

    let html = '<div class="pc-container">';

    if (allComplete) {
      html += `
        <div class="pc-complete-banner">
          <span class="pc-complete-icon">&#10003;</span>
          <span class="pc-complete-text">Your profile is complete! You're all set.</span>
        </div>
      `;
    } else {
      html += `
        <div class="pc-progress">
          <div class="pc-progress-bar">
            <div class="pc-progress-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="pc-progress-text">${completedCount} of ${totalCount} complete (${percentage}%)</div>
        </div>
      `;
    }

    html += '<div class="pc-items">';

    checks.forEach(check => {
      if (check.complete) {
        html += `
          <div class="pc-item complete">
            <span class="pc-item-icon">&#10003;</span>
            <span class="pc-item-text">${check.completeText}</span>
          </div>
        `;
      } else {
        html += `
          <div class="pc-item incomplete">
            <span class="pc-item-icon">&#10007;</span>
            <span class="pc-item-text">${check.incompleteText} - <a href="${check.link}" class="pc-item-link">Add now</a></span>
          </div>
        `;
      }
    });

    html += '</div></div>';

    container.innerHTML = html;
  }

  async function init() {
    const container = document.querySelector('.profile-completeness');
    if (!container) {
      console.log('No checklist container found');
      return;
    }

    // Add styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    container.innerHTML = '<div class="pc-loading">Loading profile...</div>';

    try {
      await waitForDependencies();

      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      const { data: member } = await window.$memberstackDom.getCurrentMember();
      if (!member) {
        container.innerHTML = '<div class="pc-loading">Please log in to view your profile.</div>';
        return;
      }

      const profile = await getMemberProfile(member.id);
      renderChecklist(container, profile);

    } catch (error) {
      console.error('Checklist init error:', error);
      container.innerHTML = '<div class="pc-loading">Error loading profile checklist.</div>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
