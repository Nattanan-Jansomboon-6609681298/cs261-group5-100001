const express = require('express');
const PORT = 3000;
const path = require('path');
const bodyparser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors') 
const app = express();
const nodemailer = require('nodemailer');
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

const transporter = nodemailer.createTransport({
  service: 'gmail', // เปลี่ยนเป็นผู้ให้บริการอีเมลที่ใช้
  auth: {
      user: 'andasecondary@gmail.com', // อีเมลต้นทาง
      pass: 'wjpx rizq ltac thsa'   // รหัสผ่านอีเมล
  }
});

  //คืนค่าแบบคําร้องใน database ที่มี id = parameter ที่ส่งมา
  //return type: array ของ object
app.get('/forms/:studentID', async (req, res) => {
  try {
    const studentID = req.params.studentID;
    const result = await conn.query('SELECT * FROM forms WHERE studentID = ?', studentID);
    if(result[0].length > 0) {
      res.json(result[0]);
    }
    else {
      throw new Error("Not Found");
    }
  } 
  catch (error) {
    if(error.message === "Not Found") {
      res.status(404).json( {
        status : 404,
        ErrorMessage : error.message
      });
    }
    else {
      res.status(500).json( {
        status : 500,
        ErrorMessage : error.message
      });
    }
  }
  });


  //return ค่าทั้งหมดที่อยู่ใน database 
  //return type: array ของ object
app.get('/forms', async (req, res) => {
  try {
    const result = await conn.query('SELECT * FROM forms');
    if(result[0].length > 0) {
      res.json(result[0]);
    }
    else {
      throw new Error("Not Found");
    }
  } catch (error) {
    if(error.message === "Not Found") {
      console.log(error.message);
      res.status(404).json( {
        status : 404,
        ErrorMessage : error.message
      });
    }
    else {
      res.status(500).json( {
        status : 500,
        ErrorMessage : error.message
      });
    }
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
  app.post('/forms', async (req, res) => {
    try {
      let forms = req.body;
      await conn.query('INSERT INTO forms SET ?', forms);
  
      res.status(200).json({  
        message: 'Insert Success', 
        status: 200
      });
    }
    catch(error) {
      res.status(500).json({  
        errorMessage: error.message,
        status: 500
      });
    }
  });


//ลบคําร้องที่มี่ id = parameter ออกจาก database
app.delete('/forms/:id', async (req, res) => {
  try {
    const [result] = await conn.query('DELETE FROM forms WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
        return res.status(404).json({
        message: "Delete Failed: Record not found",
        status : 404
      });
    }
    res.json({
      message: "Record deleted successfully.",
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.error('Error deleting record:', error.message);
    res.status(500).json({
      message: "Failed to delete record.",
      errorMessage: error.message
    });
  }
});

//แก้ไขสถานะคําร้องให้เป็น อนมัติ หรือ ไม่อนุมัติ
app.put('/forms/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.approved;
    const comments = req.body.comments;
    const [result] = await conn.query('UPDATE forms SET approved = ? , comments = ? WHERE id = ?', [status, comments, id]);

    if (result.affectedRows === 0) {
        return res.status(404).json({
        message: "Update Failed: Record not found" ,
        status : 404
      });
    }
    
    res.json({
      message: "Update Success",
      affectedRows: result.affectedRows
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Update Failed",
      errorMessage: error.message,
    });
  }
});


app.post('/api/requests/:requestId/:action', async (req, res) => {
  const requestId = req.params.requestId;  // รหัสคำร้อง
  const action = req.params.action;  // action คือ approve หรือ reject
  const { comments, email } = req.body;  // คอมเมนต์และอีเมลที่ส่งมา

  try {
      // 1. อัพเดทสถานะคำร้องในฐานข้อมูล (approved หรือ rejected)
      const [result] = await conn.query('UPDATE forms SET approved = ?, comments = ? WHERE id = ?', [action === 'approve' ? 1 : 0, comments, requestId]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Request not found' });
      }

      // 2. ส่งอีเมลแจ้งผลการอนุมัติหรือปฏิเสธ
      const emailStatus = action === 'approve' ? 'approved' : 'rejected';
      const mailOptions = {
          from: 'andasecondary@gmail.com',
          to: email,
          subject: `Your request has been ${emailStatus}`,
          text: `Dear user,\n\nYour request has been ${emailStatus}. Comments: ${comments}\n\nBest regards,\nYour Team`
      };

      // 3. ส่งอีเมลด้วย nodemailer
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log('Error sending email:', error);
              return res.status(500).json({ message: 'Failed to send email', error: error.message });
          } else {
              console.log('Email sent:', info.response);
              return res.status(200).json({ message: 'Request processed and email sent' });
          }
      });
  } catch (error) {
      console.log('Error:', error.message);
      res.status(500).json({ message: 'Error processing request', error: error.message });
  }
});












