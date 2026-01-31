import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NotificationData {
  type: 'contact' | 'report' | 'pricing' | 'verification' | 'newsletter';
  subject: string;
  data: Record<string, any>;
}

async function sendEmail(to: string, subject: string, html: string, text?: string) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!resendApiKey) {
    console.error("RESEND_API_KEY not configured - please add it to Supabase secrets");
    console.log("To add: supabase secrets set RESEND_API_KEY=your_key_here");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  console.log("Attempting to send email to:", to);
  console.log("Subject:", subject);

  try {
    const emailPayload = {
      from: "ESG Report AI <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
      text: text || undefined,
    };

    console.log("Email payload:", JSON.stringify(emailPayload, null, 2));

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const responseText = await response.text();
    console.log("Resend API response status:", response.status);
    console.log("Resend API response:", responseText);

    if (!response.ok) {
      console.error("Resend API error:", responseText);
      return { success: false, error: `Email service error: ${responseText}` };
    }

    const result = JSON.parse(responseText);
    console.log("Email sent successfully! ID:", result.id);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

function formatNotificationEmail(type: string, data: Record<string, any>): { html: string; text: string } {
  const timestamp = new Date().toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long'
  });

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .field { margin: 15px 0; padding: 10px; background: white; border-radius: 4px; }
    .label { font-weight: bold; color: #059669; }
    .value { margin-top: 5px; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New ${type.charAt(0).toUpperCase() + type.slice(1)} Notification</h2>
      <p>${timestamp}</p>
    </div>
    <div class="content">
`;

  let text = `New ${type.charAt(0).toUpperCase() + type.slice(1)} Notification\n`;
  text += `${timestamp}\n\n`;

  for (const [key, value] of Object.entries(data)) {
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const displayValue = Array.isArray(value) ? value.join(', ') : String(value);

    html += `
      <div class="field">
        <div class="label">${label}:</div>
        <div class="value">${displayValue}</div>
      </div>
    `;
    text += `${label}: ${displayValue}\n`;
  }

  html += `
      <div class="footer">
        <p>This is an automated notification from ESG Report AI</p>
        <p>Sent to: ronchimbo@gmail.com</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  return { html, text };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { type, subject, data }: NotificationData = await req.json();

    if (!type || !subject || !data) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: type, subject, data" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { html, text } = formatNotificationEmail(type, data);
    const emailResult = await sendEmail("ronchimbo@gmail.com", subject, html, text);

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
    }

    return new Response(
      JSON.stringify({
        success: emailResult.success,
        message: emailResult.success
          ? "Admin notification sent successfully"
          : "Notification logged but email failed to send",
        emailSent: emailResult.success,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing notification:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process notification",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
