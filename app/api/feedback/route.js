import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  console.log(`Incoming ${req.method} request`); // log method

  if (req.method === "POST") {
    const { name, rating, comment } = req.body;
    console.log("POST body received:", req.body); // log request body

    // Basic validation
    if (!name || !rating || !comment) {
      console.log("Validation failed: missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const feedback = await prisma.feedback.create({
        data: { name, rating, comment },
      });
      console.log("Feedback created:", feedback); // log success
      return res.status(201).json(feedback);
    } catch (err) {
      console.error("Prisma error on POST:", err); // log full error
      return res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
  } else if (req.method === "GET") {
    try {
      const feedbacks = await prisma.feedback.findMany({
        orderBy: { createdAt: "desc" },
      });
      console.log("Fetched feedbacks:", feedbacks.length); // log number of records
      return res.status(200).json(feedbacks);
    } catch (err) {
      console.error("Prisma error on GET:", err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
  } else {
    console.log("Method not allowed:", req.method);
    return res.status(405).json({ message: "Method not allowed" });
  }
}
