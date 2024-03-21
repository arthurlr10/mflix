import { AnyARecord } from "dns";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

/**
  * @swagger
  * /api/movies:
  *   get:
  *     description: Returns movies
  *     responses:
  *       200:
  *         description: Hello Movies
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
  }
}
