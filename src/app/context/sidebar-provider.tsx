"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useMobile } from "../hooks/use-mobile"

type SidebarState = "expanded" | "collapsed"

interface SidebarContextType {
  sidebarState: SidebarState
  toggleSidebar: () => void
  isMobile: boolean
  isSidebarVisible: boolean
  setIsSidebarVisible: (visible: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const isMobile = useMobile()
  const [sidebarState, setSidebarState] = useState<SidebarState>("expanded")
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isMobile)

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarState")
    if (savedState && (savedState === "expanded" || savedState === "collapsed")) {
      setSidebarState(savedState as SidebarState)
    }

    // For mobile, always start with sidebar hidden regardless of saved state
    if (isMobile) {
      setIsSidebarVisible(false)
    } else {
      const savedVisibility = localStorage.getItem("sidebarVisible")
      setIsSidebarVisible(savedVisibility !== "false")
    }
  }, [isMobile])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebarState", sidebarState)
  }, [sidebarState])

  // Save sidebar visibility to localStorage when it changes
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebarVisible", isSidebarVisible.toString())
    }
  }, [isSidebarVisible, isMobile])

  const toggleSidebar = () => {
    setSidebarState((prev) => (prev === "expanded" ? "collapsed" : "expanded"))
  }

  return (
    <SidebarContext.Provider
      value={{
        sidebarState,
        toggleSidebar,
        isMobile,
        isSidebarVisible,
        setIsSidebarVisible,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}
