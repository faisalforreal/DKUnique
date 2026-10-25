import * as React from "react";

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          "ios-src"?: string;
          poster?: string;
          alt?: string;
          "auto-rotate"?: boolean | string;
          "camera-controls"?: boolean | string;
          "camera-orbit"?: string;
          "field-of-view"?: string;
          ar?: boolean | string;
          "ar-modes"?: string;
          "environment-image"?: string;
          exposure?: string | number;
          "shadow-intensity"?: string | number;
          loading?: "auto" | "lazy" | "eager";
        },
        HTMLElement
      >;
    }
  }

  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          "ios-src"?: string;
          poster?: string;
          alt?: string;
          "auto-rotate"?: boolean | string;
          "camera-controls"?: boolean | string;
          "camera-orbit"?: string;
          "field-of-view"?: string;
          ar?: boolean | string;
          "ar-modes"?: string;
          "environment-image"?: string;
          exposure?: string | number;
          "shadow-intensity"?: string | number;
          loading?: "auto" | "lazy" | "eager";
        },
        HTMLElement
      >;
    }
  }
}
