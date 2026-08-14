import { useEffect, useRef, useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay } from "date-fns";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";

import api from "../../services/api";
import "./BookingCalendar.css";

export default function BookingCalendar({ destinationId, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const loadBlockedDates = async () => {
      try {
        const response = await api.get(`/destinations/${destinationId}/blocked-dates`);
        setBlockedDates(response.data.data.map((d) => d.date));
      } catch {
        setBlockedDates([]);
      }
    };

    if (destinationId) loadBlockedDates();
  }, [destinationId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isBlocked = (day) => blockedDates.some((d) => isSameDay(new Date(d), day));
  const isPast = (day) => isBefore(day, startOfDay(new Date()));
  const selectedDate = value ? new Date(value) : null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = monthStart.getDay();

  const handleSelect = (day) => {
    if (isPast(day) || isBlocked(day)) return;
    onChange(format(day, "yyyy-MM-dd"));
    setOpen(false);
  };

  return (
    <div className="booking-calendar-wrapper" ref={wrapperRef}>
      <button type="button" className="booking-calendar-trigger" onClick={() => setOpen((prev) => !prev)}>
        <FaCalendarAlt />
        <span>{selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select a date"}</span>
      </button>

      {open && (
        <div className="booking-calendar-popover">
          <div className="booking-calendar-header">
            <button type="button" onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}>
              <FaChevronLeft />
            </button>
            <strong>{format(currentMonth, "MMMM yyyy")}</strong>
            <button type="button" onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}>
              <FaChevronRight />
            </button>
          </div>

          <div className="booking-calendar-weekdays">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="booking-calendar-grid">
            {Array.from({ length: startPadding }).map((_, i) => (
              <span key={`pad-${i}`} />
            ))}

            {days.map((day) => {
              const past = isPast(day);
              const blocked = isBlocked(day);
              const selected = selectedDate && isSameDay(day, selectedDate);
              const disabled = past || blocked;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(day)}
                  className={`booking-calendar-day ${selected ? "is-selected" : ""} ${blocked && !past ? "is-blocked" : ""}`}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          <div className="booking-calendar-legend">
            <span><i className="legend-dot legend-selected" /> Selected</span>
            <span><i className="legend-dot legend-blocked" /> Unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
}