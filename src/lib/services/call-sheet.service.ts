import { prisma } from '@/lib/db'
import { CallSheetQuery, CreateCallSheetData, UpdateCallSheetData } from '@/lib/validations/call-sheet'
import { Prisma } from '@prisma/client'

// Include relations for complete call sheet data
const callSheetInclude = {
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    }
  },
  scenes: {
    orderBy: {
      sceneNumber: 'asc' as const
    }
  },
  callSheetCrew: {
    include: {
      crewMember: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          department: true,
          role: true,
        }
      }
    }
  }
} satisfies Prisma.CallSheetInclude

export class CallSheetService {
  // Get paginated list of call sheets for a user
  static async getCallSheets(userId: string, query: CallSheetQuery) {
    const {
      page = 1,
      limit = 10,
      status,
      projectType,
      search,
      sortBy = 'shootDate',
      sortOrder = 'desc'
    } = query

    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.CallSheetWhereInput = {
      createdById: userId,
    }

    if (status) {
      where.status = status
    }

    if (projectType) {
      where.projectType = {
        contains: projectType
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { location: { contains: search } },
        { generalNotes: { contains: search } }
      ]
    }

    // Execute queries in parallel
    const [callSheets, total] = await Promise.all([
      prisma.callSheet.findMany({
        where,
        include: callSheetInclude,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        }
      }),
      prisma.callSheet.count({ where })
    ])

    return {
      callSheets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  }

  // Get single call sheet by ID
  static async getCallSheet(id: string, userId: string) {
    const callSheet = await prisma.callSheet.findFirst({
      where: { id, createdById: userId },
      include: callSheetInclude
    })

    if (!callSheet) {
      throw new Error('Call sheet not found')
    }

    return callSheet
  }

  // Create new call sheet
  static async createCallSheet(userId: string, data: CreateCallSheetData) {
    const { scenes, crewMemberIds, ...callSheetData } = data

    // Verify crew members belong to the user
    if (crewMemberIds.length > 0) {
      const crewCount = await prisma.crewMember.count({
        where: {
          id: { in: crewMemberIds },
          createdById: userId
        }
      })

      if (crewCount !== crewMemberIds.length) {
        throw new Error('Some crew members not found or not accessible')
      }
    }

    const callSheet = await prisma.callSheet.create({
      data: {
        ...callSheetData,
        createdById: userId,
        scenes: {
          create: scenes.map((scene, index) => ({
            ...scene,
            sceneNumber: scene.sceneNumber || `${index + 1}`
          }))
        },
        callSheetCrew: {
          create: crewMemberIds.map(crewMemberId => ({
            crewMemberId,
            callTime: callSheetData.callTime,
            notes: 'Standard call'
          }))
        }
      },
      include: callSheetInclude
    })

    return callSheet
  }

  // Update call sheet
  static async updateCallSheet(id: string, userId: string, data: UpdateCallSheetData) {
    // Verify ownership
    const existingCallSheet = await this.getCallSheet(id, userId)

    const { scenes, crewMemberIds, ...updateData } = data

    // Handle scenes update if provided
    let sceneOperations = {}
    if (scenes !== undefined) {
      // Delete existing scenes and create new ones (simpler than complex upsert logic)
      sceneOperations = {
        scenes: {
          deleteMany: {},
          create: scenes.map((scene, index) => ({
            ...scene,
            sceneNumber: scene.sceneNumber || `${index + 1}`
          }))
        }
      }
    }

    // Handle crew members update if provided
    let crewOperations = {}
    if (crewMemberIds !== undefined) {
      // Verify crew members belong to the user
      if (crewMemberIds.length > 0) {
        const crewCount = await prisma.crewMember.count({
          where: {
            id: { in: crewMemberIds },
            createdById: userId
          }
        })

        if (crewCount !== crewMemberIds.length) {
          throw new Error('Some crew members not found or not accessible')
        }
      }

      crewOperations = {
        callSheetCrew: {
          deleteMany: {},
          create: crewMemberIds.map(crewMemberId => ({
            crewMemberId,
            callTime: updateData.callTime || existingCallSheet.callTime,
            notes: 'Updated assignment'
          }))
        }
      }
    }

    const updatedCallSheet = await prisma.callSheet.update({
      where: { id },
      data: {
        ...updateData,
        ...sceneOperations,
        ...crewOperations
      },
      include: callSheetInclude
    })

    return updatedCallSheet
  }

  // Delete call sheet
  static async deleteCallSheet(id: string, userId: string) {
    // Verify ownership
    await this.getCallSheet(id, userId)

    await prisma.callSheet.delete({
      where: { id }
    })

    return { message: 'Call sheet deleted successfully' }
  }

  // Duplicate call sheet
  static async duplicateCallSheet(id: string, userId: string) {
    const originalCallSheet = await this.getCallSheet(id, userId)

    const duplicateData = {
      title: `${originalCallSheet.title} (Copy)`,
      shootDate: new Date(),
      callTime: originalCallSheet.callTime,
      location: originalCallSheet.location,
      mapLink: originalCallSheet.mapLink || undefined,
      projectType: originalCallSheet.projectType || undefined,
      weather: originalCallSheet.weather || undefined,
      sunrise: originalCallSheet.sunrise || undefined,
      sunset: originalCallSheet.sunset || undefined,
      generalNotes: originalCallSheet.generalNotes || undefined,
      safetyNotes: originalCallSheet.safetyNotes || undefined,
      scenes: originalCallSheet.scenes.map(scene => ({
        sceneNumber: scene.sceneNumber,
        description: scene.description || undefined,
        location: scene.location || undefined,
        timeOfDay: scene.timeOfDay as 'Day' | 'Night' | 'Dawn' | 'Dusk' | undefined,
        pages: scene.pages || undefined,
        estimatedTime: scene.estimatedTime || undefined,
        notes: scene.notes || undefined
      })),
      crewMemberIds: originalCallSheet.callSheetCrew.map(cc => cc.crewMemberId)
    }

    return this.createCallSheet(userId, duplicateData)
  }
}