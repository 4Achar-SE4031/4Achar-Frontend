import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ExpandablePrice = ({ prices = [700000, 850000, 1000000] }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [popoverPosition, setPopoverPosition] = useState({
        top: 0,
        right: 0,
    });
    const triggerRef = useRef(null);
    const popoverRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(event.target)
            ) {
                setIsExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isExpanded && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPopoverPosition({
                top: rect.bottom + window.scrollY,
                right: window.innerWidth - rect.right,
            });
        }
    }, [isExpanded]);

    return (
        <div
            style={{
                display: "flex",
                textAlign: "right",
                right: 0,
                position: "relative",
            }}
            ref={triggerRef}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius: "0.5rem",
                    transition: "colors",
                    color: "#b3b3b3",
                }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <i
                    style={{
                        marginLeft: "0.5rem",
                        color: "#b3b3b3",
                    }}
                    className="bi bi-tag-fill"
                ></i>
                
                <span style={{ color: "#b3b3b3" }}>
                    از {prices[0].toLocaleString()} تومان
                </span>
                {isExpanded ? (
                    <ChevronUp
                        style={{
                            width: "1.25rem",
                            height: "1.25rem",
                            color: "#6B7280",
                            marginRight: "0.5rem",
                        }}
                    />
                ) : (
                    <ChevronDown
                        style={{
                            width: "1.25rem",
                            height: "1.25rem",
                            color: "#6B7280",
                            marginRight: "0.5rem",
                        }}
                    />
                )}
            </div>

            {isExpanded && (
                <div
                    ref={popoverRef}
                    style={{
                        position: "absolute", // Changed from "fixed" to "absolute"
                        width: "16rem",
                        backgroundColor: "white",
                        borderRadius: "0.5rem",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        border: "1px solid #E5E7EB",
                        top: "100%", // Changed to position it below the trigger
                        right: 0, // Align with the right edge of the parent
                        zIndex: 50,
                    }}
                >
                    <div
                        style={{
                            padding: "0.75rem",
                            gap: "0.5rem",
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "#646977",
                        }}
                    >
                        {prices.map((price, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "0.5rem",
                                    borderRadius: "0.375rem",
                                    textAlign: "right",
                                }}
                            >
                                <span
                                    style={{
                                        fontWeight: 500,
                                        color: "#1F2937",
                                        textAlign: "right",
                                    }}
                                >
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
