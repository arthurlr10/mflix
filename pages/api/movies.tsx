import { AnyARecord } from "dns";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

/**
  * @swagger
  * /api/movies:
  *   get:
  *     tags: [Movies]
  *     description: Returns movies
  *     responses:
  *       200:
  *         description: Hello Movies
  *   post:
  *     tags: [Movies]
  *     summary: Add a new movie
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               title:
  *                 type: string
  *               year:
  *                 type: integer
  *               genres:
  *                 type: array
  *                 items:
  *                   type: string
  *     responses:
  *       201:
  *         description: Movie added
  *       500:
  *         description: Failed to add movie
  */
export default async function handler(req: any, res: any) {
  const client = await clientPromise;
  const db = client.db("sample_mflix");

  switch (req.method) {
    case "GET":
      try {
        const movies = await db
          .collection("movies")
          .find({})
          .limit(10)
          .toArray();
        res.json({ status: 200, data: movies });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: 500,
          message: "Failed to delete comment",
        });
      }

      break;
      case "POST":
        const newMovie = req.body;
        try {
          const result = await db.collection("movies").insertOne(newMovie);
          return res
            .status(201)
            .json({ status: 201, message: "Movie added", data: result });
        } catch (error) {
          return res.status(500).json({
            status: 500,
            message: "Failed to add movie",
          });
        }
  }
}
