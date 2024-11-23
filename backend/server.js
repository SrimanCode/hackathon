const express = require("express");
PORT = 5000;
const app = express();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
