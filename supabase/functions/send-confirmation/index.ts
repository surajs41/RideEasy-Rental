
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
  receiptUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingConfirmation = await req.json();
    
    const { name, email, bikeName, startDate, endDate, totalAmount, paymentId, pickupLocation, dropoffLocation } = bookingData;

    const emailResponse = await resend.emails.send({
      from: "RideEasy <onboarding@resend.dev>",
      to: [email],
      subject: "Your Bike Booking Confirmation - RideEasy",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="background-color: #2563EB; padding: 15px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1 style="color: white; margin: 0;">Booking Confirmation</h1>
          </div>
          
          <div style="padding: 20px;">
            <p>Hello ${name},</p>
            <p>Your bike booking has been confirmed! Here are your booking details:</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Bike:</strong> ${bikeName}</p>
              <p><strong>Duration:</strong> ${startDate} to ${endDate}</p>
              <p><strong>Pickup Location:</strong> ${pickupLocation}</p>
              <p><strong>Drop-off Location:</strong> ${dropoffLocation}</p>
              <p><strong>Payment ID:</strong> ${paymentId}</p>
              <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
            </div>
            
            <p>Please keep this email for your records. You can also view your booking details in your RideEasy account.</p>
            
            <div style="background-color: #4ade80; color: white; text-align: center; padding: 10px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold;">Payment Successful</p>
            </div>
            
            <p>If you have any questions or need assistance, please contact our support team.</p>
            
            <p>Thank you for choosing RideEasy!</p>
            <p>Best regards,<br>The RideEasy Team</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 0 0 5px 5px;">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">© 2025 RideEasy. All rights reserved.</p>
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
