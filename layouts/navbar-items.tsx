'use client'

import React, { useEffect } from "react"
import { ChevronDown, ChevronUp, Folder, Gauge, LineChart, Settings, Users } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NavItem {
  icon: React.ReactNode
  label: string
  items?: string[]
}

interface NavbarItemsProps {
    isNavbarExpanded: boolean,
    toggleNavbar: () => void
}

export default function NavbarItems({ isNavbarExpanded, toggleNavbar }: NavbarItemsProps) {
  const [activeItem, setActiveItem] = useState("")
  const [openSection, setOpenSection] = useState("")
  
  useEffect(() => {
    if (!isNavbarExpanded) {
      setOpenSection("");
      setActiveItem("");
    }
  }, [isNavbarExpanded]);

  const navItems: NavItem[] = [
    {
      icon: <Users className="size-5 text-muted-foreground" />,
      label: "Users",
      items: ["Users", "Groups", "Roles"]
    },
    {
      icon: <Gauge className="size-5 text-muted-foreground" />,
      label: "Services",
      items: ["Services", "Service groups"]
    },
    {
      icon: <Settings className="size-5 text-muted-foreground" />,
      label: "Workers",
      items: ["Manage workers", "Shared to you", "Shared by you", "Settings"]
    },
    {
      icon: <Folder className="size-5 text-muted-foreground" />,
      label: "Assets",
      items: ["Assets", "Asset groups"]
    },
    {
      icon: <LineChart className="size-5 text-muted-foreground" />,
      label: "Analytics",
      items: ["Analytics", "Analytics groups"]
    }
  ]

  function getIconClass(itemLabel: string) {
    const isActive = openSection === itemLabel || 
      (activeItem && navItems.find(item => item.label === itemLabel)?.items?.includes(activeItem));
    return `size-5 transition-colors ${isActive ? 'text-brand-green' : 'text-muted-foreground group-hover:text-brand-green'}`;
  }

  const navItemsWithDynamicIcons = navItems.map(item => ({
    ...item,
    icon: React.cloneElement(item.icon as React.ReactElement, {
      className: getIconClass(item.label)
    })
  }));

  return (
    <nav className={`space-y-4 ${isNavbarExpanded ? 'w-60 p-4' : 'w-13 p-2'}`}>
      {navItemsWithDynamicIcons.map((item) => (
        <Collapsible
          key={item.label}
          open={isNavbarExpanded && openSection === item.label}
          onOpenChange={() => {
            if (isNavbarExpanded) {
              setOpenSection(openSection === item.label ? "" : item.label)
            }
          }}
        >
          <CollapsibleTrigger asChild>
            {isNavbarExpanded ? (
            <Button
              variant="ghost"
              className="group flex w-full items-center justify-between px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-bold text-foreground dark:text-foreground hover:text-muted-foreground dark:hover:text-muted-foreground">
                  {item.label}
                </span>
              </div>
              {item.items && (
                openSection === item.label ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )
              )}
            </Button>
            ) : (
              <Button
                variant="ghost"
                className="group flex items-center justify-center px-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => {
                  toggleNavbar();
                  setOpenSection(item.label);
                }}
              > 
                {item.icon}
              </Button>
            )}
          </CollapsibleTrigger>
          {item.items && (
            <CollapsibleContent className="space-y-1 px-2 py-1">
              <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-3 pl-2">
                {item.items.map((subItem) => (
                  <div key={subItem} className="relative flex items-center">
                    {/* Horizontal line */}
                    <div className="absolute left-0 w-4 border-t-2 border-gray-200 dark:border-gray-700" />
                    <Button
                      variant="ghost"
                      className={`w-full justify-start pl-6 text-sm font-bold text-foreground dark:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        activeItem === subItem ? "bg-gray-100 dark:bg-gray-800" : ""
                      }`}
                      onClick={() => setActiveItem(subItem)}
                    >
                      {subItem}
                    </Button>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      ))}
    </nav>
  )
}