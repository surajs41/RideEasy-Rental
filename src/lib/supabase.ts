import { createClient } from '@supabase/supabase-js';

// Get the environment variables
const supabaseUrl = 'https://fwaihhjyrvinsgciktic.supabase.co'; // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3YWloaGp5cnZpbnNnY2lrdGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNzAwMjYsImV4cCI6MjA2MTY0NjAyNn0.8bt77Y6BKTR8wAnUQG7NzXnc1rDuJlwE2vaTlsyBk7k'; // Replace with your Supabase anon key

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { supabaseUrl };

// Test the connection
supabase.from('profiles').select('count').then(
  ({ data, error }) => {
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connected successfully');
    }
  }
); 