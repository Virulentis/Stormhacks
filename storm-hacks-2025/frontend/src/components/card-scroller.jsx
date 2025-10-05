import { ScrollArea } from "@/components/ui/scroll-area"
import * as React from "react"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from 'react'
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"

const API_URL = 'http://localhost:3001';

export default function CardScrollArea() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(2000);
  
  const [selectedItems, setSelectedItems] = useState(new Set());

  const parseItem = (item) => {
    let parsedValue;
    try {
      if (typeof item.value === 'string') {
        try {
          parsedValue = JSON.parse(item.value);
        } catch {
          console.log('Manually parsing malformed string');
          const obj = {};
          const content = item.value.slice(1, -1);
          const parts = [];
          let current = '';
          let depth = 0;
          
          for (let i = 0; i < content.length; i++) {
            const char = content[i];
            if (char === ',' && depth === 0) {
              parts.push(current.trim());
              current = '';
            } else {
              if (char === '{') depth++;
              if (char === '}') depth--;
              current += char;
            }
          }
          if (current) parts.push(current.trim());
          
          parts.forEach(part => {
            const colonIndex = part.indexOf(':');
            if (colonIndex > -1) {
              const key = part.slice(0, colonIndex).trim();
              const value = part.slice(colonIndex + 1).trim();
              obj[key] = value;
            }
          });
          
          parsedValue = obj;
        }
      } else {
        parsedValue = item.value;
      }
    } catch (error) {
      console.error('Parse failed:', error);
      parsedValue = item.value;
    }
    return parsedValue;
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/data`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('Fetched data:', result);
      

      const parsedData = result.map(item => ({
        redisKey: item.key, 
        ...parseItem(item) 
      }));
      
      setData(parsedData);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fixed toggle to work with Set
  const toggleItem = (itemKey) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetchData();
   
    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading data from Redis...</div>;
  }

  const selectedCount = selectedItems.size;

  const getSelectedItems = () => {
    return data.filter(item => {
      const itemKey = item.redisKey; 
      return selectedItems.has(itemKey);
    });
  };

  const selectedItemsList = getSelectedItems();
  console.log('Selected items:', selectedItemsList);

  const calculateTotalMinPrice = () => {
    let totalMinPrice = 0;
    console.log('Calculating total min price for selected items:', selectedItems);
    
    selectedItems.forEach((itemKey) => {
      const selectedItem = data.find(item => item.redisKey === itemKey);
      
      if (selectedItem && selectedItem.Price_Min) {
        totalMinPrice += parseFloat(selectedItem.Price_Min) || 0;
      }
    });
    
    return totalMinPrice;
  };

  const calculateTotalMaxPrice = () => {
    let totalMaxPrice = 0;
    
    selectedItems.forEach((itemKey) => {
      const selectedItem = data.find(item => item.redisKey === itemKey);
      
      if (selectedItem) {
        const price = parseFloat(selectedItem.Price_Max);
        if (!isNaN(price)) {
          totalMaxPrice += price;
        }
      }
    });
    
    return totalMaxPrice;
  };

  const copy_to_clipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Error in copying text: ', err);
    });
  }

  const totalMin = calculateTotalMinPrice();
  const totalMax = calculateTotalMaxPrice();
  

  return (
    <div>
      <ScrollArea className="h-[calc(100vh-120px)] rounded-md border">
        <div className="p-1">
          {data.map((item) => {
            const isSelected = selectedItems.has(item.redisKey);
            
            return (
              <Card key={item.redisKey} className="transition-shadow mb-1 last:mb-0">
                <div className="p-2 flex items-start gap-3">
                  <Toggle
                    pressed={isSelected}
                    onPressedChange={() => toggleItem(item.redisKey)} 
                    className="flex-shrink-0 mt-1">
                    <svg className="fill-black dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M3 4V22C3 23.1 3.9 24 5 24H17V22H5V4H3M19 0H9C7.9 0 7 .9 7 2V18C7 19.1 7.9 20 9 20H19C20.1 20 21 19.1 21 18V2C21 .9 20.1 0 19 0M16 13C15.4 13 14.9 12.7 14.5 12.3L15.5 15H12.5L13.5 12.3C13.1 12.7 12.6 13 12 13C10.9 13 10 12.1 10 11S10.9 9 12 9H12.3C12.1 8.7 12 8.4 12 8C12 6.9 12.9 6 14 6S16 6.9 16 8C16 8.4 15.9 8.7 15.7 9H16C17.1 9 18 9.9 18 11S17.1 13 16 13Z" />
                    </svg>
                  </Toggle>

                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm truncate">
                      <a href={item.URL || "#"} className="hover:underline">
                        {item.Name || "No name provided."}
                      </a>
                    </CardTitle>
                    <CardDescription className="text-xs truncate">
                      {[item.Retailer, item.Vendor].filter(Boolean).join(' • ')}
                    </CardDescription>
                  </div>

                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {[item.Price_Min, item.Price_Max].filter(Boolean).join(' - ') || ""}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
      
      <footer className="border-t bg-background p-2 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Found {data.length} cards • Selected: {selectedCount} • ${totalMin.toFixed(2)}  Min • ${totalMax.toFixed(2)} Max
          </div>
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full hover:bg-blue-700/10" 
              onClick={() => copy_to_clipboard(JSON.stringify(getSelectedItems(), null, 2))} 
              disabled={selectedCount === 0} 
              title="Copy Selected Items to Clipboard">
              <svg className="fill-black dark:fill-white" width="800px" height="800px" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.6,4H21.55a3.89,3.89,0,0,0-7.31,0H13.4A2.41,2.41,0,0,0,11,6.4V10H25V6.4A2.41,2.41,0,0,0,22.6,4ZM23,8H13V6.25A.25.25,0,0,1,13.25,6h2.69l.12-1.11A1.24,1.24,0,0,1,16.61,4a2,2,0,0,1,3.15,1.18l.09.84h2.9a.25.25,0,0,1,.25.25Z" className="clr-i-outline clr-i-outline-path-1"></path>
                <path d="M33.25,18.06H21.33l2.84-2.83a1,1,0,1,0-1.42-1.42L17.5,19.06l5.25,5.25a1,1,0,0,0,.71.29,1,1,0,0,0,.71-1.7l-2.84-2.84H33.25a1,1,0,0,0,0-2Z" className="clr-i-outline clr-i-outline-path-2"></path>
                <path d="M29,16h2V6.68A1.66,1.66,0,0,0,29.35,5H27.08V7H29Z" className="clr-i-outline clr-i-outline-path-3"></path>
                <path d="M29,31H7V7H9V5H6.64A1.66,1.66,0,0,0,5,6.67V31.32A1.66,1.66,0,0,0,6.65,33H29.36A1.66,1.66,0,0,0,31,31.33V22.06H29Z" className="clr-i-outline clr-i-outline-path-4"></path>
                <rect x="0" y="0" width="36" height="36" fillOpacity="0"/>
              </svg>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}