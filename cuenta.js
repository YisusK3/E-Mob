import express from "express";
import { db } from "./db.js";


export const cuentaRouter = express
  .Router()
  .get("/", async (req, res) => {
    const [rows, fields] = await db.execute(
      "SELECT id, usuario, persona_id as personaId FROM cuenta"
    );
    res.send(rows);
  })
  .get("/:id", async (req, res) => {
    const id = req.params.id;
    const [rows, fields] = await db.execute(
      "SELECT id, usuario, persona_id as personaId FROM cuenta WHERE id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "Cuenta no encontrada" });
    }
  })
  .get("/:id/persona", async (req, res) => {
    const id = req.params.id;
    const [rows, fields] = await db.execute(
      "SELECT p.id, p.apellido, p.nombre \
      FROM persona p \
      JOIN cuenta c ON p.id = c.persona_id \
      WHERE c.id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "Persona no encontrada" });
    } 
  })

  .post(
    "/",
    body("usuario").isAlpha().isLength({ min: 1, max: 40 }),
    body("rol").isAlpha().isLength({ min: 1, max: 20 }),
    body("contraseña").isAlpha().isLength({ min: 1, max: 50 }),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      const { usuario, rol, contraseña } = req.body;
      const [rows] = await db.execute(
        "INSERT INTO cuenta (usuario, rol, contraseña) VALUES (:usuario, :rol, :contraseña)",
        { usuario, rol, contraseña }
      );
      res.status(201).send({ usuario, rol, contraseña, id: rows.insertId });
    });