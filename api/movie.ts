import express from "express";
import { conn, mysql, queryAsync } from "../dbconn";
import { MovieGet } from "../model/movie_get";
const router = express.Router();

router.get("/", (req, res) => {
    conn.query('select * from Movie', (err, result, fields) => {
        if (result && result.length > 0) {
            res.json(result);
        }
        else {
            res.json({
                success: false,
                Error: "Incorrect Select Movie."
            });
        }
    });
});

router.get("/:moviename", (req, res) => {
    const moviename = req.params.moviename;
    conn.query('select * from Movie where name = ?', [moviename], (err, result, fields) => {
        if (result && result.length > 0) {
            res.json(result);
        }
        else {
            res.json({
                success: false,
                Error: "Incorrect Select Movie."
            });
        }
    });
});

router.post("/insert", (req, res) => {
    let movie: MovieGet = req.body;
    let sql =
        "INSERT INTO Movie (mid, name, detail) VALUES (?,?,?)";
    sql = mysql.format(sql, [
        movie.mid,
        movie.name,
        movie.detail
       
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res
            .status(201)
            .json({ affected_row: result.affectedRows});
    });
});

router.delete("/del/:movie", async (req, res) => {
    const movie = req.params.movie;
    let movieid: number;
    let sql = mysql.format("select mid from Movie where name = ?", [movie])
    let result = await queryAsync(sql);
    const jsonStr = JSON.stringify(result);
    const jsonobj = JSON.parse(jsonStr);
    const rowData = jsonobj;
    movieid = rowData[0].mid;
    conn.query("delete from Movie where mid = ?", [movie], (err, result) => {
        if (err) throw err;
        res
            .status(200)
            .json({ affected_row: result.affectedRows });
    });
});

router.delete("/delId/:id", (req, res) => {
    let id = +req.params.id;
    conn.query("delete from Movie where mid = ?", [id], (err, result) => {
        if (err) throw err;
        res
            .status(200)
            .json({ affected_row: result.affectedRows });
    });
});

export default router;