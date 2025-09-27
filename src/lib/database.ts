import { prisma } from './prisma'
import { 
  Claim, 
  Document, 
  User, 
  ClaimStatus, 
  DocumentStatus, 
  DocumentType, 
  Priority,
  UserRole 
} from '../generated/prisma'
import bcrypt from 'bcryptjs'

// User operations
export const userService = {
  async create(data: { email: string; name?: string; password: string; role?: UserRole }) {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    return prisma.user.create({ 
      data: { ...data, password: hashedPassword }
    })
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  async findById(id: string) {
    return prisma.user.findUnique({ 
      where: { id },
      include: { claims: true, documents: true }
    })
  },

  async update(id: string, data: Partial<User>) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12)
    }
    return prisma.user.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } })
  },

  async getAll() {
    return prisma.user.findMany({
      include: { claims: true, documents: true }
    })
  },

  async verifyPassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}

// Claim operations
export const claimService = {
  async create(data: {
    claimNumber: string
    claimantName: string
    spouseName?: string
    fatherMotherName?: string
    address: string
    village: string
    gramPanchayat: string
    tehsilTaluka: string
    district: string
    state: string
    isScheduledTribe?: boolean
    isOtherTraditionalForestDweller?: boolean
    familyMembers?: Array<{name: string, age: number}>
    title: string
    description?: string
    category?: string
    amount?: number
    currency?: string
    priority?: Priority
    userId: string
  }) {
    // Check for duplicates before creating
    const duplicateCheck = await checkDuplicateClaim({
      userId: data.userId,
      claimantName: data.claimantName,
      village: data.village,
      district: data.district,
      state: data.state,
      fatherMotherName: data.fatherMotherName
    })
    
    if (duplicateCheck.isDuplicate) {
      throw new Error(`Duplicate claim detected. A claim for ${data.claimantName} in ${data.village}, ${data.district} already exists.`)
    }
    
    // Use transaction to ensure atomic claim creation
    return await prisma.$transaction(async (tx) => {
      // Generate unique claim number based on claimant and location
      const claimNumber = await generateClaimNumber({
        claimantName: data.claimantName,
        village: data.village,
        gramPanchayat: data.gramPanchayat,
        tehsilTaluka: data.tehsilTaluka,
        district: data.district,
        state: data.state
      })
      
      // Create the claim
      const claim = await tx.claim.create({ 
        data: {
          ...data,
          claimNumber
        },
        include: { 
          user: true, 
          documents: true 
        }
      })
      
      return claim
    })
  },

  async findById(id: string) {
    return prisma.claim.findUnique({ 
      where: { id },
      include: { 
        user: true, 
        documents: true 
      }
    })
  },

  async findByClaimNumber(claimNumber: string) {
    return prisma.claim.findUnique({ 
      where: { claimNumber },
      include: { 
        user: true, 
        documents: true 
      }
    })
  },

  async update(id: string, data: Partial<Claim>) {
    return prisma.claim.update({ 
      where: { id }, 
      data,
      include: { 
        user: true, 
        documents: true 
      }
    })
  },

  async updateStatus(id: string, status: ClaimStatus) {
    return prisma.claim.update({ 
      where: { id }, 
      data: { 
        status,
        ...(status === 'PROCESSED' && { processedAt: new Date() })
      },
      include: { 
        user: true, 
        documents: true 
      }
    })
  },

  async delete(id: string) {
    return prisma.claim.delete({ where: { id } })
  },

  async getAll(filters?: {
    status?: ClaimStatus
    userId?: string
    category?: string
    priority?: Priority
  }) {
    return prisma.claim.findMany({
      where: filters,
      include: { 
        user: true, 
        documents: true 
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getByUser(userId: string) {
    return prisma.claim.findMany({
      where: { userId },
      include: { 
        user: true, 
        documents: true 
      },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getStats() {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.claim.count(),
      prisma.claim.count({ where: { status: 'PENDING' } }),
      prisma.claim.count({ where: { status: 'APPROVED' } }),
      prisma.claim.count({ where: { status: 'REJECTED' } })
    ])

    return { total, pending, approved, rejected }
  }
}

// Document operations
export const documentService = {
  async create(data: {
    filename: string
    originalName: string
    filePath: string
    fileSize: number
    mimeType: string
    fileType: DocumentType
    userId: string
    claimId?: string
  }) {
    return prisma.document.create({ 
      data,
      include: { user: true, claim: true }
    })
  },

  async findById(id: string) {
    return prisma.document.findUnique({ 
      where: { id },
      include: { user: true, claim: true }
    })
  },

  async findByUser(userId: string) {
    return prisma.document.findMany({
      where: { userId },
      include: { user: true, claim: true },
      orderBy: { createdAt: 'desc' }
    })
  },

  async findByClaim(claimId: string) {
    return prisma.document.findMany({
      where: { claimId },
      include: { user: true, claim: true },
      orderBy: { createdAt: 'desc' }
    })
  },

  async update(id: string, data: Partial<Document>) {
    return prisma.document.update({ 
      where: { id }, 
      data,
      include: { user: true, claim: true }
    })
  },

  async updateStatus(id: string, status: DocumentStatus, extractedText?: string, confidence?: number, metadata?: any) {
    return prisma.document.update({ 
      where: { id }, 
      data: { 
        status,
        ...(status === 'PROCESSED' && { 
          processedAt: new Date(),
          extractedText,
          confidence,
          metadata
        })
      },
      include: { user: true, claim: true }
    })
  },

  async delete(id: string) {
    return prisma.document.delete({ where: { id } })
  },

  async getAll(filters?: {
    status?: DocumentStatus
    fileType?: DocumentType
    claimId?: string
    userId?: string
  }) {
    return prisma.document.findMany({
      where: filters,
      include: { user: true, claim: true },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getStats() {
    const [total, processed, failed] = await Promise.all([
      prisma.document.count(),
      prisma.document.count({ where: { status: 'PROCESSED' } }),
      prisma.document.count({ where: { status: 'FAILED' } })
    ])

    return { total, processed, failed }
  }
}

// Utility functions
export const generateClaimNumber = async (data: {
  claimantName: string
  village: string
  gramPanchayat: string
  tehsilTaluka: string
  district: string
  state: string
}): Promise<string> => {
  // Create a unique claim ID based on claimant and location details
  const createClaimId = (claimant: string, village: string, gramPanchayat: string, tehsil: string, district: string, state: string) => {
    // Clean and normalize the strings
    const clean = (str: string) => str
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove special characters
      .substring(0, 10) // Limit length
    
    const claimantCode = clean(claimant)
    const villageCode = clean(village)
    const gramPanchayatCode = clean(gramPanchayat)
    const tehsilCode = clean(tehsil)
    const districtCode = clean(district)
    const stateCode = clean(state)
    
    // Create a unique identifier
    const baseId = `${claimantCode}-${villageCode}-${gramPanchayatCode}-${tehsilCode}-${districtCode}-${stateCode}`
    
    return baseId
  }
  
  const baseClaimId = createClaimId(
    data.claimantName,
    data.village,
    data.gramPanchayat,
    data.tehsilTaluka,
    data.district,
    data.state
  )
  
  // Use a transaction to ensure atomic claim number generation
  return await prisma.$transaction(async (tx) => {
    // Check if this exact combination already exists
    const existingClaim = await tx.claim.findFirst({
      where: {
        claimNumber: {
          startsWith: baseClaimId
        }
      },
      orderBy: {
        claimNumber: 'desc'
      },
      select: {
        claimNumber: true
      }
    })
    
    if (existingClaim) {
      // If exact match exists, add a sequence number
      const parts = existingClaim.claimNumber.split('-')
      const lastSequence = parts.length > 6 ? parseInt(parts[6]) || 0 : 0
      return `${baseClaimId}-${String(lastSequence + 1).padStart(3, '0')}`
    }
    
    // Return the base claim ID for first occurrence
    return baseClaimId
  })
}

// Check for duplicate claims
export const checkDuplicateClaim = async (data: {
  userId: string
  claimantName: string
  village: string
  district: string
  state: string
  fatherMotherName?: string
}): Promise<{ isDuplicate: boolean; existingClaim?: any }> => {
  try {
    // Check for exact duplicate based on user and claim details
    const existingClaim = await prisma.claim.findFirst({
      where: {
        userId: data.userId,
        claimantName: data.claimantName,
        village: data.village,
        district: data.district,
        state: data.state,
        ...(data.fatherMotherName && { fatherMotherName: data.fatherMotherName })
      },
      include: {
        user: true,
        documents: true
      }
    })
    
    if (existingClaim) {
      return { isDuplicate: true, existingClaim }
    }
    
    // Check for potential duplicate based on claimant and location
    const potentialDuplicate = await prisma.claim.findFirst({
      where: {
        claimantName: data.claimantName,
        village: data.village,
        district: data.district,
        ...(data.fatherMotherName && { fatherMotherName: data.fatherMotherName })
      },
      include: {
        user: true
      }
    })
    
    if (potentialDuplicate) {
      return { isDuplicate: true, existingClaim: potentialDuplicate }
    }
    
    return { isDuplicate: false }
  } catch (error) {
    console.error('Error checking for duplicate claims:', error)
    return { isDuplicate: false }
  }
}

export const getDashboardStats = async () => {
  const [claimStats, documentStats, recentClaims] = await Promise.all([
    claimService.getStats(),
    documentService.getStats(),
    prisma.claim.findMany({
      take: 5,
      include: { user: true, documents: true },
      orderBy: { createdAt: 'desc' }
    })
  ])

  return {
    claims: claimStats,
    documents: documentStats,
    recentClaims
  }
}
