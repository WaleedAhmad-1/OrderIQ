import React from 'react';
import { MapPin, Star, Clock } from 'lucide-react';

const MapView = ({ restaurants }) => {
  return (
    <div className="relative w-full h-[600px] bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-[#f8f9fa]">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        {/* Mock Map Elements */}
        <div className="absolute top-1/4 left-1/3 w-64 h-2 bg-neutral-200 rounded-full rotate-45 transform-gpu opacity-50"></div>
        <div className="absolute top-2/3 left-1/4 w-80 h-2 bg-neutral-200 rounded-full -rotate-12 transform-gpu opacity-50"></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-2 bg-neutral-200 rounded-full 90 transform-gpu opacity-50"></div>
      </div>

      {/* Mock Markers */}
      {restaurants.map((restaurant, index) => (
        <div
          key={restaurant.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{
            top: `${20 + (index * 15) % 60}%`,
            left: `${15 + (index * 25) % 70}%`,
          }}
        >
          {/* Marker Icon */}
          <div className="relative">
            <div className="p-2 bg-primary-600 text-white rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200 ring-4 ring-white">
               <MapPin className="w-5 h-5" />
            </div>
            
            {/* Tooltip/Card on Hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              <div className="bg-white rounded-xl shadow-2xl p-3 w-48 border border-neutral-100">
                <img 
                  src={restaurant.image} 
                  alt={restaurant.name} 
                  className="w-full h-20 object-cover rounded-lg mb-2"
                />
                <h4 className="font-bold text-sm text-neutral-900 truncate">{restaurant.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-bold ml-1">{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center text-neutral-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="text-[10px]">{restaurant.deliveryTime}</span>
                  </div>
                </div>
              </div>
              {/* Tooltip Arrow */}
              <div className="w-3 h-3 bg-white border-r border-b border-neutral-100 transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
            </div>
          </div>
        </div>
      ))}

      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <div className="bg-white p-2 rounded-lg shadow-md border border-neutral-200">
          <div className="w-8 h-8 flex items-center justify-center font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer">+</div>
          <div className="h-px bg-neutral-100 w-full"></div>
          <div className="w-8 h-8 flex items-center justify-center font-bold text-neutral-600 hover:bg-neutral-50 cursor-pointer">−</div>
        </div>
      </div>

      {/* Legend / Info */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-neutral-200 max-w-xs">
        <h3 className="font-bold text-neutral-900 mb-1">Explore Nearby</h3>
        <p className="text-xs text-neutral-500">Showing {restaurants.length} restaurants in your current area.</p>
      </div>
    </div>
  );
};

export default MapView;
