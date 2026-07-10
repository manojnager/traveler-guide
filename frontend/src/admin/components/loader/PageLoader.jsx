import { PulseLoader } from "react-spinners";

export default function PageLoader() {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <PulseLoader color="#206bc4" size={12} />
    </div>
  );
}