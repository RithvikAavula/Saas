import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterEmailRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Newsletter email function started");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: NewsletterEmailRequest = await req.json();
    console.log("Sending newsletter confirmation to:", email);

    const emailResponse = await resend.emails.send({
      from: "SaaSLand <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to SaaSLand Newsletter!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; text-align: center;">Welcome to SaaSLand!</h1>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>You'll receive the latest updates about our platform, new features, and industry insights directly in your inbox.</p>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151;">What to expect:</h3>
            <ul style="color: #6b7280;">
              <li>Weekly product updates</li>
              <li>Industry insights and trends</li>
              <li>Exclusive offers and early access</li>
              <li>Tips and best practices</li>
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            You can unsubscribe at any time by clicking the unsubscribe link in our emails.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          <p style="text-align: center; color: #9ca3af; font-size: 12px;">
            © 2024 SaaSLand. All rights reserved.
          </p>
        </div>
      `,
    });

    console.log("Newsletter email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in newsletter email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);