import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const client = await clientPromise;
	const db = client.db("sorsu-db");

	res.status(200).json({ message: "Database is online!" });
}
