import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function GlobalSVGProvider() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  const svgContentCode = (
    <svg xmlns="http://www.w3.org/2000/svg">
      <symbol id="ic-back" viewBox="0 0 24 24">
        <path
          fill="#fff"
          d="M7 12.405c.006-.194.044-.371.116-.531.072-.16.183-.316.332-.465l8.318-8.052c.238-.238.53-.357.88-.357.232 0 .442.055.63.166.194.11.346.26.457.448a1.241 1.241 0 0 1-.216 1.536l-7.52 7.246 7.52 7.255c.26.266.39.568.39.905 0 .238-.058.451-.174.64-.11.188-.263.337-.457.448a1.177 1.177 0 0 1-.63.174c-.35 0-.642-.122-.88-.365L7.448 13.4a1.514 1.514 0 0 1-.34-.465 1.322 1.322 0 0 1-.108-.53z"
        />
      </symbol>
      <symbol id="ic-more" viewBox="0 0 24 24">
        <path
          stroke="#F7F8F9"
          stroke-width="1.5"
          d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
        />
        <path
          fill="#F7F8F9"
          d="M9 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
        />
      </symbol>
    </svg>
  );

  // Render the SVG content into the document body using createPortal
  return createPortal(svgContentCode, document.body);
}
