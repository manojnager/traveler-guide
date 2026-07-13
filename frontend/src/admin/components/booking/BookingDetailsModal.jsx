import { Modal, Button } from "react-bootstrap";
import { format } from "date-fns";

import { getImageUrl } from "../../utils/image";
import BookingStatusBadge from "./BookingStatusBadge";

export default function BookingDetailsModal({ show, onClose, booking }) {
  if (!booking) return null;

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Booking #{booking.id}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex align-items-center gap-3 mb-4">
          <span
            className="avatar avatar-lg"
            style={{
              backgroundImage: booking.destination?.thumbnail
                ? `url(${getImageUrl(booking.destination.thumbnail)})`
                : undefined,
              backgroundColor: booking.destination?.thumbnail ? undefined : "#e6e7e9"
            }}
          />
          <div>
            <div className="fw-semibold fs-5">{booking.destination?.title}</div>
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <div className="text-secondary small">Customer</div>
            <div className="fw-medium">
              {booking.user?.firstName} {booking.user?.lastName}
            </div>
          </div>

          <div className="col-md-6">
            <div className="text-secondary small">Email</div>
            <div className="fw-medium">{booking.user?.email}</div>
          </div>

          <div className="col-md-6">
            <div className="text-secondary small">Phone</div>
            <div className="fw-medium">{booking.user?.phone || "-"}</div>
          </div>

          <div className="col-md-6">
            <div className="text-secondary small">Travel Date</div>
            <div className="fw-medium">
              {booking.travelDate ? format(new Date(booking.travelDate), "MMM dd, yyyy") : "-"}
            </div>
          </div>

          <div className="col-md-6">
            <div className="text-secondary small">Guests</div>
            <div className="fw-medium">{booking.guests}</div>
          </div>

          <div className="col-md-6">
            <div className="text-secondary small">Total Amount</div>
            <div className="fw-medium">${Number(booking.totalAmount).toFixed(2)}</div>
          </div>

          <div className="col-md-6">
            <div className="text-secondary small">Booked On</div>
            <div className="fw-medium">
              {booking.createdAt ? format(new Date(booking.createdAt), "MMM dd, yyyy 'at' h:mm a") : "-"}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}