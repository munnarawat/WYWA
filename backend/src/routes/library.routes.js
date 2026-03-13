const express = require("express");
const {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
  issueBook,
  returnBook,
  getIssued,
} = require("../controllers/library.controller");
const {authMiddleware, adminMiddleware} = require("../middleware/auth.middleware");


const router = express.Router();

// public student 
router.get("/books", authMiddleware,  getAllBooks);
router.get("/issued", authMiddleware,  getIssued);

// admin only
router.post("/books", authMiddleware, adminMiddleware, addBook);
router.put("/books/:id", authMiddleware, adminMiddleware, updateBook );
router.delete("/books/:id", authMiddleware, adminMiddleware, deleteBook );
router.post("/issue", authMiddleware, adminMiddleware, issueBook);
router.patch("/return/:issueId",  authMiddleware, adminMiddleware, returnBook);

module.exports = router;
