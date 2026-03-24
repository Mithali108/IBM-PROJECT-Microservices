let users = [];

exports.register = (req, res) => {
  users.push(req.body);
  res.json({ message: "User registered" });
};

exports.login = (req, res) => {
  const user = users.find(u => u.email === req.body.email);
  res.json(user ? { message: "Login success" } : { message: "User not found" });
};