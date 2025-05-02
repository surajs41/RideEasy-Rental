
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
    
    const { name, email, bikeName, startDate, endDate, totalAmount, paymentId, pickupLocation } = bookingData;

    // Send email using Formspree
    const formspreeResponse = await fetch('https://formspree.io/f/mqaprnqz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        message: `Booking Confirmation for ${bikeName}`,
        bookingDetails: {
          bikeName,
          startDate,
          endDate,
          totalAmount,
          paymentId,
          pickupLocation,
        },
        _subject: `RideEasy Booking Confirmation - ${bikeName}`,
        _template: 'box',
      }),
    });

    if (!formspreeResponse.ok) {
      throw new Error(`Error sending email: ${formspreeResponse.statusText}`);
    }

    const emailResult = await formspreeResponse.json();

    return new Response(JSON.stringify({ success: true, result: emailResult }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
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
