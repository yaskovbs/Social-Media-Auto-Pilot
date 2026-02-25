import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import SQLiteStore from "better-sqlite3-session-store";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.db");
const SqliteStore = SQLiteStore(session);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    google_id TEXT UNIQUE,
    youtube_token TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    user_id TEXT PRIMARY KEY,
    is_enabled INTEGER DEFAULT 1,
    post_interval_minutes INTEGER DEFAULT 30,
    max_posts_per_day INTEGER DEFAULT 10,
    include_old_videos INTEGER DEFAULT 1,
    include_shorts INTEGER DEFAULT 1,
    start_time TEXT DEFAULT '09:00',
    end_time TEXT DEFAULT '21:00',
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY,
    youtube_id TEXT UNIQUE,
    title TEXT,
    description TEXT,
    tags TEXT,
    thumbnail_url TEXT,
    published_at TEXT,
    video_type TEXT,
    custom_title TEXT,
    custom_description TEXT,
    custom_tags TEXT,
    user_id TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS video_status (
    video_id TEXT,
    platform TEXT,
    status TEXT,
    platform_url TEXT,
    custom_caption TEXT,
    PRIMARY KEY(video_id, platform),
    FOREIGN KEY(video_id) REFERENCES videos(id)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  
  app.use(session({
    store: new SqliteStore({
      client: db,
      expired: {
        clear: true,
        intervalMs: 900000 // 15min
      }
    }),
    secret: process.env.SESSION_SECRET || "social-pilot-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
  }));

  // Google OAuth Setup
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  const oauth2Client = new google.auth.OAuth2(
    googleClientId,
    googleClientSecret,
    `${process.env.APP_URL}/api/auth/callback/google`
  );

  // Auth Middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!(req as any).session?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // Auth Routes
  app.get("/auth/google", (req, res) => {
    if (!googleClientId || !googleClientSecret) {
      return res.status(500).send(`
        <html>
          <body style="background: #0A0A0B; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: 20px;">
            <div style="max-width: 500px; background: #121214; padding: 40px; border-radius: 32px; border: 1px solid rgba(255,255,255,0.1); shadow: 0 20px 40px rgba(0,0,0,0.5);">
              <h1 style="color: #ef4444;">Google OAuth Not Configured</h1>
              <p style="color: #94a3b8; line-height: 1.6;">You need to set <b>GOOGLE_CLIENT_ID</b> and <b>GOOGLE_CLIENT_SECRET</b> in your environment variables to enable Google Login.</p>
              <a href="https://console.cloud.google.com/apis/credentials" target="_blank" style="display: inline-block; margin-top: 20px; background: #ef4444; color: #fff; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold;">Go to Google Cloud Console</a>
            </div>
          </body>
        </html>
      `);
    }
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/youtube.readonly"
      ],
      prompt: "consent"
    });
    res.redirect(url);
  });

  app.get("/api/auth/callback/google", async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const { data: profile } = await oauth2.userinfo.get();

      let user = db.prepare("SELECT * FROM users WHERE google_id = ?").get(profile.id) as any;
      
      if (!user) {
        const userId = `user_${Math.random().toString(36).slice(2, 11)}`;
        db.prepare("INSERT INTO users (id, name, email, avatar_url, google_id, youtube_token) VALUES (?, ?, ?, ?, ?, ?)")
          .run(userId, profile.name, profile.email, profile.picture, profile.id, JSON.stringify(tokens));
        db.prepare("INSERT INTO settings (user_id) VALUES (?)").run(userId);
        user = { id: userId };
      } else {
        db.prepare("UPDATE users SET youtube_token = ? WHERE id = ?").run(JSON.stringify(tokens), user.id);
      }

      (req as any).session.userId = user.id;
      res.redirect("/");
    } catch (error) {
      console.error("OAuth Error:", error);
      res.redirect("/login?error=oauth_failed");
    }
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    
    // Simple email login logic for demonstration/prototype
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (!user) {
      return res.status(401).json({ success: false, message: "משתמש לא נמצא" });
    }

    // In a real app, verify password here
    (req as any).session.userId = user.id;
    res.json({ success: true, user });
  });

  app.post("/api/register", (req, res) => {
    const { email, password, name } = req.body;
    
    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "האימייל כבר קיים במערכת" });
    }

    const userId = `user_${Math.random().toString(36).slice(2, 11)}`;
    db.prepare("INSERT INTO users (id, name, email, avatar_url) VALUES (?, ?, ?, ?)")
      .run(userId, name || email.split('@')[0], email, `https://ui-avatars.com/api/?name=${name || email}&background=random`);
    db.prepare("INSERT INTO settings (user_id) VALUES (?)").run(userId);
    
    const user = { id: userId, name, email };
    (req as any).session.userId = user.id;
    res.json({ success: true, user });
  });

  app.post("/api/logout", (req, res) => {
    (req as any).session.destroy(() => {
      res.json({ success: true });
    });
  });

  // API Routes
  app.get("/api/me", (req, res) => {
    if (!(req as any).session?.userId) return res.status(401).end();
    const user = db.prepare("SELECT id, name, email, avatar_url FROM users WHERE id = ?").get((req as any).session.userId);
    res.json(user);
  });

  app.get("/api/settings", requireAuth, (req, res) => {
    const userId = (req as any).session.userId;
    const settings = db.prepare("SELECT * FROM settings WHERE user_id = ?").get(userId) as any;
    // ... rest of logic ...
    res.json({
      isEnabled: Boolean(settings.is_enabled),
      postIntervalMinutes: settings.post_interval_minutes,
      maxPostsPerDay: settings.max_posts_per_day,
      includeOldVideos: Boolean(settings.include_old_videos),
      includeShorts: Boolean(settings.include_shorts),
      startTime: settings.start_time,
      endTime: settings.end_time
    });
  });

  app.post("/api/settings", requireAuth, (req, res) => {
    const userId = (req as any).session.userId;
    const { isEnabled, postIntervalMinutes, maxPostsPerDay, includeOldVideos, includeShorts, startTime, endTime } = req.body;
    db.prepare(`
      UPDATE settings SET 
        is_enabled = ?, 
        post_interval_minutes = ?, 
        max_posts_per_day = ?, 
        include_old_videos = ?, 
        include_shorts = ?, 
        start_time = ?, 
        end_time = ?
      WHERE user_id = ?
    `).run(
      isEnabled ? 1 : 0,
      postIntervalMinutes,
      maxPostsPerDay,
      includeOldVideos ? 1 : 0,
      includeShorts ? 1 : 0,
      startTime,
      endTime,
      userId
    );
    res.json({ success: true });
  });

  app.get("/api/videos", requireAuth, (req, res) => {
    const userId = (req as any).session.userId;
    const videos = db.prepare("SELECT * FROM videos WHERE user_id = ?").all(userId) as any[];
    const result = videos.map(v => {
      const statuses = db.prepare("SELECT platform, status, platform_url, custom_caption FROM video_status WHERE video_id = ?").all(v.id) as any[];
      const statusMap: any = {};
      const urlMap: any = {};
      const captionMap: any = {};
      statuses.forEach((s: any) => {
        statusMap[s.platform] = s.status;
        urlMap[s.platform] = s.platform_url;
        captionMap[s.platform] = s.custom_caption;
      });
      return {
        id: v.id,
        youtubeId: v.youtube_id,
        title: v.title,
        description: v.description,
        tags: v.tags,
        thumbnailUrl: v.thumbnail_url,
        publishedAt: v.published_at,
        videoType: v.video_type,
        customTitle: v.custom_title,
        customDescription: v.custom_description,
        customTags: v.custom_tags,
        status: statusMap,
        platformUrls: urlMap,
        platformCaptions: captionMap
      };
    });
    res.json(result);
  });

  app.post("/api/sync", requireAuth, async (req, res) => {
    const userId = (req as any).session.userId;
    const user = db.prepare("SELECT youtube_token FROM users WHERE id = ?").get(userId) as any;
    
    if (!user?.youtube_token) {
      return res.status(400).json({ error: "YouTube not connected" });
    }

    try {
      const tokens = JSON.parse(user.youtube_token);
      oauth2Client.setCredentials(tokens);
      
      const youtube = google.youtube({ version: "v3", auth: oauth2Client });
      const { data } = await youtube.search.list({
        part: ["snippet"],
        forMine: true,
        type: ["video"],
        maxResults: 50
      });

      if (data.items) {
        for (const item of data.items) {
          const videoId = item.id?.videoId;
          if (!videoId) continue;

          const snippet = item.snippet;
          const isShort = snippet?.title?.toLowerCase().includes("#shorts") || false;

          db.prepare(`
            INSERT OR IGNORE INTO videos (id, youtube_id, title, description, tags, thumbnail_url, published_at, video_type, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(
            videoId, 
            videoId, 
            snippet?.title, 
            snippet?.description, 
            "", 
            snippet?.thumbnails?.high?.url || snippet?.thumbnails?.default?.url, 
            snippet?.publishedAt, 
            isShort ? "short" : "video", 
            userId
          );

          const platforms = ["tiktok", "instagram", "facebook", "x"];
          for (const p of platforms) {
            db.prepare(`
              INSERT OR IGNORE INTO video_status (video_id, platform, status)
              VALUES (?, ?, ?)
            `).run(videoId, p, "pending");
          }
        }
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Sync Error:", error);
      res.status(500).json({ error: "Failed to sync from YouTube" });
    }
  });

  app.post("/api/videos/:id/metadata", requireAuth, (req, res) => {
    const userId = (req as any).session.userId;
    const { id } = req.params;
    const { customTitle, customDescription, customTags, platformCaptions } = req.body;
    
    db.transaction(() => {
      db.prepare(`
        UPDATE videos SET 
          custom_title = ?, 
          custom_description = ?, 
          custom_tags = ?
        WHERE id = ? AND user_id = ?
      `).run(customTitle, customDescription, customTags, id, userId);

      if (platformCaptions) {
        for (const [platform, caption] of Object.entries(platformCaptions)) {
          db.prepare(`
            UPDATE video_status SET custom_caption = ?
            WHERE video_id = ? AND platform = ?
          `).run(caption, id, platform);
        }
      }
    })();
    
    res.json({ success: true });
  });

  app.post("/api/videos/:id/status", requireAuth, (req, res) => {
    const { id } = req.params;
    const { platform, status } = req.body;
    db.prepare("UPDATE video_status SET status = ? WHERE video_id = ? AND platform = ?")
      .run(status, id, platform);
    res.json({ success: true });
  });

  app.get("/api/stats", requireAuth, (req, res) => {
    const userId = (req as any).session.userId;
    const videoCount = db.prepare("SELECT COUNT(*) as count FROM videos WHERE user_id = ?").get(userId) as any;
    const postedCount = db.prepare("SELECT COUNT(*) as count FROM video_status vs JOIN videos v ON vs.video_id = v.id WHERE vs.status = 'posted' AND v.user_id = ?").get(userId) as any;
    const pendingCount = db.prepare("SELECT COUNT(*) as count FROM video_status vs JOIN videos v ON vs.video_id = v.id WHERE vs.status = 'pending' AND v.user_id = ?").get(userId) as any;
    const failedCount = db.prepare("SELECT COUNT(*) as count FROM video_status vs JOIN videos v ON vs.video_id = v.id WHERE vs.status = 'failed' AND v.user_id = ?").get(userId) as any;

    res.json({
      synced: videoCount.count,
      posted: postedCount.count,
      pending: pendingCount.count,
      errors: failedCount.count
    });
  });

  app.get("/api/activity", requireAuth, (req, res) => {
    const userId = (req as any).session.userId;
    const activities = db.prepare(`
      SELECT v.title, vs.platform, vs.status, v.id
      FROM video_status vs
      JOIN videos v ON vs.video_id = v.id
      WHERE vs.status = 'posted' AND v.user_id = ?
      ORDER BY v.published_at DESC
      LIMIT 5
    `).all(userId) as any[];
    
    res.json(activities.map(a => ({
      id: a.id,
      title: a.title,
      platform: a.platform,
      status: a.status,
      time: 'לפני זמן קצר'
    })));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
