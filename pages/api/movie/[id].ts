import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

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
        console.error(error); // Bonne pratique pour le débogage
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
