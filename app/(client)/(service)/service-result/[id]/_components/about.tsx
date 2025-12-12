import React, { useEffect, useState } from "react";

export default function About({ instructor, isExpanded, setIsExpanded }) {
  const [showReadMore, setShowReadMore] = useState(false);

  useEffect(() => {
    // Check if text is more than 50 words
    const wordCount = instructor.about?.split(/\s+/).length || 0;
    setShowReadMore(wordCount > 50);
  }, [instructor.about]);

  return (
    <div>
      <div>
        <h2 className="font-medium text-2xl text-[#070707] mt-8 mb-4">
          About Me
        </h2>
        <div className="relative">
          <p
            className={`text-[#4A4C56] md:text-xl font-normal ${
              !isExpanded && showReadMore && "line-clamp-3"
            }`}
          >
            {instructor.about}
          </p>
          {showReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#20B894] text-sm font-medium hover:text-emerald-700 mt-2"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
