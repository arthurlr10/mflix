import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: Retrieve a comment by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment found and returned
 *       400:
 *         description: Comment ID is required
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete a comment by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment successfully deleted
 *       400:
 *         description: Comment ID is required
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Failed to delete comment
 * 
 *   put:
 *     summary: Update a comment by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The updated comment text
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The updated date of the comment
 *     responses:
 *       200:
 *         description: Comment successfully updated
 *       400:
 *         description: Comment ID is required for update
 *       404:
 *         description: Comment not found or no changes made
 *       500:
 *         description: Failed to update comment
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
          .json({ status: 400, message: "Comment ID is required" });
      }
      try {
        const comment = await db
          .collection("comments")
          .findOne({ _id: new ObjectId(id) });
        if (comment) {
          return res.status(200).json({ status: 200, data: comment });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: "Comment not found" });
        }
      } catch (error) {
        console.error(error);
        return res
          .status(500)
          .json({ status: 500, message: "Internal server error" });
      }
    case "DELETE":
      if (!id) {
        return res
          .status(400)
          .json({ status: 400, message: "Comment ID is required" });
      }
      try {
        const deleteResult = await db
          .collection("comments")
          .deleteOne({ _id: new ObjectId(id) });

        if (deleteResult.deletedCount === 1) {
          return res
            .status(200)
            .json({ status: 200, message: "Comment successfully deleted" });
        } else {
          return res
            .status(404)
            .json({ status: 404, message: "Comment not found" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          status: 500,
          message: "Failed to delete comment",
        });
      }

    case "PUT":
      if (!id) {
        return res
          .status(400)
          .json({ status: 400, message: "Comment ID is required for update" });
      }
      try {
        const updateData = req.body;
        delete updateData._id;
        const updateResult = await db
          .collection("comments")
          .updateOne({ _id: new ObjectId(id) }, { $set: updateData });
        if (updateResult.modifiedCount === 1) {
          return res.json({
            status: 200,
            message: "Comment successfully updated",
          });
        } else {
          return res.status(404).json({
            status: 404,
            message: "Comment not found or no changes made",
          });
        }
      } catch (error) {
        return res.status(500).json({
          status: 500,
          message: "Failed to update comment",
        });
      }
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE", "PUT"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
