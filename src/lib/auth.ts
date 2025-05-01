
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";

// Create a context and provider for authentication
export async function signUp(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  drivingLicenseNumber: string;
  dateOfBirth: string;
}) {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          drivingLicenseNumber: data.drivingLicenseNumber,
          dateOfBirth: data.dateOfBirth,
        }
      }
    });

    if (error) {
      console.error("Error signing up:", error.message);
      throw error;
    }

    return authData;
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign up");
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      throw error;
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign in");
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error signing out:", error.message);
      throw error;
    }
    
    return true;
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign out");
  }
}

export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return null;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getUserProfile() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return null;
    }
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error("Error getting profile:", error.message);
      return null;
    }
    
    return {
      ...profile,
      email: user.email,
    };
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    return null;
  }
}

export async function updateUserProfile(updates: {
  first_name?: string;
  last_name?: string;
  address?: string;
  date_of_birth?: string;
  avatar_url?: string;
}) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating profile:", error.message);
      throw error;
    }
    
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update profile");
  }
}

export async function uploadAvatar(file: File) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;
    
    // Check if storage bucket exists, if not create it
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(bucket => bucket.name === 'avatars')) {
      await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB
      });
    }
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) {
      throw uploadError;
    }
    
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);
    
    const avatarUrl = urlData.publicUrl;
    
    // Update profile with avatar URL
    await updateUserProfile({ avatar_url: avatarUrl });
    
    return avatarUrl;
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    throw new Error(error.message || "Failed to upload avatar");
  }
}
