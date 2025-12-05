"use server";

import { createClient } from "@/utils/supabase/server";

export async function deleteVacation(vacationId: string) {
    // Implement the logic to delete the vacation with the given ID.
    // This could involve calling your database or an external API.
    console.log(`Deleting vacation with ID: ${vacationId}`);
    // Example: await database.deleteVacation(vacationId);
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
        return {
            errors: "Authentication failed. Please log in again.",
        };
    }
    const { error } = await supabase
        .from('vacations')
        .delete()
        .eq('id', vacationId)
        .eq('user_id', userData.user.id);
    if (error) {
        return {
            errors: error.message,
        };
    }  

    return { success: true };
}