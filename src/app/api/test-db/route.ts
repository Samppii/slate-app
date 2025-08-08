import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const callSheetCount = await prisma.callSheet.count()
    const crewMemberCount = await prisma.crewMember.count()

    // Get a sample call sheet with relations
    const sampleCallSheet = await prisma.callSheet.findFirst({
      include: {
        createdBy: true,
        scenes: true,
        callSheetCrew: {
          include: {
            crewMember: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          users: userCount,
          callSheets: callSheetCount,
          crewMembers: crewMemberCount
        },
        sampleCallSheet
      },
      message: 'Database connection successful!'
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}