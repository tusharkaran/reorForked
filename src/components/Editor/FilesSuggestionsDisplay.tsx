import { removeFileExtension } from "@/functions/strings";
import React, { useRef, useEffect, useState, useMemo } from "react";

export interface SuggestionsState {
  textWithinBrackets: string;
  position: { top: number; left: number };
  onSelect: (suggestion: string) => void;
}

interface SuggestionsDisplayProps {
  suggestionsState: SuggestionsState;
  suggestions: string[];
  maxWidth?: string;
  isInEditor?: boolean;
}

const FilesSuggestionsDisplay: React.FC<SuggestionsDisplayProps> = ({
  suggestionsState,
  suggestions,
  maxWidth = "max-w-sm",
  isInEditor = true,
}) => {
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState({
    top: -9999,
    left: -9999,
    display: "none",
  });

  const filteredSuggestions = useMemo(() => {
    if (!suggestionsState.textWithinBrackets) return [];
    const lowerCaseText = suggestionsState.textWithinBrackets.toLowerCase();
    return suggestions
      .filter((suggestion) => suggestion.toLowerCase().includes(lowerCaseText))
      .map(removeFileExtension)
      .slice(0, 5);
  }, [suggestions, suggestionsState.textWithinBrackets]);

  useEffect(() => {
    if (
      !suggestionsState.position ||
      filteredSuggestions.length === 0 ||
      !suggestionsRef.current
    ) {
      return;
    }
    const { top, left } = suggestionsState.position;
    const { height } = suggestionsRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const shouldDisplayAbove = top + height > viewportHeight && top > height;

    console.log("layout: ", {
      top: shouldDisplayAbove ? top - height : top,
      left: left,
      display: "block",
    })
    setLayout({
      top: shouldDisplayAbove ? top - height : top,
      left: left,
      display: "block",
    });
  }, [suggestionsState.position, filteredSuggestions]);

  if (filteredSuggestions.length === 0) return null;

  return (
    <div
      ref={suggestionsRef}
      className={`absolute rounded bg-white text-black ${maxWidth} border border-black  z-50 break-words whitespace-normal`}
      style={{
        // should only use this when you need in editor
        left: isInEditor ? `${layout.left}px` : 0,
        top: `${layout.top}px`,
        display: layout.display,
      }}
    >
      <ul className="m-0 p-0 list-none">
        {filteredSuggestions.map((suggestion) => (
          <li
            key={suggestion} // Use a unique id property from the suggestion
            className="p-1.25 cursor-pointer hover:bg-gray-100 p-1 text-sm rounded"
            onClick={() => {
              suggestionsState.onSelect?.(suggestion);
            }}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilesSuggestionsDisplay;
