import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="text-center text-white px-2 max-w-2xl">
        <h1 className="text-6xl font-bold mb-6">
          TGC Know
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          find the cards you have always wanted!
        </p>
        <Button size="lg" variant="default">
            <a href="#find">Find Cards!</a>
        </Button>
        
      </div>
    </div>
  )
}