import { motion } from "framer-motion";

export default function CarCard({ car, onDelete }) {
  return (
    <motion.div
      className="car-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3>
        {car.year} {car.make} {car.model}
      </h3>
      <p><strong>Transmission:</strong> {car.transmission}</p>
      <p><strong>Body Style:</strong> {car.bodyStyle}</p>
      {car.notes && <p className="notes">{car.notes}</p>}

      <button className="delete-btn" onClick={() => onDelete(car.id)}>
        Delete
      </button>
    </motion.div>
  );
}