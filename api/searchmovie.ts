import express, { Request, Response } from "express";
import { conn } from "../dbconn"; // Import conn from dbconn file

const router = express.Router();

router.get("/:name", (req: Request, res: Response) => {
    const name = `%${req.params.name}%`;
    const sql = `
    SELECT
        Movie.*, 
        stars.*, 
        creators.*,
        actor.name AS actor_name,
        creator.name AS creator_name
    FROM
        Movie
        INNER JOIN stars ON Movie.mid = stars.mid
        INNER JOIN Person AS actor ON stars.pid = actor.pid
        INNER JOIN creators ON Movie.mid = creators.mid
        INNER JOIN Person AS creator ON creators.pid = creator.pid
    WHERE
        Movie.name LIKE ?`;

    conn.query(sql, [name], (err, results: any[], fields) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        const moviesMap = new Map<number, any>();

        results.forEach((row: any) => {
            const movieId = row.mid;

            if (!moviesMap.has(movieId)) {
                moviesMap.set(movieId, {
                    movie_id: row.mid,
                    movie_name: row.name, 
                    movie_detail: row.detail, 
                    actors: [],
                    creators: [],
                });
            }

            const movie = moviesMap.get(movieId);

            const actor = {
                actor_id: row.actor_id,
                actor_name: row.actor_name,
            };

            const creator = {
                creator_id: row.creator_id,
                creator_name: row.creator_name,
            };

            if (!movie.actors.find((a: any) => a.actor_id === actor.actor_id)) {
                movie.actors.push(actor);
            }

            if (!movie.creators.find((c: any) => c.creator_id === creator.creator_id)) {
                movie.creators.push(creator);
            }
        });

        const jsonData = { movies: Array.from(moviesMap.values()) };
        res.json(jsonData);
    });
});

export default router;
