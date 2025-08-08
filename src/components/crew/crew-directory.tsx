"use client"

import { useState } from 'react'
import { useCrewMembers, useDepartments } from '@/lib/hooks/use-crew-members'
import { CrewMemberQuery } from '@/lib/validations/crew-member'
import { CrewMemberTable } from './crew-member-table'
import { CrewDirectoryFilters } from './crew-directory-filters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Building, Briefcase } from 'lucide-react'

export function CrewDirectory() {
  const [query, setQuery] = useState<CrewMemberQuery>({
    page: 1,
    limit: 20,
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const { data: crewData, isLoading, error } = useCrewMembers(query)
  const { data: departmentsData } = useDepartments()

  const handleQueryChange = (updates: Partial<CrewMemberQuery>) => {
    setQuery(prev => ({ ...prev, ...updates, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setQuery(prev => ({ ...prev, page }))
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-2">Failed to load crew directory</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const stats = [
    {
      label: 'Total Crew',
      value: crewData?.pagination.total || 0,
      icon: Users,
    },
    {
      label: 'Departments',
      value: departmentsData?.departments.length || 0,
      icon: Building,
    },
    {
      label: 'Active Roles',
      value: crewData?.crewMembers.length || 0,
      icon: Briefcase,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-3">
                <stat.icon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <CrewDirectoryFilters 
        query={query}
        onQueryChange={handleQueryChange}
        departments={departmentsData?.departments || []}
      />

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Crew Members</CardTitle>
            {crewData && (
              <Badge variant="outline">
                {crewData.pagination.total} total
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CrewMemberTable
            crewMembers={crewData?.crewMembers || []}
            isLoading={isLoading}
            pagination={crewData?.pagination}
            onPageChange={handlePageChange}
            onSort={(sortBy, sortOrder) => 
              handleQueryChange({ sortBy, sortOrder })
            }
            currentSort={{
              sortBy: query.sortBy || 'name',
              sortOrder: query.sortOrder || 'asc'
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}