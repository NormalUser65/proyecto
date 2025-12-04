import * as React from "react";

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`border rounded-md p-2 w-full ${className}`}
      {...props}
    />
  );
}