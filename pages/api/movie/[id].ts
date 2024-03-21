import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Retrieve a movie by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Movie found and returned
 *       400:
 *         description: Movie ID is required
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 *   post:
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
 *   delete:
 *     summary: Delete a movie by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
 *     responses:
 *       200:
 *         description: Movie successfully deleted
 *       400:
 *         description: Movie ID is required
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Failed to delete movie
 *   put:
 *     summary: Update a movie by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie ID
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
 *       200:
 *         description: Movie successfully updated
 *       400:
 *         description: Movie ID is required for update
 *       404:
 *         description: Movie not found or no changes made
 *       500:
 *         description: Failed to update movie
 */
export default async function handler(req: any, res: any) {
  const client = await clientPromise;
  const db = client.db("sample_mflix");
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      if (!id) {
        return res
          .status(400)
          .json({ status: 400, message: "Movie ID is required" });
      }
      try {
        const movie = await db
          .collection("movies")
          .findOne({ _id: new ObjectId(id) });
        if (movie) {
          return res.status(200).json({ status: 200, data: movie });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: "Movie not found" });
        }
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ status: 500, message: "Internal server error" });
      }

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
    case "DELETE":
      if (!id) {
        return res
          .status(400)
          .json({ status: 400, message: "Movie ID is required" });
      }
      try {
        const deleteResult = await db
          .collection("movies")
          .deleteOne({ _id: new ObjectId(id) });

        if (deleteResult.deletedCount === 1) {
          return res
            .status(200)
            .json({ status: 200, message: "Movie successfully deleted" });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: "Movie not found" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: 500,
          message: "Failed to delete movie",
        });
      }
    case "PUT":
      if (!id) {
        return res
          .status(400)
          .json({ status: 400, message: "Movie ID is required for update" });
      }
      try {
        const updateData = req.body;
        delete updateData._id;
        const updateResult = await db
          .collection("movies")
          .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
        if (updateResult.modifiedCount === 1) {
          return res.json({
            status: 200,
            message: "Movie successfully updated",
          });
        } else {
          return res.status(404).json({
            status: 404,
            message: "Movie not found or no changes made",
          });
        }
      } catch (error) {
        return res.status(500).json({
          status: 500,
          message: "Failed to update movie",
        });
      }
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
