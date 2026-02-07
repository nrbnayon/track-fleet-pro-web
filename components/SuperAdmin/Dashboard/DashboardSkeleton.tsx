
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="animate-in fade-in zoom-in duration-300">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-white px-5 py-6 rounded-lg flex items-start justify-between h-[120px] shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] border-none"
          >
             <div className="flex flex-col justify-center gap-3 w-full">
               <Skeleton className="h-4 w-24 bg-gray-100" /> {/* Title */}
               <Skeleton className="h-9 w-16 bg-gray-100" /> {/* Value */}
             </div>
             <Skeleton className="h-14 w-14 rounded-lg bg-gray-100 shrink-0" /> {/* Icon */}
          </div>
        ))}
      </div>
      
      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Recent Parcels Skeleton */}
         <div className="lg:col-span-2 bg-white p-6 rounded-xl h-full min-h-[400px] shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
             <div className="flex justify-between items-center mb-6">
               <Skeleton className="h-7 w-40 bg-gray-100" /> {/* Title */}
               <Skeleton className="h-9 w-32 bg-gray-100" /> {/* Filter */}
             </div>
             <div className="space-y-4">
               {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center p-3">
                     <Skeleton className="h-10 w-10 rounded-lg bg-gray-100 mr-4 shrink-0" />
                     <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32 bg-gray-100" />
                        <Skeleton className="h-3 w-24 bg-gray-100" />
                     </div>
                     <Skeleton className="h-6 w-20 rounded-full bg-gray-100" />
                  </div>
               ))}
             </div>
         </div>
         
         {/* Active Drivers Skeleton */}
         <div className="lg:col-span-1 bg-white p-6 rounded-xl h-full min-h-[400px] shadow-[6px_6px_54px_0px_rgba(0,0,0,0.08)]">
             <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-7 w-36 bg-gray-100" />
             </div>
             <div className="space-y-4">
               {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center p-3">
                     <Skeleton className="h-10 w-10 rounded-lg bg-gray-100 mr-4 shrink-0" />
                     <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32 bg-gray-100" />
                        <Skeleton className="h-3 w-20 bg-gray-100" />
                     </div>
                     <Skeleton className="h-6 w-16 rounded-full bg-gray-100" />
                  </div>
               ))}
             </div>
         </div>
      </div>
    </div>
  )
}
