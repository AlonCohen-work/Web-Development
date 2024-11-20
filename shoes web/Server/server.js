const express = require('express');
const path = require('path');
const mongojs = require('mongojs');
const app = express();

app.use(express.json()); // מאפשרת לפרס את הגוף של הבקשות ב-POST

// חיבור ל-MongoDB
const db = mongojs('mongodb+srv://Student:webdev2024student@cluster0.uqyflra.mongodb.net/webdev2024');
const tasks_coll = db.collection('final_SindiKoifan_AlonCohen');

// שירות קבצים סטטיים עם כותרות cache-control
app.use(express.static(path.join(__dirname, '../Client/public'), {
  maxAge: '1y' // Cache static assets for 1 year
}));

// API לטעינת מוצרים והזמנות
app.get('/products', (req, res) => {
  tasks_coll.find({ product: "true" }, (err, products) => {
    if (err) return res.status(500).send(err);

    tasks_coll.find({ product: "false" }, (err, orders) => {
      if (err) return res.status(500).send(err);

      res.json({
        products: products,
        orders: orders
      });
    });
  });
});

// API להוספת הזמנה חדשה
app.post('/submitpage.php', (req, res) => {
  const order = req.body;

  // קבלת המספר הזמנה האחרון
  tasks_coll.find({ product: "false" }).sort({ orderNumber: -1 }).limit(1, (err, lastOrder) => {
    if (err) return res.status(500).send(err);

    const newOrderNumber = lastOrder.length > 0 ? lastOrder[0].orderNumber + 1 : 1;

    // יצירת ההזמנה החדשה
    const newOrder = {
      orderNumber: newOrderNumber,
      ...order,
      product: "false",
      createdAt: new Date(),
    };

    tasks_coll.insert(newOrder, (err, result) => {
      if (err) return res.status(500).send(err);

      res.json({ orderNumber: newOrderNumber });
    });
  });
});

// שירות index.html עבור כל יתר הנתיבים
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Client/public', 'index.html'));
});

// הפעלת השרת
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
