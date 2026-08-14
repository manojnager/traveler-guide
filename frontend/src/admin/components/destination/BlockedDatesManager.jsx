import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { IconX } from "@tabler/icons-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay } from "date-fns";

import { getBlockedDates, addBlockedDate, removeBlockedDate } from "../../services/blockedDateService";

export default function BlockedDatesManager({ destinationId }) {
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchBlockedDates = async () => {
    setLoading(true);
    try {
      const data = await getBlockedDates(destinationId);
      setBlockedDates(data);
    } catch {
      toast.error("Failed to load blocked dates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destinationId) fetchBlockedDates();
  }, [destinationId]);

  const isBlocked = (day) => blockedDates.some((b) => isSameDay(new Date(b.date), day));
  const getBlockedEntry = (day) => blockedDates.find((b) => isSameDay(new Date(b.date), day));

  const handleDayClick = async (day) => {
    if (isBefore(day, startOfDay(new Date()))) return;

    const existing = getBlockedEntry(day);

    if (existing) {
      const result = await Swal.fire({
        title: "Unblock this date?",
        text: format(day, "MMMM d, yyyy"),
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Unblock",
        cancelButtonText: "Cancel"
      });

      if (!result.isConfirmed) return;

      try {
        await removeBlockedDate(existing.id);
        setBlockedDates((prev) => prev.filter((b) => b.id !== existing.id));
        toast.success("Date unblocked.");
      } catch {
        toast.error("Failed to unblock date.");
      }
    } else {
      try {
        const created = await addBlockedDate(destinationId, { date: format(day, "yyyy-MM-dd") });
        setBlockedDates((prev) => [...prev, created]);
        toast.success("Date blocked.");
      } catch (error) {
        const message = error.response?.data?.message || "Failed to block date.";
        toast.error(message);
      }
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = monthStart.getDay();

  if (!destinationId) {
    return <p className="text-secondary">Save the destination first to manage blocked dates.</p>;
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}>
          ‹
        </button>
        <strong>{format(currentMonth, "MMMM yyyy")}</strong>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}>
          ›
        </button>
      </div>

      {loading ? (
        <p className="text-secondary">Loading calendar...</p>
      ) : (
        <>
          <div className="d-grid" style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d} className="text-center text-secondary small fw-bold py-1">{d}</div>
            ))}

            {Array.from({ length: startPadding }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}

            {days.map((day) => {
              const blocked = isBlocked(day);
              const past = isBefore(day, startOfDay(new Date()));

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={past}
                  onClick={() => handleDayClick(day)}
                  className="btn btn-sm"
                  style={{
                    aspectRatio: "1",
                    padding: 0,
                    backgroundColor: blocked ? "#d63939" : past ? "transparent" : "#f4f6f8",
                    color: blocked ? "#fff" : past ? "#c0c5cc" : "#1a1d21",
                    border: "1px solid #e6e7e9",
                    cursor: past ? "not-allowed" : "pointer"
                  }}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          <div className="d-flex align-items-center gap-3 mt-3 small text-secondary">
            <span className="d-flex align-items-center gap-1">
              <span style={{ width: 12, height: 12, background: "#d63939", borderRadius: 3, display: "inline-block" }} />
              Blocked
            </span>
            <span className="d-flex align-items-center gap-1">
              <span style={{ width: 12, height: 12, background: "#f4f6f8", border: "1px solid #e6e7e9", borderRadius: 3, display: "inline-block" }} />
              Available
            </span>
          </div>

          {blockedDates.length > 0 && (
            <div className="mt-4">
              <div className="text-secondary small mb-2">Blocked dates ({blockedDates.length})</div>
              <div className="d-flex flex-wrap gap-2">
                {blockedDates
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((b) => (
                    <span key={b.id} className="badge bg-red-lt text-red d-flex align-items-center gap-1">
                      {format(new Date(b.date), "MMM d, yyyy")}
                      <IconX
                        size={12}
                        style={{ cursor: "pointer" }}
                        onClick={async () => {
                          try {
                            await removeBlockedDate(b.id);
                            setBlockedDates((prev) => prev.filter((x) => x.id !== b.id));
                          } catch {
                            toast.error("Failed to unblock date.");
                          }
                        }}
                      />
                    </span>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}