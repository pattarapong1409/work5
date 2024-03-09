import mysql from "mysql";
import util from "util";
export const conn = mysql.createPool(
    {
        connectionLimit : 10,
        host:"sql6.freemysqlhosting.net",
        user: "sql6688152",
        password:"vL6um8ygUn",
        database:"sql6688152"
    }
);
export const queryAsync = util.promisify(conn.query).bind(conn);
export { mysql };