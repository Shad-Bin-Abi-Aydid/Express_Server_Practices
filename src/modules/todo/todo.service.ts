import { pool } from "../../config/db";

// post todos
const createTodo = async (user_id: number, title: string) => {
  const result = await pool.query(
    `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
    [user_id, title],
  );

  return result;
};

// Get todo
const getTodo = async () => {
  const result = await pool.query(`SELECT * FROM todos`);
  return result;
};

// Get Single Todo
const getSingleTodo = async (id: string) => {
  const result = await pool.query(`SELECT * FROM todos WHERE id=$1`, [id]);
  return result;
};

// update todos
const updateTodo = async (user_id: number, title: string, id: string) => {
  const result = await pool.query(
    `UPDATE todos SET user_id=$1, title=$2 WHERE id=$3 RETURNING *`,
    [user_id, title, id],
  );
  return result;
};

// Delete todos
const deleteTodo = async (id:string) => {
  const result = await pool.query(`DELETE FROM todos WHERE id=$1`, [id]);

  return result;
};

export const todoServices = {
  createTodo,
  getTodo,
  getSingleTodo,
  updateTodo,
  deleteTodo
};
