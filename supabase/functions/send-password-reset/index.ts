import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: PasswordResetRequest = await req.json();

    console.log("Password reset requested for:", email);

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Generate a password reset link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${req.headers.get("origin")}/auth?reset=true`,
      }
    });

    if (error) {
      console.error("Error generating reset link:", error);
      throw error;
    }

    console.log("Reset link generated successfully");

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "SaaSLand <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your SaaSLand password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; font-size: 28px; margin-bottom: 10px;">SaaSLand</h1>
            <h2 style="color: #666; font-size: 24px; font-weight: normal;">Reset Your Password</h2>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #333; font-size: 16px; line-height: 1.5;">
              We received a request to reset your password for your SaaSLand account. Click the button below to reset your password:
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.properties?.action_link}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; text-decoration: none; padding: 15px 30px; 
                      border-radius: 8px; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
              If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
              This link will expire in 24 hours for security reasons.
            </p>
            <p style="color: #666; font-size: 14px; line-height: 1.5;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <span style="word-break: break-all;">${data.properties?.action_link}</span>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 SaaSLand. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      message: "Password reset email sent successfully",
      success: true 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);