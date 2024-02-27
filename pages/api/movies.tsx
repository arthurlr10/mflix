import { AnyARecord } from "dns";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: any, res: any) {
  const client = await clientPromise;
  const db = client.db("sample_mflix");

  switch (req.method) {
    case "GET":
      const movies = await db.collection("movies").find({}).limit(10).toArray();
      res.json({ status: 200, data: movies });
      break;
  }
}
