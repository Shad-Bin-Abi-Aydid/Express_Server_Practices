import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const app = express();
const port = 5000;

// add parser => this is for allow json format data
app.use(express.json());

// It's connect the database
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

// create the table
const initDB = async () => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      age INT,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `);
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Next level Developer!!!!");
});

// <---------------------------> Users CURD <---------------------------------->

// post a data
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, age } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email,age) VALUES($1, $2, $3) RETURNING *`,
      [name, email, age],
    );
    // console.log(result.rows[0]);

    res.status(201).json({
      success: true,
      message: "Data inserted Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Get all data
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      success: true,
      message: "Users retrieved data successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

// Get single data
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    // if didn't found any data
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User didn't found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user data found Successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: err,
    });
  }
});

// Update using PUT
app.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email, age } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2, age=$3 WHERE id=$4 RETURNING *`,
      [name, email, age, req.params.id],
    );

    // if didn't found any data
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User didn't found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user updated Successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: err,
    });
  }
});

// Delete a user
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [
      req.params.id,
    ]);

    // if didn't found any data
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User didn't found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user delete Successfully",
        data: result.rows,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: err,
    });
  }
});

// <-----------------------------> todo's CURD <--------------------------------->
// post todos
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title],
    );

    res.status(201).json({
      success: true,
      message: "Todo Created",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// get todos
app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);

    res.status(200).json({
      success: true,
      message: "todos data retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Todos data not found",
    });
  }
});

// get a single todos
app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todos data not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todos data found successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: err,
    });
  }
});

// update todos using put
app.put("/todos/:id", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `UPDATE todos SET user_id=$1, title=$2 WHERE id=$3 RETURNING *`,
      [user_id, title, req.params.id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todos data not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todos data update successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: err,
    });
  }
});

// Delete todos 
app.delete("/todos/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM todos WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Todos data not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Todos delete successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: err,
    });
  }
});

// not found route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not Found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
