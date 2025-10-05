
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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { useState, useEffect } from 'react'
import express from 'express';
import redisClient from './redis.js';

const app = express();


async function startServer() {
  try {
    // Redis connection happens in redis.js
    console.log('Redis connected successfully');
    
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
  
startServer();


function App() {
  const [count, setCount] = useState(0)

  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show sidebar after scrolling past hero (100vh)
      if (window.scrollY > window.innerHeight) {
        setShowSidebar(true)
      } else {
        setShowSidebar(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    
    <Hero />

    
    

    {showSidebar && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <SidebarProvider>
            <AppSidebar />
            <div className="w-full bg-white shadow-md">
              <div className="p-4 flex items-center gap-4">
                <SidebarTrigger />
                <p>This is your main content area.</p>
              </div>
            </div>
          </SidebarProvider>
        </div>
      )}


    <div id="find">
    <InputGroup>
      <InputGroupInput placeholder="Enter Card here!" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="secondary">Search</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
    </div>


    <CardScrollArea/>

      

    </ThemeProvider>
  )
}

export default App
