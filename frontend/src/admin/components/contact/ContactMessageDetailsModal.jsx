import { Modal, Button } from "react-bootstrap";
import { format } from "date-fns";

export default function ContactMessageDetailsModal({ show, onClose, message }) {
  if (!message) return null;

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Message from {message.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <div className="text-secondary small">Email</div>
            <div className="fw-medium">{message.email}</div>
          </div>
          <div className="col-md-6">
            <div className="text-secondary small">Phone</div>
            <div className="fw-medium">{message.phone || "-"}</div>
          </div>
          <div className="col-md-6">
            <div className="text-secondary small">Destination</div>
            <div className="fw-medium">{message.destination || "-"}</div>
          </div>
          <div className="col-md-6">
            <div className="text-secondary small">Travel Date</div>
            <div className="fw-medium">
              {message.travelDate ? format(new Date(message.travelDate), "MMM dd, yyyy") : "-"}
            </div>
          </div>
          <div className="col-md-6">
            <div className="text-secondary small">Guests</div>
            <div className="fw-medium">{message.guests || "-"}</div>
          </div>
          <div className="col-md-6">
            <div className="text-secondary small">Budget</div>
            <div className="fw-medium">{message.budget || "-"}</div>
          </div>
          <div className="col-md-12">
            <div className="text-secondary small">Subject</div>
            <div className="fw-medium">{message.subject || "-"}</div>
          </div>
        </div>

        <div className="text-secondary small mb-1">Message</div>
        <div className="border rounded p-3" style={{ whiteSpace: "pre-wrap" }}>
          {message.message}
        </div>

        <div className="text-secondary small mt-3">
          Received {format(new Date(message.createdAt), "MMM dd, yyyy 'at' h:mm a")}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}