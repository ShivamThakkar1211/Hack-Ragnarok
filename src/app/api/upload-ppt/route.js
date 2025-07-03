import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/helpers/dbConnect';
import User from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('ppt');  // Match the frontend key

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/vnd.ms-powerpoint', 
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Only PPT/PPTX files are allowed' },
        { status: 400 }
      );
    }

    // Read and convert file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate MongoDB max size limit
    if (buffer.length > 16 * 1024 * 1024) {  // 16MB limit
      return NextResponse.json(
        { success: false, message: 'File size exceeds 16MB limit' },
        { status: 413 }
      );
    }

    // Find user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User account not found' },
        { status: 404 }
      );
    }

    // Explicitly set the PPT field
    user.ppt = {
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
        message: 'PPT uploaded successfully',
        filename: file.name,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to upload PPT',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
