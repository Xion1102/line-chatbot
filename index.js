const express = require("express");
const line = require("@line/bot-sdk");

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
const client = new line.Client(config);

app.post("/webhook", line.middleware(config), async (req, res) => {
  try {
    await Promise.all(req.body.events.map(handleEvent));
    res.status(200).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return null;
  }

  const text = event.message.text.toLowerCase();
  let reply = "";

  if (text.includes("xin chào") || text.includes("hello")) {
    reply = "👋 Điện Máy Xanh 2148 Vĩnh Lộc xin chào! Em có thể hỗ trợ gì cho anh/chị?";
  } else if (text.includes("địa chỉ")) {
    reply = "📍 Điện Máy Xanh 2148 Vĩnh Lộc.";
  } else if (text.includes("khuyến mãi")) {
    reply = "🎉 Anh/chị vui lòng cho biết tên sản phẩm để em kiểm tra khuyến mãi mới nhất.";
  } else if (text.includes("giờ mở cửa")) {
    reply = "🕗 Siêu thị mở cửa từ 08:00 đến 22:00 hằng ngày.";
  } else {
    reply = "Cảm ơn anh/chị đã liên hệ Điện Máy Xanh 2148 Vĩnh Lộc. Nhân viên sẽ hỗ trợ anh/chị trong thời gian sớm nhất.";
  }

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: reply,
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
