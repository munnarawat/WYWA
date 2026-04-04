const Book = require("../models/book.model");
const Issue = require("../models/issue.model");
const {
  autoAwardBadge,
} = require("../controllers/studentAchievement.controller");
// add a book to the library admin only

const addBook = async (req, res) => {
  try {
    const { title, author, quantity, category } = req.body;

    if (!title || !author || !quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }
    const book = await Book.create({
      title,
      author,
      category: category || "General",
      quantity,
      available: quantity,
      createdBy: req.user._id,
      branch: req.user.branch,
    });
    return res
      .status(201)
      .json({ message: "Book added successfully 🎉", book });
  } catch (error) {
    console.error("add book error", error);
    return res.status(500).json({ message: "Error adding book" });
  }
};

// get all books in the library
const getAllBooks = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const query = req.user?.branch ? { branch: req.user.branch } : {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    //  🌟 Pagination Math
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalBooks = await Book.countDocuments(query);

    const books = await Book.find(query)
      .populate("createdBy", "userName email")
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1, _id: -1 });

    return res.status(200).json({
      message: "Books retrieved successfully",
      books,
      pagination: {
        currentPage: pageNum,
        totalBooks: Math.ceil(totalBooks / limitNum),
        totalBooks,
        hasNextPage: skip + books.length < totalBooks,
      },
    });
  } catch (error) {
    console.error("get book error", error);
    res.status(500).json({ message: "internal server error" });
  }
};

// update book details admin only
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, quantity } = req.body;
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.branch !== req.user.branch) {
      return res
        .status(403)
        .json({ message: " You can only update books from your branch" });
    }
    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (quantity !== undefined) {
      if (quantity < 0) {
        return res.status(400).json({ message: "Quantity cannot be negative" });
      }
      const diff = quantity - book.quantity;
      book.quantity = quantity;
      book.available = Math.max(0, book.available + diff);
    }
    await book.save();
    return res.status(200).json({
      message: "Book updated successfully 🎉",
      book,
    });
  } catch (error) {
    console.error("update book error", error);
    return res.status(500).json({ message: "Error updating book" });
  }
};
// delete book admin only

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.branch !== req.user.branch) {
      return res.status(403).json({
        message: "You can only delete books from your branch",
      });
    }
    await book.deleteOne();
    return res.status(200).json({ message: "Book deleted successfully 🎉" });
  } catch (error) {
    console.error("delete book error", error);
    return res.status(500).json({ message: "Error deleting book" });
  }
};

// issue book to  admin only
const issueBook = async (req, res) => {
  try {
    const { bookId, studentId } = req.body;
    if (!bookId || !studentId) {
      return res
        .status(400)
        .json({ message: "Book ID and Student ID are required" });
    }
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.branch !== req.user.branch) {
      return res.status(403).json({
        message: "You cannot issue a book from another branch",
      });
    }
    if (book.available <= 0) {
      return res.status(400).json({ message: "Book is not available" });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks from now
    const issue = await Issue.create({
      book: bookId,
      student: studentId,
      dueDate: dueDate,
      issuedBy: req.user._id,
      branch: req.user.branch,
    });
    book.available -= 1;
    await book.save();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const booksIssuedThisMonth = await Issue.countDocuments({
      student: studentId,
      createdAt: { $gte: startOfMonth },
    });

    if (booksIssuedThisMonth >= 5) {
      autoAwardBadge(
        studentId,
        req.user.branch,
        "Bookworm 🐛",
        "Read 5 or more books in a single month!",
        "reading",
      );
    }
    return res
      .status(201)
      .json({ message: "Book issued successfully 🎉", issue });
  } catch (error) {
    console.error("issue book error", error);
    return res.status(500).json({ message: "Error issuing book" });
  }
};
// return book admin only
const returnBook = async (req, res) => {
  try {
    const { issueId } = req.params;
    console.log("ISSUE ID FROM PARAM:", issueId);
    const issue = await Issue.findById(issueId).populate("book");
    console.log("FOUND ISSUE:", issue);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    if (issue.branch !== req.user.branch) {
      return res.status(403).json({ message: "Unauthorized branch access" });
    }
    if (issue.status === "returned") {
      return res.status(400).json({ message: "Book already returned" });
    }
    issue.status = "returned";
    issue.returnedAt = new Date();
    await issue.save();

    const book = await Book.findById(issue.book._id);
    if (book) {
      book.available += 1;
      await book.save();
    }

    return res
      .status(200)
      .json({ message: "Book returned successfully 🎉", issue });
  } catch (error) {
    console.error("return book error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all issued  by student or all
const getIssued = async (req, res) => {
  try {
    const { studentId } = req.query;
    const query = req.user?.branch ? { branch: req.user.branch } : {};
    if (req.user.role === "student") {
      query.student = req.user._id;
    } else if (studentId) {
      query.student = studentId;
    }
    const records = await Issue.find(query)
      .populate("book", "title author category coverImage")
      .populate("student", "userName email fullName")
      .sort({ issuedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Issued records retrieved successfully 🎉",
      records,
    });
  } catch (error) {
    console.error("get issued error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook,
  issueBook,
  returnBook,
  getIssued,
};
