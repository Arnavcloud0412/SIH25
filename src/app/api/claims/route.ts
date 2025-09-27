import { NextRequest, NextResponse } from 'next/server'
import { claimService, generateClaimNumber } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')

    // Require userId for security - users can only see their own claims
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required to fetch claims' },
        { status: 400 }
      )
    }

    const filters = {
      userId, // Always filter by userId for security
      ...(status && { status: status as any }),
      ...(category && { category }),
      ...(priority && { priority: priority as any })
    }

    const claims = await claimService.getAll(filters)
    return NextResponse.json({ success: true, data: claims })
  } catch (error) {
    console.error('Error fetching claims:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch claims' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      claimantName, 
      spouseName, 
      fatherMotherName, 
      address, 
      village, 
      gramPanchayat, 
      tehsilTaluka, 
      district, 
      state, 
      isScheduledTribe, 
      isOtherTraditionalForestDweller, 
      familyMembers, 
      title, 
      description, 
      category, 
      amount, 
      currency, 
      priority, 
      userId 
    } = body

    if (!claimantName || !address || !village || !gramPanchayat || !tehsilTaluka || !district || !state || !title || !userId) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // Create claim with duplicate checking and atomic claim number generation
    const claim = await claimService.create({
      claimNumber: '', // Will be generated atomically
      claimantName,
      spouseName,
      fatherMotherName,
      address,
      village,
      gramPanchayat,
      tehsilTaluka,
      district,
      state,
      isScheduledTribe: isScheduledTribe || false,
      isOtherTraditionalForestDweller: isOtherTraditionalForestDweller || false,
      familyMembers,
      title,
      description,
      category,
      amount,
      currency: currency || 'INR',
      priority: priority || 'MEDIUM',
      userId
    })

    return NextResponse.json({ 
      success: true, 
      data: claim,
      message: 'Claim created successfully with unique claim number'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating claim:', error)
    
    // Handle duplicate claim error
    if (error.message && error.message.includes('Duplicate claim detected')) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          errorType: 'DUPLICATE_CLAIM'
        },
        { status: 409 }
      )
    }
    
    // Handle database constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A claim with similar details already exists',
          errorType: 'DUPLICATE_CLAIM'
        },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create claim' },
      { status: 500 }
    )
  }
}
