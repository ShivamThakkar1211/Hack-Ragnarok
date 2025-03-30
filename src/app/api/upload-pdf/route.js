import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/helpers/dbConnect';
import User from '@/models/User';
import {authOptions} from "@/app/api/auth/[...nextauth]/options"

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('pdf');

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, message: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Read file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Find user by email (Google auth uses email)
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User account not found' },
        { status: 404 }
      );
    }

    // Update user with PDF data
    user.pdf = {
      filename: file.name,
      contentType: file.type,
      data: buffer,
      size: file.size,
      uploadedAt: new Date(),
    };

    await user.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'PDF uploaded successfully',
        filename: file.name,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to upload PDF',
        error: error.message 
      },
      { status: 500 }
    );
  }
}