// src/app/api/upload/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from 'fs/promises';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' },
        { status: 400 }
      );
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }
    
    // Get file extension
    const filenameParts = file.name.split('.');
    const extension = filenameParts.length > 1 
      ? filenameParts[filenameParts.length - 1] 
      : 'jpg'; // Default to jpg if no extension found
    
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}.${extension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Create uploads directory if it doesn't exist
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.log('Directory already exists or cannot be created');
    }
    
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Convert the file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Write the file to disk
    await writeFile(filePath, buffer);
    
    // Return the URL to the uploaded file
    const imageUrl = `/uploads/${uniqueFilename}`;
    
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Failed to upload image' },
      { status: 500 }
    );
  }
}