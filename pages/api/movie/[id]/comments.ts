import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

/**
 * @swagger
 * /api/movies/{id}/comments:
 *   get:
 *     tags: [Comments]
 *     description: Retrieves comments for a specified movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie to retrieve comments for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of comments for the movie
 *       400:
 *         description: Movie ID is required
 *       404:
 *         description: No comments found for this movie
 *       500:
 *         description: Server error while retrieving comments
 *   post:
 *     tags: [Comments]
 *     description: Posts a new comment for a specified movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the movie to post a comment for
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the person posting the comment
 *               text:
 *                 type: string
 *                 description: The comment text
 *             required:
 *               - name
 *               - text
 *     responses:
 *       201:
 *         description: Comment added
 *       400:
 *         description: Movie ID is required for posting a comment
 *       500:
 *         description: Failed to add comment
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
      case "POST":
        if (!id) {
          return res.status(400).json({ error: "Movie ID is required for posting a comment." });
        }
    
        const newComment = {
          ...req.body,
          movie_id: new ObjectId(id),
          date: new Date()
        };
      
        try {
          const result = await db.collection("comments").insertOne(newComment);
          return res
            .status(201)
            .json({ status: 201, message: "Comment added", data: result });
        } catch (error) {
          return res.status(500).json({
            status: 500,
            message: "Failed to add comment",
          });
        }
      
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}



//post
