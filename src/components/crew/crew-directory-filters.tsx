"use client"

import { useState } from 'react'
import { CrewMemberQuery } from '@/lib/validations/crew-member'
import { useRoles } from '@/lib/hooks/use-crew-members'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Search, X, Filter } from 'lucide-react'

interface CrewDirectoryFiltersProps {
  query: CrewMemberQuery
  onQueryChange: (updates: Partial<CrewMemberQuery>) => void
  departments: string[]
}

export function CrewDirectoryFilters({ 
  query, 
  onQueryChange, 
  departments 
}: CrewDirectoryFiltersProps) {
  const [searchValue, setSearchValue] = useState(query.search || '')
  const [isExpanded, setIsExpanded] = useState(false)
  
  const { data: rolesData } = useRoles(query.department)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onQueryChange({ search: searchValue || undefined })
  }

  const handleClearFilters = () => {
    setSearchValue('')
    onQueryChange({
      search: undefined,
      department: undefined,
      role: undefined,
    })
  }

  const hasActiveFilters = query.search || query.department || query.role
  const filterCount = [query.search, query.department, query.role].filter(Boolean).length

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crew members..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="secondary">
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {filterCount > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                  {filterCount}
                </span>
              )}
            </Button>
          </form>

          {/* Advanced Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={query.department || 'all'}
                  onValueChange={(value) =>
                    onQueryChange({ department: value === 'all' ? undefined : value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={query.role || 'all'}
                  onValueChange={(value) =>
                    onQueryChange({ role: value === 'all' ? undefined : value })
                  }
                  disabled={!query.department}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    {rolesData?.roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort by</Label>
                <Select
                  value={`${query.sortBy}-${query.sortOrder}`}
                  onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('-') as [string, 'asc' | 'desc']
                    onQueryChange({ sortBy, sortOrder })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                    <SelectItem value="department-asc">Department A-Z</SelectItem>
                    <SelectItem value="department-desc">Department Z-A</SelectItem>
                    <SelectItem value="role-asc">Role A-Z</SelectItem>
                    <SelectItem value="role-desc">Role Z-A</SelectItem>
                    <SelectItem value="createdAt-desc">Recently added</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest first</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                {filterCount} filter{filterCount !== 1 ? 's' : ''} applied
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="h-auto p-1"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}