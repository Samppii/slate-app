import { prisma } from '@/lib/db'
import { CreateCrewMemberData, UpdateCrewMemberData, CrewMemberQuery } from '@/lib/validations/crew-member'
import { Prisma } from '@prisma/client'

export class CrewMemberService {
  static async getCrewMembers(userId: string, query: CrewMemberQuery = {}) {
    const {
      search,
      department,
      role,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = query

    const where: Prisma.CrewMemberWhereInput = {
      userId,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { role: { contains: search } },
          { department: { contains: search } },
          { email: { contains: search } },
        ]
      }),
      ...(department && { department: { equals: department } }),
      ...(role && { role: { contains: role } }),
    }

    const orderBy: Prisma.CrewMemberOrderByWithRelationInput = {
      [sortBy]: sortOrder
    }

    const [crewMembers, total] = await Promise.all([
      prisma.crewMember.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.crewMember.count({ where })
    ])

    return {
      crewMembers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  static async getCrewMember(userId: string, id: string) {
    const crewMember = await prisma.crewMember.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!crewMember) {
      throw new Error('Crew member not found')
    }

    return crewMember
  }

  static async createCrewMember(userId: string, data: CreateCrewMemberData) {
    console.log('Creating crew member with userId:', userId)
    
    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!userExists) {
      console.error('User not found:', userId)
      throw new Error('User not found')
    }
    
    console.log('User found:', userExists.email)
    
    // Check for duplicate name within user's crew
    const existing = await prisma.crewMember.findFirst({
      where: {
        userId,
        name: data.name,
        department: data.department,
        role: data.role
      }
    })

    if (existing) {
      throw new Error('A crew member with this name, role, and department already exists')
    }

    return await prisma.crewMember.create({
      data: {
        ...data,
        email: data.email || undefined,
        phone: data.phone || undefined,
        notes: data.notes || undefined,
        userId
      }
    })
  }

  static async updateCrewMember(userId: string, id: string, data: UpdateCrewMemberData) {
    const crewMember = await this.getCrewMember(userId, id)

    // Check for duplicate name if name/role/department is being changed
    if (data.name || data.role || data.department) {
      const existing = await prisma.crewMember.findFirst({
        where: {
          userId,
          name: data.name ?? crewMember.name,
          department: data.department ?? crewMember.department,
          role: data.role ?? crewMember.role,
          NOT: { id }
        }
      })

      if (existing) {
        throw new Error('A crew member with this name, role, and department already exists')
      }
    }

    return await prisma.crewMember.update({
      where: { id },
      data: {
        ...data,
        email: data.email || undefined,
        phone: data.phone || undefined,
        notes: data.notes || undefined,
      }
    })
  }

  static async deleteCrewMember(userId: string, id: string) {
    await this.getCrewMember(userId, id) // Verify ownership

    return await prisma.crewMember.delete({
      where: { id }
    })
  }

  static async getDepartments(userId: string) {
    const result = await prisma.crewMember.groupBy({
      by: ['department'],
      where: { userId },
      orderBy: { department: 'asc' }
    })

    return result.map(item => item.department)
  }

  static async getRoles(userId: string, department?: string) {
    const where: Prisma.CrewMemberWhereInput = {
      userId,
      ...(department && { department })
    }

    const result = await prisma.crewMember.groupBy({
      by: ['role'],
      where,
      orderBy: { role: 'asc' }
    })

    return result.map(item => item.role)
  }
}