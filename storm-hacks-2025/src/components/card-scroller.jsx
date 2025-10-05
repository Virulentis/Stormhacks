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


export default function CardScrollArea() {
    const [data, setData] = useState([])

    return (
    <ScrollArea className=" rounded-md border">
        <div>
            {data.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.category}</CardDescription>
                </CardHeader>
                <CardContent>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                ...
                </CardContent>
            </Card>
            ))}
            
        
        </div>
    </ScrollArea>
  )
}
