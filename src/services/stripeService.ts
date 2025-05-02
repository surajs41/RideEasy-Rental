
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../integrations/supabase/client';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51RJpq0H9Jc33ALyLbvLbwlz3XPYOaF10dTvI6KnZqjRxpOgh2OwYFb60BDs0LEKeo9s8LSa0Jx3QGj9sxdiTc7oQ00aMCtIzp0');

export const createPaymentIntent = async (amount: number, bikeId: string, bikeDetails: any) => {
  try {
    // Call your Supabase Edge Function to create a payment intent
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { 
        amount,
        bikeId,
        bikeDetails
      }
    });

    if (error) {
      throw error;
    }

    return data.clientSecret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const sendConfirmationEmail = async (bookingDetails: any) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-confirmation', {
      body: bookingDetails
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

export const generateInvoicePdf = (bookingDetails: any): string => {
  // In a real application, this would generate a PDF
  // For this example, we'll just return a placeholder URL
  return `/invoices/${bookingDetails.bookingId}.pdf`;
};
