import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function FeedbackModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!name || !rating || !comment) return alert("All fields are required");

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating, comment }),
    });

    if (res.ok) {
      const data = await res.json();
      onSuccess(data);
      setName("");
      setRating(0);
      setComment("");
      onClose();
    } else {
      alert("Failed to submit feedback");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
      >
        <h3
          className="text-gray-900 font-bold text-lg mb-4 text-center"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          أضف رأيك
        </h3>

        <input
          type="text"
          placeholder="اسمك"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-green-200 rounded-lg px-3 py-2 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <div className="flex justify-center items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              className={`cursor-pointer ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <textarea
          placeholder="اكتب رأيك هنا..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-green-200 rounded-lg px-3 py-2 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          rows={4}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            إرسال
          </button>
        </div>
      </motion.div>
    </div>
  );
}
