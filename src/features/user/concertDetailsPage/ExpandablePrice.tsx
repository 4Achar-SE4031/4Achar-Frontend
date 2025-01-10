import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ExpandablePrice = ({ prices = [700000, 850000, 1000000] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, right: 0 });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isExpanded && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopoverPosition({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right
      });
    }
  }, [isExpanded]);

  return (
    <div className="inline-block" ref={triggerRef}>
      <div 
        className="flex items-center cursor-pointer rounded-lg hover:bg-gray-100 transition-colors text-right"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{color:"#b3b3b3"}}
      >
        <i className="bi bi-tag-fill ml-2 text-gray-600"></i>
        <span className="text-gray-700">
          از {prices[0].toLocaleString()} تومان
        </span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500 mr-2" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 mr-2" />
        )}
      </div>
      
      {isExpanded && (
        <div
          ref={popoverRef}
          className="fixed w-64 bg-white rounded-lg shadow-lg border border-gray-200"
          style={{
            top: `${popoverPosition.top}px`,
            right: `${popoverPosition.right}px`,
            zIndex: 50
          }}
        >
          <div className="p-3 space-y-2"
                style={{backgroundColor:"#646977"}}>

            {prices.map((price, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md text-right">
                <span className="font-medium text-gray-800 text-right">
                  {price.toLocaleString()} تومان
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandablePrice;