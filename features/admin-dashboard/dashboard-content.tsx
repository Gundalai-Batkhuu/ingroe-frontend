import { MoreHorizontal, User } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function AdminDashboardContent() {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        {/* Left Panel */}
        <div className="w-full md:w-1/3 space-y-4">
          <div className="aspect-square bg-gray-200 rounded-full flex items-center justify-center">
            <div className="w-3/4 h-3/4 border-8 border-gray-300 rounded-full"></div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex justify-between items-center">
                <div className="w-1/2 h-2 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-2 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-2/3 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="w-1/3 h-2 bg-gray-300 rounded"></div>
            <div className="flex space-x-2">
              <div className="w-8 h-2 bg-gray-300 rounded"></div>
              <div className="w-8 h-2 bg-gray-300 rounded"></div>
              <div className="w-8 h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((item) => (
                <TableRow key={item}>
                  <TableCell>
                    <User className="w-6 h-6 text-gray-400" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="w-1/4 h-2 bg-gray-300 rounded"></div>
                      <div className="w-1/2 h-2 bg-gray-200 rounded"></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  </TableCell>
                  <TableCell>
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              <div className="w-8 h-2 bg-gray-300 rounded"></div>
              <div className="w-8 h-2 bg-gray-300 rounded"></div>
            </div>
            <div className="flex space-x-2">
              <div className="w-8 h-2 bg-gray-300 rounded"></div>
              <div className="w-8 h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((card) => (
          <Card key={card}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="relative w-10 h-10 overflow-hidden rounded-full">
                <Image
                  src={`/placeholder.svg?height=40&width=40`}
                  alt="Placeholder image"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="w-6 h-2 bg-gray-300 rounded"></div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="w-3/4 h-2 bg-gray-300 rounded"></div>
              <div className="w-full h-2 bg-gray-300 rounded"></div>
              <div className="w-5/6 h-2 bg-gray-300 rounded"></div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="w-16 h-6"></Button>
              <Button className="w-16 h-6"></Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}