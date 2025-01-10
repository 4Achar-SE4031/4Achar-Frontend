// AdvertisementCard.tsx
import React from "react";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import "./Ads.css";

interface AdProps {
    title?: string;
    description?: string;
    linkUrl?: string;
    linkText?: string;
    imageUrl?: string;
    height?: string | number; // Added height prop
    class_name?: string; // Added className for additional styling flexibility
}

const AdvertisementCard: React.FC<AdProps> = ({
    title = "Experience Innovation",
    description = "Discover groundbreaking solutions that transform the way you live and work. Join millions of satisfied customers worldwide.",
    linkUrl = "#",
    linkText = "Learn More",
    imageUrl = "/api/placeholder/800/400",
    height,
    class_name = "",
}) => {
    return (
        <div className={`max-w-4xl mx-auto ${class_name}`}>
            {/* CTA Button */}
            <a
                href={linkUrl}
                className="ads_link inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-lg font-semibold text-gray-900 transition-all duration-300 hover:bg-blue-500 hover:text-white hover:scale-105 hover:shadow-lg active:scale-95"
                dir="rtl"
                target="_blank"
            >
                <div
                    className="ad-card group relative overflow-hidden rounded-xl bg-white shadow-xl transition-all hover:shadow-2xl"
                    style={{ height: height }}
                >
                    {/* Image Container with Overlay */}
                    <div className="relative h-96 overflow-hidden">
                        <img
                            src={imageUrl}
                            alt="Advertisement"
                            className="ad-image h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    {/* Content Container */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h2 className="mb-4 text-4xl font-bold text-white tracking-tight">
                            {title}
                        </h2>
                    </div>
                    <div id="descriptionContainer" className="link-container">
                        <span className="rtl:text-right" dir="rtl">
                            {linkText}
                        </span>
                        <ChevronLeft className="chevron-icon h-5 w-5" />
                    </div>
                </div>
            </a>
        </div>
    );
};

export default AdvertisementCard;
