import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@slate.com',
      name: 'Demo User',
      role: 'ADMIN',
    },
  })

  // Create sample crew members
  const crewMembers = await Promise.all([
    prisma.crewMember.create({
      data: {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555-0123',
        department: 'Camera',
        position: 'Director of Photography',
        union: 'IATSE',
        rate: 750.0,
        createdById: demoUser.id,
      },
    }),
    prisma.crewMember.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1-555-0124',
        department: 'Sound',
        position: 'Sound Mixer',
        union: 'IATSE',
        rate: 650.0,
        createdById: demoUser.id,
      },
    }),
    prisma.crewMember.create({
      data: {
        name: 'Mike Rodriguez',
        email: 'mike@example.com',
        phone: '+1-555-0125',
        department: 'Art',
        position: 'Production Designer',
        union: 'IATSE',
        rate: 700.0,
        createdById: demoUser.id,
      },
    }),
    prisma.crewMember.create({
      data: {
        name: 'Emily Chen',
        email: 'emily@example.com',
        phone: '+1-555-0126',
        department: 'Wardrobe',
        position: 'Costume Designer',
        rate: 600.0,
        createdById: demoUser.id,
      },
    }),
  ])

  // Create sample call sheet
  const callSheet = await prisma.callSheet.create({
    data: {
      title: 'Project Alpha - Day 1',
      shootDate: new Date('2024-02-15'),
      callTime: '06:00',
      location: '123 Hollywood Blvd, Los Angeles, CA 90028',
      mapLink: 'https://maps.google.com/?q=123+Hollywood+Blvd,+Los+Angeles,+CA',
      status: 'DRAFT',
      projectType: 'Feature Film',
      weather: 'Sunny, 75°F',
      sunrise: '6:45 AM',
      sunset: '6:30 PM',
      generalNotes: 'Please arrive 15 minutes early for safety briefing.',
      safetyNotes: 'Hard hats required in construction areas.',
      createdById: demoUser.id,
      scenes: {
        create: [
          {
            sceneNumber: '1A',
            description: 'INT. COFFEE SHOP - MORNING',
            location: 'Downtown Coffee Shop',
            timeOfDay: 'Day',
            pages: 2.5,
            estimatedTime: '3 hours',
            notes: 'Need background extras',
          },
          {
            sceneNumber: '1B',
            description: 'EXT. COFFEE SHOP - CONTINUOUS',
            location: 'Downtown Coffee Shop Exterior',
            timeOfDay: 'Day',
            pages: 1.0,
            estimatedTime: '1 hour',
            notes: 'Street parking coordination required',
          },
        ],
      },
      callSheetCrew: {
        create: crewMembers.map((crew) => ({
          crewMemberId: crew.id,
          callTime: '06:30',
          notes: 'Standard call',
        })),
      },
    },
  })

  // Create a sample template
  await prisma.template.create({
    data: {
      name: 'Standard Feature Film Template',
      description: 'Basic template for feature film productions',
      data: {
        defaultCallTime: '06:00',
        defaultDepartments: ['Camera', 'Sound', 'Art', 'Wardrobe', 'Grip', 'Electric'],
        standardNotes: 'Please arrive 15 minutes early for safety briefing.',
      },
      isPublic: true,
      createdById: demoUser.id,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log('📧 Demo user email: demo@slate.com')
  console.log('📊 Created 1 call sheet with 2 scenes')
  console.log('👥 Created 4 crew members')
  console.log('📋 Created 1 template')
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