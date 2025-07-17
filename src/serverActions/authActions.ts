'use server';
import { supabaseAdmin } from '@/api/supabaseClient';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';


export async function deleteUserAccount(userId: string) {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error('Error deleting user:', error);
      return { error: error.message };
    }
    console.log(`User ${userId} deleted successfully`);
    (await cookies()).delete('supabase-auth-token');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Server error during delete:', error);
    return { error: 'Internal Server Error' };
  }
}