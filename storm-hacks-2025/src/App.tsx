
import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"
import Hero from './components/Hero'
import CardScrollArea  from './components/card-scroller'
import AppSidebar from './components/app-sidebar'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"

import { useState, useEffect } from 'react'
import express from 'express';
import redisClient from './redis.js';



function App() {
  const [count, setCount] = useState(0)

  const [showSidebar, setShowSidebar] = useState(false)

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    
    <Hero />

    
    

    
  <div className="fixed top-0 left-0 right-0 bottom-0 z-50">
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset className="flex flex-col">
      {/* Header */}
      <div className="w-full shadow-md border-b">
        <div className="p-4 flex items-center gap-4">
          <SidebarTrigger />
          
          <p>Card Finder</p>
          <div id="find" className="flex-1">
            <InputGroup>
              <InputGroupInput placeholder="Enter Card here!" />
              <InputGroupAddon align="inline-end">
                <InputGroupButton variant="secondary">Search</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto p-4">
        <CardScrollArea />
      </div>

      

    </SidebarInset>
  </SidebarProvider>
  </div>
  <div className=''> </div>
     
  


    

      

    </ThemeProvider>
  )
}

export default App
