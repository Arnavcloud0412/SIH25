import { NextRequest, NextResponse } from 'next/server'
import { documentService } from '@/lib/database'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const claimId = formData.get('claimId') as string
    const userId = formData.get('userId') as string
    const fileType = formData.get('fileType') as string

    console.log('Upload request received:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      userId,
      claimId,
      fileTypeParam: fileType
    })

    if (!file || !userId) {
      return NextResponse.json(
        { success: false, error: 'File and userId are required' },
        { status: 400 }
      )
    }

    if (!file.name) {
      return NextResponse.json(
        { success: false, error: 'File name is missing' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop() || 'bin'
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`
    const filePath = join(uploadsDir, filename)

    // Save file to filesystem
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Save document record to database
    const document = await documentService.create({
      filename,
      originalName: file.name,
      filePath: `/uploads/${filename}`,
      fileSize: file.size,
      mimeType: file.type,
      fileType: fileType as any || 'OTHER',
      userId,
      claimId: claimId || undefined
    })

    return NextResponse.json({ 
      success: true, 
      data: document,
      message: 'Document uploaded successfully' 
    }, { status: 201 })
  } catch (error) {
    console.error('Error uploading document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}
