const express = require('express');
const axios = require('axios');
const schedule = require('node-schedule');

const app = express();
const port = process.env.PORT || 3000;

const accessToken = 'a8WiG6m0meyzBa072aE45wE3PnqraPfUGFxW4pWfqNV'; // ใส่ access token ของคุณที่นี่

// กำหนดรายการข้อความที่ต้องการส่งไว้ล่วงหน้า
const messages = [
  'เตือนครั้งที่1: Monitor Incident อย่าให้มี Late ',
  'เตือนครั้งที่2:ตรวจสอบ Incident ก่อนเลิกงานด้วยน่ะครับ',
];

let currentMessageIndex = 0;

const sendLineNotify = () => {
  const messageToSend = messages[currentMessageIndex];

  axios.post(
    'https://notify-api.line.me/api/notify',
    `message=${encodeURIComponent(messageToSend)}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  .then(response => {
    console.log('ส่งข้อความแล้ว:', messageToSend, response.data);
  })
  .catch(error => {
    console.error('เกิดข้อผิดพลาดในการส่งข้อความ:', error);
  });

  // อัปเดต index ของข้อความ (วนกลับไปที่ต้นเมื่อถึงข้อความสุดท้าย)
  currentMessageIndex = (currentMessageIndex + 1) % messages.length;
};

// ตั้งเวลาให้ทำงานทุกวัน เวลา 09:30 และ 17:00
schedule.scheduleJob('30 9 * * *', sendLineNotify);  // 09:30 น.
schedule.scheduleJob('00 17 * * *', sendLineNotify); // 17:00 น.

// สร้าง Express server เพื่อให้ server run อยู่ตลอดเวลา
app.get('/', (req, res) => {
  res.send('Server กำลังทำงานและส่งข้อความ LINE Notify ทุกวันเวลา 09:30 และ 17:00');
});

app.listen(port, () => {
  console.log(`Server ทำงานบนพอร์ต ${port}`);
});
