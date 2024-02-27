import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

/**
 * @swagger
 * /api/movies/{id}/comments:
 *   get:
 *     summary: Retrieve comments for a movie
 *     description: Returns a list of comments associated with a given movie ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ID of the movie to retrieve comments for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of comments associated with the movie.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the commenter.
 *                   text:
 *                     type: string
 *                     description: The comment text.
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: The date of the comment.
 *       400:
 *         description: Movie ID is required.
 *       404:
 *         description: No comments found for this movie.
 *       500:
 *         description: Server error while retrieving comments.
 */
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
