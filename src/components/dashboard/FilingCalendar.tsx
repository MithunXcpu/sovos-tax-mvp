"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { FilingEvent } from "@/types/compliance";
import { formatCurrency, cn } from "@/lib/utils";
import { useState } from "react";

interface FilingCalendarProps {
  filingEvents: FilingEvent[];
}

const statusColors = {
  overdue: "bg-danger",
  due_soon: "bg-warning",
  upcoming: "bg-info",
  completed: "bg-success",
};

export function FilingCalendar({ filingEvents }: FilingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get events for a specific day
  const getEventsForDay = (day: number): FilingEvent[] => {
    return filingEvents.filter((event) => {
      const eventDate = new Date(event.dueDate);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  // Generate calendar days
  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Filing Calendar
        </h3>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost p-1.5" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium min-w-[140px] text-center">{monthName}</span>
          <button className="btn btn-ghost p-1.5" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs text-muted py-2 font-medium">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const events = day ? getEventsForDay(day) : [];
          return (
            <div
              key={index}
              className={cn(
                "min-h-[60px] p-1 rounded-lg border border-transparent",
                day && "hover:border-border cursor-pointer",
                isToday(day as number) && "bg-primary/10 border-primary/30"
              )}
            >
              {day && (
                <>
                  <div
                    className={cn(
                      "text-xs font-medium mb-1",
                      isToday(day) ? "text-primary" : "text-muted"
                    )}
                  >
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "text-xs px-1 py-0.5 rounded truncate text-white font-medium",
                          statusColors[event.status]
                        )}
                        title={`${event.jurisdictionName}: ${formatCurrency(event.estimatedAmount)}`}
                      >
                        {event.jurisdictionCode}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-muted text-center">
                        +{events.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-danger" />
          <span className="text-xs text-muted">Overdue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-warning" />
          <span className="text-xs text-muted">Due Soon</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-info" />
          <span className="text-xs text-muted">Upcoming</span>
        </div>
      </div>
    </div>
  );
}
