const express = require('express');
const PORT = 3000;
const path = require('path');
const bodyparser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors') 
const app = express();
app.use(bodyparser.json());
app.use(cors());
let conn = null;



//set port ไปที่ localhost:3000
app.listen(PORT, async () => {
    await connectMySQL();
    console.log(`Server running on port ${PORT}`)
});

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



//เชื่อม database
const connectMySQL = async () => {
  try {
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'mydb',
      port : 3306
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};



  //คืนค่าแบบคําร้องใน database ที่มี id = parameter ที่ส่งมา
  //return type: array ของ object
app.get('/forms/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await conn.query('SELECT * FROM forms WHERE id = ?', id);
    if(result[0].length > 0) {
      res.json(result[0]);
    }
    else {
      throw new Error("Not Found");
    }
  } 
  catch(error) {
    console.error('error message:', error.message)
    res.status(500).json({
      message : "something went wrong!",
      errorMessage : error.message
    });
  }
  });


  //return ค่าทั้งหมดที่อยู่ใน database 
  //return type: array ของ object
app.get('/forms', async (req, res) => {
  try {
    const result = await conn.query('SELECT * FROM forms');
    res.json(result[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json( {
      status : 500,
      ErrorMessage : error.message
    });
  }
});

  //ไว้ให้อาจารย์กดอนุมัติ
  //return คําร้องที่มีชื่ออาจารย์ที่ปรึกษา = parameter "name"
  //return type: array ของ object
  app.get('/forms/advisor/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const [rows] = await conn.query('SELECT * FROM forms WHERE advisor = ?', name);

        if (!Array.isArray(rows) || rows.length === 0) { 
            res.status(404).json({
                status: 404,
                ErrorMessage: "Not Found"
            });
        } else {
            res.json(rows);
        }
    } catch (error) {
        console.log("Error occurred:", error.message);
        res.status(500).json({
            message: "something went wrong!",
            errorMessage: error.message
        });
    }
});


  //insert คําร้องลง database
app.post('/forms/submit', async (req, res) => {
  try {
    let forms = req.body;
    await conn.query('INSERT INTO forms SET ?', forms);

    res.json({
      message : 'Insert Success', 
      status : 200
    });
  }
  catch(error) {
    res.json({
      errorMessage : error.message,
      status : 500
    })
  }
});


//ลบทุก rows ออกจาก database
app.delete('/forms/deleteAll', async (req, res) => {
  try {
    const [result] = await conn.query('DELETE FROM forms');
    
    res.json({
      message: "All records have been deleted successfully.",
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error deleting records:', error.message);
    res.status(500).json({
      message: "Failed to delete records.",
      errorMessage: error.message
    });
  }
});












