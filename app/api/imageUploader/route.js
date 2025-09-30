import { NextResponse } from "next/server";
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        
        if (!file) {
            return NextResponse.json({ error: 'No file received' }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name}`;
        
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save to public/uploads directory
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        const filePath = path.join(uploadsDir, filename);
        
        await writeFile(filePath, buffer);
        
        // Return the public URL
        const imageUrl = `/uploads/${filename}`;
        
        return NextResponse.json({ url: imageUrl });
        
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' }, 
            { status: 500 }
        );
    }
}