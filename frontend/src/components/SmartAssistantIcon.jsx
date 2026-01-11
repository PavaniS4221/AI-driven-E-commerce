import React from "react"
import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"

const SmartAssistantIcon = () => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate("/smartassistance")}
      className="fixed bottom-6 right-6 z-50 cursor-pointer group"
    >
      {/* Icon */}
      <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg 
                      hover:scale-110 transition">
        <img
          src={assets.smartAssistant_icon} // add icon here
          alt="Smart Assistant"
          className="w-7"
        />
      </div>

      {/* Tooltip */}
      <span className="absolute bottom-16 right-0 bg-black text-white text-xs px-3 py-1 
                       rounded opacity-0 group-hover:opacity-100 transition">
        Smart Assistant
      </span>
    </div>
  )
}

export default SmartAssistantIcon
