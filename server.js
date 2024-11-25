const express = require('express');
const PORT = 3000;
const path = require('path');
const bodyparser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(bodyparser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let conn = null;

// เชื่อม database
const connectMySQL = async (retries = 5) => {
  while (retries) {
    try {
      conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'mydb',
        port: process.env.DB_PORT || 3306
      });
      console.log("Connected to MySQL server");
      await conn.query(`CREATE DATABASE IF NOT EXISTS mydb`);
      console.log("Database 'mydb' checked/created");
      await conn.query(`USE mydb`);
      await conn.query(`
        CREATE TABLE IF NOT EXISTS forms (
          id INT AUTO_INCREMENT PRIMARY KEY,
          studentID VARCHAR(11) NOT NULL,
          subject TEXT NOT NULL,
          firstName VARCHAR(255) NOT NULL,
          lastName VARCHAR(255) NOT NULL,
          year TINYINT NOT NULL,
          addressNumber VARCHAR(50) NOT NULL,
          subdistrict VARCHAR(65) NOT NULL,
          district VARCHAR(60) NOT NULL,
          province VARCHAR(50) NOT NULL,
          contactNumber VARCHAR(10) NOT NULL,
          parentContactNumber VARCHAR(10) NOT NULL,
          advisor VARCHAR(255) NOT NULL,
          semester TINYINT,
          courseCode VARCHAR(10),
          courseName VARCHAR(70),
          section BIGINT,
          purpose TEXT NOT NULL,
          date DATETIME DEFAULT CURRENT_TIMESTAMP,
          approved TINYINT(1),
          advisor_approved TINYINT(1),
          teacher_approved TINYINT(1),
          dean_approved TINYINT(1),
          comments TEXT,
          email VARCHAR(80)
        )
      `);
      console.log("Table 'forms' checked/created");
      break;
    } catch (error) {
      console.error("Database connection failed:", error.message);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      await new Promise(res => setTimeout(res, 5000)); // รอ 5 วินาทีแล้วลองใหม่
    }
  }
  if (!retries) throw new Error('Unable to connect to MySQL');
};



app.listen(PORT, async () => {
    await connectMySQL();
    console.log(`Server running on port ${PORT}`);
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// สร้าง transporter สำหรับส่งอีเมล
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'andasecondary@gmail.com',
    pass: 'wjpx rizq ltac thsa'
  }
});

// ตรวจสอบการเชื่อมต่อก่อนเรียกใช้ conn.query
const executeQuery = async (query, params) => {
  if (!conn) {
    throw new Error("Database connection is not established.");
  }
  return await conn.query(query, params);
};

// คืนค่าข้อมูลใน database ตาม id
app.get('/forms/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await executeQuery('SELECT * FROM forms WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json(rows);
    } else {
      throw new Error("Not Found");
    }
  } catch (error) {
    res.status(error.message === "Not Found" ? 404 : 500).json({
      status: error.message === "Not Found" ? 404 : 500,
      ErrorMessage: error.message
    });
  }
});

// คืนค่าข้อมูลตาม studentID
app.get('/forms/:studentID', async (req, res) => {
  try {
    const id = req.params.studentID;
    const [rows] = await executeQuery('SELECT * FROM forms WHERE studentID = ?', [id]);
    if (rows.length > 0) {
      res.json(rows);
    } else {
      throw new Error("Not Found");
    }
  } catch (error) {
    res.status(error.message === "Not Found" ? 404 : 500).json({
      status: error.message === "Not Found" ? 404 : 500,
      ErrorMessage: error.message
    });
  }
});

// คืนค่าข้อมูลทั้งหมดใน database
app.get('/forms', async (req, res) => {
  try {
    const [rows] = await executeQuery('SELECT * FROM forms');
    res.json(rows.length > 0 ? rows : []);
  } catch (error) {
    res.status(500).json({
      status: 500,
      ErrorMessage: error.message
    });
  }
});


// คืนค่าข้อมูลตามที่ปรึกษา
app.get('/forms/advisor/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const [rows] = await executeQuery('SELECT * FROM forms WHERE advisor = ?', [name]);
    
    if (rows.length > 0) {
      return res.json(rows);
    }
    throw new Error("Not Found");
  } catch (error) {
    if (error.message === 'Not Found') {
      return res.status(404).json({
        message: error.message,
        status: 404
      });
    }
    return res.status(500).json({
      message: "Something went wrong!",
      errorMessage: error.message
    });
  }
});

// app.get('/forms/advisor/:name', async (req, res) => {
//   try {
//     const name = req.params.name;
//     const [rows] = await executeQuery('SELECT * FROM forms WHERE advisor = ?', [name]);
    
//     if(rows.length > 0) {
//       return res.json(rows);
//     }
//     throw new Error("Not Found");
//   } catch (error) {
//     if(error.message === 'Not Found') {
//       res.status(404).json({
//         message : error.message,
//         status : 404
//       });
//     }
//     res.status(500).json({
//       message: "something went wrong!",
//       errorMessage: error.message
//     });
//   }
// }); 

// insert ข้อมูลใหม่ลง database
app.post('/forms', async (req, res) => {
  try {
    let forms = req.body;
    await executeQuery('INSERT INTO forms SET ?', forms);
    res.status(200).json({
      message: 'Insert Success',
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
      status: 500
    });
  }
});

// ลบข้อมูลออกจาก database ตาม id
app.delete('/forms/:id', async (req, res) => {
  try {
    const [result] = await executeQuery('DELETE FROM forms WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({
        message: "Delete Failed: Record not found",
        status: 404
      });
    } else {
      res.json({
        message: "Record deleted successfully.",
        affectedRows: result.affectedRows
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete record.",
      errorMessage: error.message
    });
  }
});

// อนุมัติหรือปฏิเสธคำร้องพร้อมส่งอีเมลแจ้งเตือน
app.put('/api/requests/:requestId/:action', async (req, res) => {
  const { requestId, action } = req.params;
  const { comments, email } = req.body;

  try {
    const [result] = await executeQuery('UPDATE forms SET approved = ?, comments = ? WHERE id = ?', [action === 'approve' ? 1 : 0, comments, requestId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const emailStatus = action === 'approve' ? 'approved' : 'rejected';
    const mailOptions = {
      from: 'andasecondary@gmail.com',
      to: email,
      subject: `Your request has been ${emailStatus}`,
      text: `Dear user,\n\nYour request has been ${emailStatus}. Comments: ${comments}\n\nBest regards,\nYour Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to send email', error: error.message });
      }
      res.status(200).json({ message: 'Request processed and email sent' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
});

// API teacher
app.get('/forms/teacher/:name', async (req, res) => {
  const name = req.params.name;
  try {
      const [rows] = await executeQuery('SELECT * FROM forms WHERE advisor = ?', [name]);
      res.json(rows);
  } catch (error) {
      res.status(500).json({ errorMessage: error.message });
  }
});
