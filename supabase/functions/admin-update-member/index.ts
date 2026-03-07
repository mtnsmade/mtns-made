// Admin Update Member Edge Function
// Updates membership type across all systems: Memberstack, Supabase, Webflow
// Handles Stripe subscription changes via Memberstack plan changes

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const MEMBERSTACK_API_KEY = Deno.env.get('MEMBERSTACK_API_KEY') || '';
const WEBFLOW_API_TOKEN = Deno.env.get('WEBFLOW_API_TOKEN') || '';
const SITE_URL = 'https://www.mtnsmade.com.au';

// Memberstack Plan IDs mapped to membership type slugs
const MEMBERSTACK_PLANS: Record<string, string> = {
  'emerging': 'pln_emerging-i59k0l22',
  'professional': 'pln_professional-ic970osr',
  'not-for-profit': 'pln_not-for-profit-qaa106a4',
  'small-business': 'pln_small-business-qsa506lc',
  'large-business': 'pln_medium-large-business-9qa706pj',
  'spaces-suppliers': 'pln_creative-spaces-suppliers-ck5s08g3',
  // Partner has no plan - it's manually assigned
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface UpdateRequest {
  memberId: string;
  newMembershipTypeId: string;
  skipPlanChange?: boolean; // Optional: only update custom field, not billing
}

function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// Get membership type details from Supabase
async function getMembershipType(typeId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('membership_types')
    .select('id, name, slug, webflow_id')
    .eq('id', typeId)
    .single();

  if (error) throw new Error(`Failed to get membership type: ${error.message}`);
  return data;
}

// Get member details from Supabase
async function getMember(memberId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('members')
    .select('*, membership_types(id, name, slug)')
    .eq('id', memberId)
    .single();

  if (error) throw new Error(`Failed to get member: ${error.message}`);
  return data;
}

// Get member's current Memberstack plans
async function getMemberstackMember(memberstackId: string) {
  const response = await fetch(
    `https://admin.memberstack.com/members/${memberstackId}`,
    {
      headers: {
        'X-API-KEY': MEMBERSTACK_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Memberstack member: ${error}`);
  }

  return await response.json();
}

// Update Memberstack custom field
async function updateMemberstackCustomField(memberstackId: string, membershipTypeSlug: string) {
  const response = await fetch(
    `https://admin.memberstack.com/members/${memberstackId}`,
    {
      method: 'PATCH',
      headers: {
        'X-API-KEY': MEMBERSTACK_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customFields: {
          'membership-type': membershipTypeSlug,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update Memberstack custom field: ${error}`);
  }

  return await response.json();
}

// Add a plan to a Memberstack member
async function addMemberstackPlan(memberstackId: string, planId: string) {
  const response = await fetch(
    `https://admin.memberstack.com/members/${memberstackId}/add-plan`,
    {
      method: 'POST',
      headers: {
        'X-API-KEY': MEMBERSTACK_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: planId,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to add Memberstack plan: ${error}`);
  }

  return await response.json();
}

// Remove a plan from a Memberstack member
async function removeMemberstackPlan(memberstackId: string, planId: string) {
  const response = await fetch(
    `https://admin.memberstack.com/members/${memberstackId}/remove-plan`,
    {
      method: 'POST',
      headers: {
        'X-API-KEY': MEMBERSTACK_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: planId,
        cancelType: 'IMMEDIATELY', // Cancel immediately, not at period end
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    // Don't throw if plan not found - member might not have had this plan
    console.warn(`Warning removing plan ${planId}: ${error}`);
    return null;
  }

  return await response.json();
}

// Update Supabase member record
async function updateSupabaseMember(memberId: string, membershipTypeId: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('members')
    .update({
      membership_type_id: membershipTypeId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', memberId);

  if (error) throw new Error(`Failed to update Supabase: ${error.message}`);
}

// Sync member to Webflow
async function syncToWebflow(memberId: string) {
  const supabase = getSupabaseClient();

  // Get full member record
  const { data: member, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', memberId)
    .single();

  if (error || !member) {
    throw new Error(`Failed to get member for Webflow sync: ${error?.message}`);
  }

  if (!member.webflow_id) {
    console.log('Member has no Webflow ID, skipping Webflow sync');
    return;
  }

  // Call sync-to-webflow function
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/sync-to-webflow`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        type: 'UPDATE',
        table: 'members',
        schema: 'public',
        record: member,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.warn(`Webflow sync warning: ${error}`);
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body: UpdateRequest = await req.json();
    const { memberId, newMembershipTypeId, skipPlanChange } = body;

    if (!memberId || !newMembershipTypeId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: memberId, newMembershipTypeId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Updating member ${memberId} to membership type ${newMembershipTypeId}`);

    // Get member and new membership type details
    const [member, newType] = await Promise.all([
      getMember(memberId),
      getMembershipType(newMembershipTypeId),
    ]);

    const oldType = member.membership_types;
    const oldTypeSlug = oldType?.slug || null;
    const newTypeSlug = newType.slug;

    console.log(`Changing from ${oldTypeSlug} to ${newTypeSlug}`);

    const results = {
      memberstackCustomField: false,
      memberstackPlanRemoved: false,
      memberstackPlanAdded: false,
      supabaseUpdated: false,
      webflowSynced: false,
      warnings: [] as string[],
    };

    // 1. Update Memberstack custom field
    if (member.memberstack_id) {
      try {
        await updateMemberstackCustomField(member.memberstack_id, newTypeSlug);
        results.memberstackCustomField = true;
        console.log('Memberstack custom field updated');
      } catch (error) {
        results.warnings.push(`Memberstack custom field: ${error}`);
      }

      // 2. Change Memberstack plan (affects Stripe billing)
      if (!skipPlanChange) {
        const oldPlanId = oldTypeSlug ? MEMBERSTACK_PLANS[oldTypeSlug] : null;
        const newPlanId = MEMBERSTACK_PLANS[newTypeSlug];

        // Remove old plan if exists
        if (oldPlanId) {
          try {
            await removeMemberstackPlan(member.memberstack_id, oldPlanId);
            results.memberstackPlanRemoved = true;
            console.log(`Removed old plan: ${oldPlanId}`);
          } catch (error) {
            results.warnings.push(`Remove old plan: ${error}`);
          }
        }

        // Add new plan if exists
        if (newPlanId) {
          try {
            await addMemberstackPlan(member.memberstack_id, newPlanId);
            results.memberstackPlanAdded = true;
            console.log(`Added new plan: ${newPlanId}`);
          } catch (error) {
            results.warnings.push(`Add new plan: ${error}`);
          }
        } else if (newTypeSlug === 'partner') {
          results.warnings.push('Partner type has no billing plan - member will not be billed');
        }
      } else {
        results.warnings.push('Plan change skipped (skipPlanChange=true)');
      }
    } else {
      results.warnings.push('No Memberstack ID found - skipping Memberstack updates');
    }

    // 3. Update Supabase
    try {
      await updateSupabaseMember(memberId, newMembershipTypeId);
      results.supabaseUpdated = true;
      console.log('Supabase updated');
    } catch (error) {
      throw new Error(`Supabase update failed: ${error}`);
    }

    // 4. Sync to Webflow
    try {
      await syncToWebflow(memberId);
      results.webflowSynced = true;
      console.log('Webflow synced');
    } catch (error) {
      results.warnings.push(`Webflow sync: ${error}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        member: {
          id: memberId,
          name: member.name,
          email: member.email,
        },
        change: {
          from: oldType?.name || 'Not set',
          to: newType.name,
        },
        results,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin update error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
