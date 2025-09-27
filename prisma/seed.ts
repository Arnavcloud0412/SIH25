import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create a sample user with hashed password
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@fra-mitra.com' },
    update: {},
    create: {
      email: 'admin@fra-mitra.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create a sample claim with all required fields
  const claim = await prisma.claim.upsert({
    where: { claimNumber: 'rameshgond-kanha-bhoramdeo-mandla-balaghat-madhyapradesh' },
    update: {},
    create: {
      claimNumber: 'rameshgond-kanha-bhoramdeo-mandla-balaghat-madhyapradesh',
      claimantName: 'Ramesh Gond',
      spouseName: 'Sita Gond',
      fatherMotherName: 'Bhola Gond',
      address: 'House No. 12, Near Primary School',
      village: 'Kanha',
      gramPanchayat: 'Bhoramdeo',
      tehsilTaluka: 'Mandla',
      district: 'Balaghat',
      state: 'Madhya Pradesh',
      isScheduledTribe: true,
      isOtherTraditionalForestDweller: false,
      familyMembers: [
        { name: 'Sita Gond', age: 35 },
        { name: 'Raju Gond', age: 12 },
        { name: 'Meena Gond', age: 10 }
      ],
      title: 'Sample Forest Rights Claim',
      description: 'This is a sample claim for testing purposes',
      status: 'PENDING',
      priority: 'MEDIUM',
      category: 'Forest Rights',
      amount: 50000.00,
      currency: 'INR',
      userId: user.id,
      submittedAt: new Date(),
    },
  })

  console.log('Seed data created:', { user, claim })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
