import { NextRequest, NextResponse } from 'next/server'
import { documentService } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const claimId = searchParams.get('claimId')
    const status = searchParams.get('status')
    const fileType = searchParams.get('fileType')

    // Require userId for security - users can only see their own documents
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required to fetch documents' },
        { status: 400 }
      )
    }

    const filters = {
      userId, // Always filter by userId for security
      ...(claimId && { claimId }),
      ...(status && { status: status as any }),
      ...(fileType && { fileType: fileType as any })
    }

    const documents = await documentService.getAll(filters)
    return NextResponse.json({ success: true, data: documents })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      filename, 
      originalName, 
      filePath, 
      fileSize, 
      mimeType, 
      fileType, 
      userId,
      claimId 
    } = body

    if (!filename || !originalName || !filePath || !fileSize || !mimeType || !fileType || !userId) {
      return NextResponse.json(
        { success: false, error: 'All required document fields are missing' },
        { status: 400 }
      )
    }

    const document = await documentService.create({
      filename,
      originalName,
      filePath,
      fileSize,
      mimeType,
      fileType,
      userId,
      claimId
    })

    return NextResponse.json({ success: true, data: document }, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create document' },
      { status: 500 }
    )
  }
}
