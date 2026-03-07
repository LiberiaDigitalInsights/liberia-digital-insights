"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/cn";

const TabsContext = createContext();

export function Tabs({ defaultValue, onValueChange, className, children }) {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, setValue: handleValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value: triggerValue, className, children }) {
  const { value, setValue } = useContext(TabsContext);
  const isActive = value === triggerValue;

  return (
    <button
      onClick={() => setValue(triggerValue)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-brand-500 text-white shadow-sm"
          : "hover:bg-brand-500/10 hover:text-brand-500",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value: contentValue, className, children }) {
  const { value } = useContext(TabsContext);
  if (value !== contentValue) return null;

  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
