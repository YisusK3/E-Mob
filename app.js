import express from "express";
import cors from "cors";
import { personaRouter } from "./persona.js";
import { cuentaRouter } from "./cuenta.js";


d// Creo aplicacion express
const app = express();

app.use(express.json());
app.use(cors());
app.use("/persona", personaRouter);
app.use("/cuenta", cuentaRouter);


// Registrar metodo GET en ruta raiz ('/')
app.get("/", (req, res) => {
  res.send("Hola mundo");
});

// Pongo en funcionamiento la API en puerto 3000
app.listen(3000, () => {
  console.log("API en funcionamiento");
}); 
