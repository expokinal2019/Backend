/* const world = '🗺️';

export function hello(word: string = world): string {
  return `Hello ${world}! `;
}
 */
import express from "express";
const app = express();
app.get("/", (req, res) => {
    res.send("Hello world!!")
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
     console.log(`Server is running in http://localhost:${PORT}`)
})