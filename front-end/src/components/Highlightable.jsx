import React, { useState, useEffect } from 'react';

export const Highlightable = ({ highlight, children }) => {
  const [newChild, setNewChild] = useState([]);

  useEffect(() => {
    if (highlight) {
      const regEscape = (v) => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const searchRegex = new RegExp(regEscape(highlight), "ig");

      // Function to generate substrings longer than 3 characters
      const generateSubstrings = (str) => {
        let substrings = [];
        for (let i = 0; i < str.length; i++) {
          for (let j = i + 4; j <= str.length; j++) {
            substrings.push(str.slice(i, j));
          }
        }
        return substrings;
      };

      let parts = [children];
      let exactMatchFound = false;

      // Check for exact match
      let newParts = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          let lastIndexOfMatch = 0;
          let match;

          while ((match = searchRegex.exec(part))) {
            exactMatchFound = true;
            newParts.push(part.slice(lastIndexOfMatch, match.index));
            newParts.push(
              <span key={`${match.index}-${searchRegex.source}`} className="bg-[#6C63FF] py-[1px] shadow-md text-white">
                {match[0]}
              </span>
            );
            lastIndexOfMatch = searchRegex.lastIndex;
          }

          newParts.push(part.slice(lastIndexOfMatch));
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;

      // If no exact matches, highlight substrings
      if (!exactMatchFound) {
        const substrings = generateSubstrings(highlight).map(sub => new RegExp(regEscape(sub), "ig"));

        parts = [children];
        substrings.forEach(regex => {
          let newParts = [];
          parts.forEach(part => {
            if (typeof part === 'string') {
              let lastIndexOfMatch = 0;
              let match;

              while ((match = regex.exec(part))) {
                newParts.push(part.slice(lastIndexOfMatch, match.index));
                newParts.push(
                  <span key={`${match.index}-${regex.source}`} className="bg-[#6C63FF] py-[1px] shadow-md text-white">
                    {match[0]}
                  </span>
                );
                lastIndexOfMatch = regex.lastIndex;
              }

              newParts.push(part.slice(lastIndexOfMatch));
            } else {
              newParts.push(part);
            }
          });
          parts = newParts;
        });
      }

      setNewChild(parts);
    } else {
      setNewChild(children);
    }
  }, [highlight, children]);

  return <span>{newChild}</span>;
};
