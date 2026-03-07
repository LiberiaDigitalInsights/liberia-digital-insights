"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/cn";

const TabsContext = createContext();

export function Tabs({
  defaultValue,
  onValueChange,
  className,
  children,
  tabs,
  value: controlledValue,
  onChange,
}) {
  const [internalValue, setInternalValue] = useState(
    defaultValue || controlledValue,
  );
  const activeValue =
    controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (newValue) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
    onChange?.(newValue);
  };

  // Legacy Pattern Support (e.g. EventsPage, TagPage)
  if (tabs && !children) {
    return (
      <TabsContext.Provider
        value={{ value: activeValue, setValue: handleValueChange }}
      >
        <div className={cn("w-full", className)}>
          <TabsList className="mb-8 w-full justify-start md:justify-center border-b border-border rounded-none bg-transparent overflow-x-auto flex-nowrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "border-b-2 rounded-none px-4 py-2 transition-all duration-300",
                  activeValue === tab.value
                    ? "border-brand-500 bg-transparent text-brand-500 font-bold"
                    : "border-transparent bg-transparent text-muted hover:text-text",
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </TabsContext.Provider>
    );
  }

  return (
    <TabsContext.Provider
      value={{ value: activeValue, setValue: handleValueChange }}
    >
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
