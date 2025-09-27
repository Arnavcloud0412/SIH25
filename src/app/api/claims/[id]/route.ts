import { NextRequest, NextResponse } from 'next/server'
import { claimService } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const claim = await claimService.findById(id)
    
    if (!claim) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: claim })
  } catch (error) {
    console.error('Error fetching claim:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch claim' },
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
    const { status, ...updateData } = body

    let claim
    if (status) {
      claim = await claimService.updateStatus(id, status)
    } else {
      claim = await claimService.update(id, updateData)
    }

    if (!claim) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: claim })
  } catch (error) {
    console.error('Error updating claim:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update claim' },
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
    await claimService.delete(id)
    return NextResponse.json({ success: true, message: 'Claim deleted successfully' })
  } catch (error) {
    console.error('Error deleting claim:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete claim' },
      { status: 500 }
    )
  }
}
