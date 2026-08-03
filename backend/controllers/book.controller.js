import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Book from "../models/Book.js";

const parseBoolean = (value) => {
  return value === true || value === "true";
};

export const addBook = async (req, res) => {
  try {
    const requestBody = req.body ?? {};
    let bookData = requestBody;

    if (requestBody.bookData) {
      try {
        bookData = JSON.parse(requestBody.bookData);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Book data must be valid JSON",
        });
      }
    }

    const {
      title,
      author,
      isbn,
      category,
      description,
      price,
      stock,
      featured,
      isNew,
      image,
    } = bookData;

    if (
      !title ||
      !author ||
      !isbn ||
      !category ||
      !description ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, author, ISBN, category, description, price and stock are required",
      });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0 ||
      Number.isNaN(numericStock) ||
      numericStock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Price and stock must be valid positive numbers",
      });
    }

    const normalizedIsbn = isbn.trim();
    const existingBook = await Book.findOne({ isbn: normalizedIsbn });

    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: "A book with this ISBN already exists",
      });
    }

    const uploadedFile = req.file ?? req.files?.[0];
    let imageUrl = image?.trim();

    if (uploadedFile) {
      if (
        !process.env.CLOUDINARY_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_SECRET_KEY
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Cloudinary credentials are not configured on the server",
        });
      }

      const uploadResult = await cloudinary.uploader.upload(
        uploadedFile.path,
        {
          folder: "bookify/books",
          resource_type: "image",
        }
      );

      imageUrl = uploadResult.secure_url;
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "A book cover image or image URL is required",
      });
    }

    const newBook = await Book.create({
      title: title.trim(),
      author: author.trim(),
      isbn: normalizedIsbn,
      category: category.trim(),
      description: description.trim(),
      price: numericPrice,
      stock: numericStock,
      image: imageUrl,
      featured: parseBoolean(featured),
      isNew: parseBoolean(isNew),
    });

    return res.status(201).json({
      success: true,
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A book with this ISBN already exists",
      });
    }

    console.error("Error in add book controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/admin/book
export const getAdminBook = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      books,
    });

  } catch (error) {
    console.error("Error fetching admin books:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/books
export const getAllBooks = async (req, res) => {
  try {
    const { category } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Books fetched successfully",
      books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// PUT /api/books/:id
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const existingBook = await Book.findById(id);

    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const requestBody = req.body ?? {};
    let bookData = requestBody;

    if (requestBody.bookData) {
      try {
        bookData = JSON.parse(requestBody.bookData);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Book data must be valid JSON",
        });
      }
    }

    const allowedFields = [
      "title",
      "author",
      "isbn",
      "category",
      "description",
      "price",
      "stock",
      "image",
      "featured",
      "isNew",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (bookData[field] !== undefined) {
        updates[field] = bookData[field];
      }
    });

    if (updates.isbn !== undefined) {
      const normalizedIsbn = updates.isbn.trim();
      const duplicateBook = await Book.findOne({
        isbn: normalizedIsbn,
        _id: { $ne: id },
      });

      if (duplicateBook) {
        return res.status(409).json({
          success: false,
          message: "A book with this ISBN already exists",
        });
      }

      updates.isbn = normalizedIsbn;
    }

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);

      if (Number.isNaN(updates.price) || updates.price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid positive number",
        });
      }
    }

    if (updates.stock !== undefined) {
      updates.stock = Number(updates.stock);

      if (Number.isNaN(updates.stock) || updates.stock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a valid positive number",
        });
      }
    }

    if (updates.featured !== undefined) {
      updates.featured = parseBoolean(updates.featured);
    }

    if (updates.isNew !== undefined) {
      updates.isNew = parseBoolean(updates.isNew);
    }

    ["title", "author", "category", "description", "image"].forEach(
      (field) => {
        if (typeof updates[field] === "string") {
          updates[field] = updates[field].trim();
        }
      }
    );

    const uploadedFile = req.file ?? req.files?.[0];

    if (uploadedFile) {
      if (
        !process.env.CLOUDINARY_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_SECRET_KEY
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Cloudinary credentials are not configured on the server",
        });
      }

      const uploadResult = await cloudinary.uploader.upload(
        uploadedFile.path,
        {
          folder: "bookify/books",
          resource_type: "image",
        }
      );

      updates.image = uploadResult.secure_url;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one book field to update",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A book with this ISBN already exists",
      });
    }

    if (error?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Error in update book controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// DELETE /api/books/:id
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error in delete book controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getBooks = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      book,
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
