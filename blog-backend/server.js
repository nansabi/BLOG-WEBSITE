// 🔐 dotenv for security
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// import the express library
const express = require("express");

// create a server object
const app = express();

// middleware to convert the JSON=> JSON object
app.use(express.json());
const cors = require("cors");

app.use(
  cors({
    origin : "http://localhost:5173",
    credentials : true,
  })
);

// Socket.js
const http = require("http"); // this brings the http module to this file
const { Server } = require("socket.io");

// create http server using express app
const server = http.createServer(app);

// ================= SOCKET IO =================
// when the user comes online saves their id when the user goes offline removes the id

const onlineUsers = {}; // userId -> socketId

// create socket.io server
const io = new Server(server, {
  // new Server => creates a new socket.IO server and attach the websocket power to my server
  cors: {
    // cors => cross origin resource sharing it is about rules about who can connect
    origin: "*", // allows everyone
  },
});

// socket connection logic
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("User online:", userId);
  });

  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }
    console.log("Socket disconnected:", socket.id);
  });
});

// import the mongoose library to work mongodb with nodejs
const mongoose = require("mongoose");

// import the blog.js file from the models folder and we use it here
const Blog = require("./models/Blog");
const Counter = require("./models/counter");

// import the middleware so that we can use here
const authMiddleWare = require("./middleware/auth");

// import the comment file from the models folder
const Comment = require("./models/comment");

// import the userschema from the models/user.js
const User = require("./models/user");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const adminMiddleware = require("./middleware/admin");

const upload = require("./middleware/upload");
const cloudinary = require("./config/cloudinary");

// import notification model
const notification = require("./models/notification");

// Connect to mongodb
mongoose
  .connect("mongodb://127.0.0.1:27017/blogPlatform")
  .then(() => console.log("Mongodb connected successfully"))
  .catch((err) => console.log("MongoDb connection error:", err));

app.get("/", (req, res) => {
  res.send("Blog Backend is Running");
});

// code to test whether the user sending data is recieived properly
app.post("/test", (req, res) => {
  console.log("Data received from the user:", req.body);
  res.json({
    message: "Data received successfully",
    data: req.body,
  });
});

// ================= BLOG CREATE =================
// Image Handler
app.post("/blogs", authMiddleWare, upload.single("image"), async (req, res) => {
  try {
    let imageURL = "";
    let imagePublicId = "";

    // Upload image if exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
      );

      imageURL = result.secure_url;
      imagePublicId = result.public_id;
    }

    // Counter for blogId
    let counterDoc = await Counter.findOne({ name: "blog" });
    if (!counterDoc) {
      counterDoc = await Counter.create({ name: "blog", value: 1 });
    } else {
      counterDoc.value += 1;
      await counterDoc.save();
    }

    // Get author name from userId
    const userDoc = await User.findById(req.userId);

    const blog = await Blog.create({
      blogId: counterDoc.value,
      title: req.body.title,
      content: req.body.content,
      image: imageURL,
      imagePublicId: imagePublicId,
      author: userDoc.name, // ✅ human-readable name
      authorId: req.userId, // ✅ for auth
    });

    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ================= TRENDING MUST COME FIRST =================

// trending blogs
app.get("/blogs/trending", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ trendingScore: -1 }).limit(10);

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ALL BLOGS =================
// Route to get all blogs with pagination, search, and sorting
app.get("/blogs", async (req, res) => {
  try {
    // 1️⃣ Get page and limit from query parameters
    // Example: /blogs?page=2&limit=5
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // 2️⃣ Calculate how many blogs to skip for pagination
    const skip = (page - 1) * limit;

    // 3️⃣ Build the search query
    let searchQuery = {};
    if (req.query.search) {
      const searchTerm = req.query.search.trim();
      const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(^|\\s)${escaped}(\\s|$)`, "i");

      searchQuery = {
        $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }],
      };
    }

    // 4️⃣ Build sorting option
    let sortOption = { createdAt: -1 };
    if (req.query.sort === "oldest") sortOption = { createdAt: 1 };
    if (req.query.sort === "title") sortOption = { title: 1 };
    if (req.query.sort === "title_desc") sortOption = { title: -1 };

    // 5️⃣ Fetch blogs from MongoDB
    const blogs = await Blog.find(searchQuery)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // 6️⃣ Count total blogs matching the search
    const totalBlogs = await Blog.countDocuments(searchQuery);

    // 7️⃣ Send response back to client
    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
      blogs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SINGLE BLOG =================

// code to get a individual post by the id
app.get("/blogs/:blogId", async (req, res) => {
  try {
    const blogId = Number(req.params.blogId);
    if (isNaN(blogId)) {
      return res.status(400).json({ message: "Invalid Blog ID" });
    }

    // 🔼 Increase view count by 1
    const blog = await Blog.findOneAndUpdate(
      { blogId },
      { $inc: { views: 1, trendingScore: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE BLOG =================

// code to select a single post and to update it
app.put("/blogs/:blogId", authMiddleWare, async (req, res) => {
  try {
    const blogId = Number(req.params.blogId);
    const blog = await Blog.findOne({ blogId });

    if (!blog) {
      return res.status(404).json({ message: "Blog not Found" });
    }

    if (blog.authorId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    Object.assign(blog, req.body);
    await blog.save();

    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/blogs/:blogId", authMiddleWare, async (req, res) => {
  try {
    const blogId = Number(req.params.blogId);
    const blog = await Blog.findOne({ blogId });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 🔒 MANDATORY SAFETY CHECK
    if (!blog.authorId) {
      return res.status(403).json({
        message: "Old blog record missing authorId. Cannot delete.",
      });
    }

    // ✅ CORRECT AUTHORIZATION CHECK
    if (blog.authorId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (blog.imagePublicId) {
      await cloudinary.uploader.destroy(blog.imagePublicId);
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(400).json({ error: err.message });
  }
});

// ================= AUTH =================

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Create user
    const user = await User.create({ name, email, password });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    // Send _id as well for frontend
    res.json({
      name: user.name,
      email: user.email,
      _id: user._id, // ✅ important
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    // Create JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    // Send _id for frontend
    res.json({
      name: user.name,
      email: user.email,
      _id: user._id, // ✅ important
      token,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ================= COMMENTS =================

app.post("/blogs/:blogId/comments", authMiddleWare, async (req, res) => {
  try {
    const blogId = Number(req.params.blogId); // FIXED
    const comment = await Comment.create({
      blogId: blogId,
      userId: req.userId,
      text: req.body.text,
    });

    // 🔹 Emit live comment to everyone watching this blog
    io.to(`blog_${blogId}`).emit("newComment", {
      blogId: blogId,
      comment: comment,
    });

    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/blogs/:blogId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({
      blogId: Number(req.params.blogId),
    });

    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ================= ADMIN =================

app.get("/admin/users", authMiddleWare, adminMiddleware, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

app.delete(
  "/admin/blogs/:blogId",
  authMiddleWare,
  adminMiddleware,
  async (req, res) => {
    await Blog.findOneAndDelete({ blogId: Number(req.params.blogId) });
    res.json({ message: "Blog deleted by admin" });
  }
);

app.delete(
  "/admin/users/:userId",
  authMiddleWare,
  adminMiddleware,
  async (req, res) => {
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: "User Deleted by the admin" });
  }
);

// ================= LIKE =================
app.post("/blogs/:blogId/like", authMiddleWare, async (req, res) => {
  try {
    // 🔹 Find blog using blogId from URL
    const blog = await Blog.findOne({ blogId: Number(req.params.blogId) });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 🔹 Logged-in user id (from JWT middleware)
    const userId = req.userId;

    // 🔹 Check if user already liked this blog
    const alreadyLiked = blog.likes.includes(userId);

    if (alreadyLiked) {
      // 🔁 If already liked → remove like
      blog.likes = blog.likes.filter((id) => id !== userId);

      // 🔻 Reduce trending score safely
      blog.trendingScore = Math.max(0, blog.trendingScore - 3);
    } else {
      // ❤️ Add like
      blog.likes.push(userId);

      // 🔺 Increase trending score
      blog.trendingScore += 3;

      // ❌ Remove from unlikes if exists
      blog.unlikes = blog.unlikes.filter((id) => id !== userId);
    }

    // 🔔 CREATE NOTIFICATION (ONLY IF USER LIKES SOMEONE ELSE'S BLOG)
    if (blog.authorId.toString() !== userId) {
      // 1️⃣ Save notification in DATABASE
      await notification.create({
        userId: blog.authorId, // receiver (blog author)
        fromUserId: userId, // sender (who liked)
        blogId: blog.blogId,
        type: "like",
        message: "Someone liked your blog",
      });

      // 2️⃣ SEND REAL-TIME NOTIFICATION (WebSocket)
      const receiverSocketId = onlineUsers[blog.authorId];

      // If author is online → send instantly
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", {
          message: "Someone liked your blog",
          blogId: blog.blogId,
          type: "like",
        });
      }
    }

    // 💾 Save blog changes
    await blog.save();

    // ✅ Send response
    res.json({
      message: alreadyLiked ? "Like Removed" : "Blog liked",
      likesCount: blog.likes.length,
      unlikesCount: blog.unlikes.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UNLIKE =================
app.post("/blogs/:blogId/unlike", authMiddleWare, async (req, res) => {
  try {
    // 🔹 Find blog
    const blog = await Blog.findOne({ blogId: Number(req.params.blogId) });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // 🔹 Logged-in user
    const userId = req.userId;

    // 🔹 Check if already unliked
    const alreadyUnliked = blog.unlikes.includes(userId);

    if (alreadyUnliked) {
      // 🔁 Remove unlike
      blog.unlikes = blog.unlikes.filter((id) => id !== userId);

      // 🔺 Restore trending score
      blog.trendingScore += 3;
    } else {
      // 👎 Add unlike
      blog.unlikes.push(userId);

      // 🔻 Reduce trending score safely
      blog.trendingScore = Math.max(0, blog.trendingScore - 3);

      // ❌ Remove like if exists
      blog.likes = blog.likes.filter((id) => id !== userId);
    }

    // 🔔 CREATE NOTIFICATION (ONLY IF NOT SELF-UNLIKE)
    if (blog.authorId.toString() !== userId) {
      // 1️⃣ Save notification in DATABASE
      const newNotification = await notification.create({
        userId: blog.authorId, // receiver (blog owner)
        fromUserId: userId, // sender (who unliked)
        blogId: blog.blogId,
        type: "unlike",
        message: "Someone unliked your blog",
      });

      // 2️⃣ CHECK IF BLOG AUTHOR IS ONLINE
      const receiverSocketId = onlineUsers[blog.authorId];

      // 3️⃣ IF ONLINE → SEND LIVE NOTIFICATION
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", {
          _id: newNotification._id,
          message: newNotification.message,
          blogId: newNotification.blogId,
          type: newNotification.type,
        });
      }
    }

    // 💾 Save blog changes
    await blog.save();

    // ✅ Send response
    res.json({
      message: alreadyUnliked ? "Unlike Removed" : "Blog unliked",
      likesCount: blog.likes.length,
      unlikesCount: blog.unlikes.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= NOTIFICATIONS =================
app.get("/notifications", authMiddleWare, async (req, res) => {
  try {
    const notifications = await notification
      .find({
        userId: req.userId,
        isRead: false,
      })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notifications as read
app.put("/notifications/:id/read", authMiddleWare, async (req, res) => {
  await notification.findByIdAndUpdate(req.params.id, {
    isRead: true,
  });

  res.json({ message: "Notification marked as read" });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
