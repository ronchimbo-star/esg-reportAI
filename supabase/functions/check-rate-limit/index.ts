import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get IP address from request
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0].trim() || realIp || 'unknown';

    if (req.method === 'POST') {
      // Record a new report generation
      const now = new Date();

      // Check if IP exists in rate limits table
      const { data: existingRecord } = await supabase
        .from('report_rate_limits')
        .select('*')
        .eq('ip_address', ipAddress)
        .maybeSingle();

      if (existingRecord) {
        // Update existing record
        await supabase
          .from('report_rate_limits')
          .update({
            last_report_at: now.toISOString(),
            report_count: existingRecord.report_count + 1,
            updated_at: now.toISOString(),
          })
          .eq('ip_address', ipAddress);
      } else {
        // Create new record
        await supabase
          .from('report_rate_limits')
          .insert({
            ip_address: ipAddress,
            last_report_at: now.toISOString(),
            report_count: 1,
          });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Rate limit recorded',
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // GET request - check if IP is whitelisted first
    const { data: whitelistedIP } = await supabase
      .from('whitelisted_ips')
      .select('*')
      .eq('ip_address', ipAddress)
      .eq('is_active', true)
      .maybeSingle();

    if (whitelistedIP) {
      return new Response(
        JSON.stringify({
          allowed: true,
          message: 'IP address is whitelisted - rate limits bypassed',
          ipAddress,
          whitelisted: true,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Check if IP is banned
    const { data: bannedIP } = await supabase
      .from('banned_ips')
      .select('*')
      .eq('ip_address', ipAddress)
      .eq('is_active', true)
      .maybeSingle();

    if (bannedIP) {
      return new Response(
        JSON.stringify({
          allowed: false,
          message: 'This IP address has been blocked. Reason: ' + bannedIP.reason,
          ipAddress,
          banned: true,
        }),
        {
          status: 403,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Check rate limiting
    const { data: rateLimitRecord } = await supabase
      .from('report_rate_limits')
      .select('*')
      .eq('ip_address', ipAddress)
      .maybeSingle();

    if (!rateLimitRecord) {
      // No previous reports from this IP
      return new Response(
        JSON.stringify({
          allowed: true,
          message: 'No rate limit',
          ipAddress,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Check if last report was within the last hour
    const lastReportTime = new Date(rateLimitRecord.last_report_at);
    const currentTime = new Date();
    const hoursSinceLastReport = (currentTime.getTime() - lastReportTime.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastReport < 1) {
      // Rate limited
      const minutesRemaining = Math.ceil((1 - hoursSinceLastReport) * 60);
      const hoursRemaining = Math.floor(minutesRemaining / 60);
      const minsRemaining = minutesRemaining % 60;

      let timeMessage = '';
      if (hoursRemaining > 0) {
        timeMessage = `${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''} and ${minsRemaining} minute${minsRemaining !== 1 ? 's' : ''}`;
      } else {
        timeMessage = `${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}`;
      }

      return new Response(
        JSON.stringify({
          allowed: false,
          message: `You've reached your report generation limit. Please wait ${timeMessage} before creating another report.`,
          detailedMessage: 'To prevent system abuse, we limit report generation to once per hour per IP address. This helps us keep the service free and available for everyone.',
          minutesRemaining,
          lastReportAt: rateLimitRecord.last_report_at,
          ipAddress,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Allowed - more than 1 hour since last report
    return new Response(
      JSON.stringify({
        allowed: true,
        message: 'Rate limit check passed',
        lastReportAt: rateLimitRecord.last_report_at,
        ipAddress,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});