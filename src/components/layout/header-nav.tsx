"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
// Navigation menu imports removed as they're not being used
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Plus } from "lucide-react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export function HeaderNav() {
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/logo.png" alt="Slate" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <span className="text-xl font-bold">Slate</span>
            </Link>
            
            <div className="relative w-80 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crew, sheets, scenes..."
                className="pl-10 h-9 cursor-pointer"
                onClick={() => setSearchOpen(true)}
                readOnly
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
          <Button onClick={() => router.push('/builder/new')} className="hidden sm:flex">
            <Plus className="mr-2 h-4 w-4" />
            Create Call Sheet
          </Button>
          <Button onClick={() => router.push('/builder/new')} size="icon" className="sm:hidden">
            <Plus className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/01.png" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">User Name</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/help')}>
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/auth/login')}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Type to search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Call Sheets">
            <CommandItem onSelect={() => {
              setSearchOpen(false)
              router.push('/dashboard')
            }}>
              Project Alpha - Day 1
            </CommandItem>
            <CommandItem onSelect={() => {
              setSearchOpen(false)
              router.push('/dashboard')
            }}>
              Project Beta - Day 3
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Crew">
            <CommandItem onSelect={() => {
              setSearchOpen(false)
              router.push('/crew')
            }}>
              John Doe - Director
            </CommandItem>
            <CommandItem onSelect={() => {
              setSearchOpen(false)
              router.push('/crew')
            }}>
              Jane Smith - Producer
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  )
}