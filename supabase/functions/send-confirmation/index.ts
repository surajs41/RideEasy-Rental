
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: ConfirmationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "RideEasy <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to RideEasy!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6; text-align: center; padding: 20px 0;">Welcome to RideEasy!</h1>
          <div style="padding: 20px; border-radius: 8px; background-color: #f8fafc;">
            <p style="font-size: 16px; line-height: 1.5;">Hello ${name},</p>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for registering an account with RideEasy, your go-to platform for bike rentals.</p>
            <p style="font-size: 16px; line-height: 1.5;">Your account has been created successfully and you can now log in to explore available bikes and make bookings.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://your-rideeasy-domain.com/login" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log In Now</a>
            </div>
            <p style="font-size: 16px; line-height: 1.5;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            <p style="font-size: 16px; line-height: 1.5;">Happy riding!</p>
            <p style="font-size: 16px; line-height: 1.5;">Best regards,<br>The RideEasy Team</p>
          </div>
          <div style="text-align: center; margin-top: 20px; padding: 10px; font-size: 12px; color: #64748b;">
            &copy; 2024 RideEasy. All rights reserved.
          </div>
        </div>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
