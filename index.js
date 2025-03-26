const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const connectToDatabase = require("./database/db");
const http = require("http");
const fs = require("fs");
const path = require("path");
const webhookRoutes = require("./routes/webhookRoutes");
const donationRoutes = require("./routes/donationRoutes");
const setupSocket = require("./utils/socket");

env.config();

const app = express();

app.use("/webhook", webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));
app.use("/api/menu-items", require("./routes/menuRoutes"));
app.use("/api/sidebar", require("./routes/sidebarRoutes"));
app.use("/api/image-slides", require("./routes/imageSlideRoutes"));
app.use("/api/gallery", require("./routes/galleryRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/testimonials", require("./routes/testimonialsRoutes"));
app.use("/api/branches", require("./routes/branchRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/mission-story", require("./routes/missionStroryRoutes"));
app.use("/api/stories", require("./routes/storyRoutes"));
app.use("/api/scholarships", require("./routes/scholarshipRoutes"));
app.use(
  "/api/scholarship-recipients",
  require("./routes/scholarshipRecipientsRoutes")
);
app.use("/api/hearse-vehicles", require("./routes/hearseVehicleRoutes"));
app.use("/api/executive-bod", require("./routes/executiveBodTeamRoutes"));
app.use(
  "/api/executive-management",
  require("./routes/executiveManagementTeamRoutes")
);
app.use("/api/annual-donations", require("./routes/annualDonationRoutes"));
app.use("/api/onetime-donations", require("./routes/onetimeDonationRoutes"));
app.use("/api/dmv-chapter", require("./routes/dmvChapterRoutes"));
app.use("/api/texas-chapter", require("./routes/texasChapterRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/about-us", require("./routes/aboutUsRoutes"));
app.use("/api/interest", require("./routes/interestRatesRoutes"));
app.use("/api/progress", require("./routes/progressRoutes"));
app.use("/api/footer", require("./routes/footerRoutes"));
app.use("/api/ceo-message", require("./routes/ceoMessageRoutes"));
app.use("/api/settings", require("./routes/settingsRoute"));
app.use("/api/news-letter", require("./routes/newsLetterRoutes"));
app.use("/api/notices", require("./routes/noticeRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/careers", require("./routes/careerRoutes"));
app.use("/api/syllabus", require("./routes/syllabusRoutes"));

app.use("/api", donationRoutes);

app.get("/", (req, res) => {
  res.send("Hello!! This is Sana Kisan Bikas Laghubitta Bittiya Sanstha Ltd");
});

const PORT = process.env.PORT || 5500;
const server = http.createServer(app);

connectToDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
  });
  setupSocket(server);
});
