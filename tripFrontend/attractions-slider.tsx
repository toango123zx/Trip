// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import { ChevronLeft, ChevronRight, Star, Eye } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"

// export default function AttractionsSlider() {
//   const attractions = [
//     {
//       id: 1,
//       image: "/placeholder.svg?height=200&width=300",
//       title: "Taman Nasional Komodo",
//       regularPrice: "180,000",
//       salePrice: "165,000",
//       currency: "VND",
//       rating: 4.5,
//       views: 4323,
//     },
//     {
//       id: 2,
//       image: "/placeholder.svg?height=200&width=300",
//       title: "Taman Nasional Bunaken",
//       regularPrice: "180,000",
//       salePrice: "165,000",
//       currency: "VND",
//       rating: 4.5,
//       views: 4323,
//     },
//     {
//       id: 3,
//       image: "/placeholder.svg?height=200&width=300",
//       title: "Raja Ampat, Papua Barat",
//       regularPrice: "180,000",
//       salePrice: "165,000",
//       currency: "VND",
//       rating: 4.5,
//       views: 4323,
//     },
//     {
//       id: 4,
//       image: "/placeholder.svg?height=200&width=300",
//       title: "Bali, Indonesia",
//       regularPrice: "180,000",
//       salePrice: "165,000",
//       currency: "VND",
//       rating: 4.5,
//       views: 4323,
//     },
//   ]

//   const [currentIndex, setCurrentIndex] = useState(0)
//   const maxIndex = attractions.length - (window.innerWidth >= 768 ? 3 : 1)

//   const handlePrev = () => {
//     setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))
//   }

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex))
//   }

//   return (
//     <section className="py-16 px-4 md:px-8 lg:px-16">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-end mb-10">
//           <div>
//             <span className="text-orange-500 font-medium">Top Attractions</span>
//             <h2 className="text-3xl font-bold mt-1">Discover your love</h2>
//           </div>
//           <div className="flex space-x-2">
//             <Button
//               variant="outline"
//               size="icon"
//               className="rounded-full"
//               onClick={handlePrev}
//               disabled={currentIndex === 0}
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </Button>
//             <Button
//               variant="default"
//               size="icon"
//               className="rounded-full bg-orange-500 hover:bg-orange-600"
//               onClick={handleNext}
//               disabled={currentIndex >= maxIndex}
//             >
//               <ChevronRight className="h-5 w-5" />
//             </Button>
//           </div>
//         </div>

//         <div className="relative overflow-hidden">
//           <div
//             className="flex transition-transform duration-300 ease-in-out"
//             style={{ transform: `translateX(-${currentIndex * (100 / (window.innerWidth >= 768 ? 3 : 1))}%)` }}
//           >
//             {attractions.map((attraction) => (
//               <div key={attraction.id} className="w-full md:w-1/3 flex-shrink-0 px-2">
//                 <Card className="overflow-hidden border">
//                   <div className="relative h-48 w-full">
//                     <Image
//                       src={attraction.image || "/placeholder.svg"}
//                       alt={attraction.title}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <CardContent className="pt-4">
//                     <h3 className="font-medium">{attraction.title}</h3>
//                     <div className="flex items-center mt-2">
//                       <p className="text-gray-500 line-through text-sm">
//                         {attraction.currency} {attraction.regularPrice}
//                       </p>
//                       <p className="ml-2 text-orange-500 font-medium">
//                         {attraction.currency} {attraction.salePrice}
//                       </p>
//                     </div>
//                   </CardContent>
//                   <CardFooter className="flex justify-between items-center pt-0">
//                     <div className="flex items-center">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`h-4 w-4 ${
//                             i < Math.floor(attraction.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <div className="flex items-center text-sm text-gray-500">
//                       <Eye className="h-4 w-4 mr-1" />
//                       {attraction.views}
//                     </div>
//                   </CardFooter>
//                 </Card>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
