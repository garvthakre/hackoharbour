import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  // const token = req.header("Authorization");
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGU4MzQ4M2U0NzBmOTJlMDI5YjU1NSIsImlhdCI6MTc0MjYzNTg0OCwiZXhwIjoxNzQyNjM5NDQ4fQ.PahiGe_kJ9w0TISJQ2d-T-9_dHZpqacyP5aQb9o7Z9Y";
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};
