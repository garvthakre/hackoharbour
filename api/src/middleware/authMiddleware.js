import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
   const token = req.header("Authorization");
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZjhkMDY3ZGNjNjIxZDk3ODAxMDEwMCIsImlhdCI6MTc0NDM1OTUyNywiZXhwIjoxNzQ0MzYzMTI3fQ._ju2i6etp5snuQnAb7nHB4rJZ17rLq6BTJs_GtUEoJc";
  console.log("Your Token: ", token)
  if (!token) return res.status(401).json({ error: "Access Denied" });
  
  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    console.log("Decoded: ",decoded)
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};
