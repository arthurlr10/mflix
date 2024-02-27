import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

export default async function handler(req: any, res: any) {
  const {
    query: { id },
  } = req;

  const client = await clientPromise;
  const db = client.db("sample_mflix");

  switch (req.method) {
    case "GET":
      try {
        if (!id) {
          return res.status(400).json({ error: "Movie ID is required." });
        }
        const comments = await db
          .collection("comments")
          .find({
            movie_id: new ObjectId(id),
          })
          .toArray();
        if (comments.length > 0) {
          res.status(200).json(comments);
        } else {
          res.status(404).json({ error: "No comments found for this movie." });
        }
      } catch (error) {
        res.status(500).json({
          error: "Server error while retrieving comments.",
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
