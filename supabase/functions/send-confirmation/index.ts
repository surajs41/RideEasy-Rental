
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmation {
  name: string;
  email: string;
  bikeName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  paymentId: string;
  pickupLocation: string;
  dropoffLocation: string;
  paymentMethod: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingConfirmation = await req.json();
    
    const { 
      name, 
      email, 
      bikeName, 
      startDate, 
      endDate, 
      totalAmount, 
      paymentId, 
      pickupLocation, 
      dropoffLocation,
      paymentMethod
    } = bookingData;

    const emailResponse = await resend.emails.send({
      from: "RideEasy <onboarding@resend.dev>",
      to: [email],
      subject: "Your Bike Booking Confirmation - RideEasy",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="background: linear-gradient(to right, #0891b2, #2563eb); padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed ✅</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${name},</p>
            <p>Great news! Your bike booking has been confirmed. Here are your booking details:</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #0891b2;">
              <h2 style="color: #0891b2; margin-top: 0;">Booking Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; width: 40%;">Booking ID:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${paymentId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Bike:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${bikeName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Duration:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${startDate} to ${endDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Pickup Location:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${pickupLocation}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Drop-off Location:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${dropoffLocation}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Payment Method:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b;">Total Amount:</td>
                  <td style="padding: 8px 0; font-weight: bold; color: #0891b2; font-size: 18px;">₹${totalAmount.toFixed(2)}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #ecfdf5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #059669; margin-top: 0;">What's Next?</h3>
              <p style="margin-bottom: 5px;">1. Arrive at the pickup location on your start date.</p>
              <p style="margin-bottom: 5px;">2. Present your ID and driver's license.</p>
              <p style="margin-bottom: 0;">3. Enjoy your ride!</p>
            </div>
            
            <p>If you need to modify or cancel your booking, please contact us at least 24 hours before your pickup time.</p>
            
            <p>Thank you for choosing RideEasy!</p>
            <p>Ride safe and have a great adventure!</p>
            <p>Best regards,<br>The RideEasy Team</p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 0 0 5px 5px;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">
              © 2025 RideEasy. All rights reserved.<br>
              <a href="https://rideeasy.example.com/contact" style="color: #0891b2; text-decoration: none;">Contact Support</a> | 
              <a href="https://rideeasy.example.com/terms" style="color: #0891b2; text-decoration: none;">Terms & Conditions</a>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
