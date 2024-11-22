import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        // Extract token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }

        const token = authHeader.split(" ")[1]; // Extract the token from "Bearer <token>"

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded); // Log the decoded token to verify its contents


        // Check if the token contains the admin's email
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Access Denied. Not an Admin" });
        }

        // Proceed to the next middleware/route
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: "Token is invalid or expired" });
    }
};

export default adminAuth;
