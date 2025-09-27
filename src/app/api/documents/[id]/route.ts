import { NextRequest, NextResponse } from 'next/server'
import { documentService } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const document = await documentService.findById(id)
    
    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: document })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch document' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, extractedText, confidence, metadata, ...updateData } = body

    let document
    if (status) {
      document = await documentService.updateStatus(
        id, 
        status, 
        extractedText, 
        confidence, 
        metadata
      )
    } else {
      document = await documentService.update(id, updateData)
    }

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: document })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update document' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await documentService.delete(id)
    return NextResponse.json({ success: true, message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
