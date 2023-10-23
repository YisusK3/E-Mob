export const personaRouter = express
  .Router()

  .get("/", async (req, res) => {
    const [rows, fields] = await db.execute("SELECT * FROM persona");
    res.send(rows);
  })

  .get("/:id", param("id").isInt({ min: 1 }), async (req, res) => {
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errors: validacion.array() });
      return;
    }
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      "SELECT * FROM persona WHERE id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "Persona no encontrada" });
    }
  })

  .get("/:id/cuenta", async (req, res) => {
    const { id } = req.params;
    const [rows, fields] = await db.execute(
      "SELECT id, usuario FROM cuenta WHERE persona_id = :id",
      { id }
    );
    if (rows.length > 0) {
      res.send(rows[0]);
    } else {
      res.status(404).send({ mensaje: "Cuenta no encontrada" });
    }
  })

  .post(
    "/",
    body("nombre").isAlpha().isLength({ min: 1, max: 20 }),
    body("apellido").isAlpha().isLength({ min: 1, max: 45 }),
    body("email").isAlpha().isLength({ min: 1, max: 256 }),
    body("telefono").isAlpha().isLength({ min: 1, max: 100 }),
    body("dni").isAlphaNumeric().isLength({ min: 1, max: 8 }),
    body("direccion").isAlpha().isLength({ min: 1, max: 100 }),
    async (req, res) => {
      const validacion = validationResult(req);
      if (!validacion.isEmpty()) {
        res.status(400).send({ errors: validacion.array() });
        return;
      }

      const { nombre, apellido, email, telefono, dni, direccion } = req.body;
      const [rows] = await db.execute(
        "INSERT INTO personas (nombre, apellido, email, telefono, dni, direccion) VALUES (:nombre, :apellido, :email, :telefono, :dni, :direccion)",
        { nombre, apellido, email, telefono, dni, direccion }
      );
      res.status(201).send({ nombre, apellido, email, telefono, dni, direccion, id: rows.insertId });
    }
  );