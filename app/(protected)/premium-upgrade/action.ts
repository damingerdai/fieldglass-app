'use server';

import { Resend } from 'resend';

const resend = new Resend();

const SEGMENT_ID = process.env.RESEND_SEGMENT_ID as string;

export async function subscribeEmail(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, error: 'Email is required' };
  }

  try {
    await resend.contacts.create({
      email: email,
    });

    const { error: segmentError } = await resend.contacts.segments.add({
      email: email,
      segmentId: SEGMENT_ID,
    });

    if (segmentError) {
      console.error('Add to Segment Error:', segmentError);
      return { success: false, error: segmentError.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Server Error:', err);
    return { success: false, error: 'Failed to subscribe' };
  }
}