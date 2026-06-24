# 🏙️ City Heist — GTA-Inspired Open World Browser Game

Built with **Three.js + Vite + Capacitor**. Plays in any browser and builds an Android APK automatically via GitHub Actions.

---

## 📁 Folder Structure

```
city-heist/
├── src/                        ← All game source code
├── index.html                  ← Entry point
├── package.json                ← Dependencies
├── vite.config.js              ← Build config
├── capacitor.config.json       ← Android app settings
├── .gitignore                  ← Files to ignore
└── .github/
    └── workflows/
        └── build-apk.yml       ← Auto-builds Android APK on push
```

---

## 🚀 HOW TO PUSH TO GITHUB & GET YOUR APK

Follow these steps exactly, in order.

---

### ✅ STEP 1 — Create a GitHub account
Go to **https://github.com** → click **Sign up** → create a free account.
*(Skip this step if you already have a GitHub account.)*

---

### ✅ STEP 2 — Create a new empty repository

1. Log in to GitHub
2. Click the **＋** icon (top-right corner) → **"New repository"**
3. Fill in:
   - **Repository name:** `city-heist`
   - **Visibility:** ✅ **Public** ← must be Public for free APK builds
   - ❌ Do NOT check "Add a README file"
   - ❌ Do NOT check "Add .gitignore"
4. Click **"Create repository"**
5. You'll see a page with your repo URL — **copy it**, it looks like:
   `https://github.com/YourUsername/city-heist`

---

### ✅ STEP 3 — Create a Personal Access Token

GitHub requires this instead of your password for pushing code.

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token (classic)"**
3. Fill in:
   - **Note:** `city-heist`
   - **Expiration:** 90 days
   - **Scopes:** ✅ check the **`repo`** checkbox
4. Scroll down → click **"Generate token"**
5. ⚠️ **Copy the token immediately** — it looks like `ghp_xxxxxxxxxxxxxxxx`
   You will NEVER see it again after leaving this page!

---

### ✅ STEP 4 — Install Git on your computer

- **Windows:** Download from https://git-scm.com → install with all defaults
- **Mac:** Open Terminal, type `git --version` → follow the install prompt
- **Linux:** Run: `sudo apt install git`

---

### ✅ STEP 5 — Extract and push the ZIP

1. **Extract** `city-heist.zip` anywhere on your computer (e.g., Desktop)
2. Open a terminal / command prompt in that folder:
   - **Windows:** Right-click inside the folder → "Open in Terminal" (or Command Prompt)
   - **Mac/Linux:** Open Terminal, then type `cd ` and drag the folder into it, press Enter
3. Run these commands **one by one** (replace values in `< >` with yours):

```bash
git init
git add .
git commit -m "City Heist - initial upload"
git branch -M main
git remote add origin https://<YOUR_TOKEN>@github.com/<YOUR_USERNAME>/city-heist
git push -u origin main
```

**Real example** (token = `ghp_abc123`, username = `john`):
```bash
git init
git add .
git commit -m "City Heist - initial upload"
git branch -M main
git remote add origin https://ghp_abc123@github.com/john/city-heist
git push -u origin main
```

✅ If you see `Writing objects: 100%` — **the push worked!**

---

### ✅ STEP 6 — Watch GitHub build your APK

1. Go to your GitHub repo in the browser
2. Click the **"Actions"** tab at the top
3. You'll see **"Build Android APK"** with an orange spinner — it's building!
4. Wait **5–8 minutes** → it turns **green ✅**
5. Click the completed run
6. Scroll to the bottom → **"Artifacts"** section
7. Click **"CityHeist-debug"** → a ZIP file downloads
8. Extract the ZIP → you get **`app-debug.apk`**

---

### ✅ STEP 7 — Install APK on your Android phone

1. Send `app-debug.apk` to your phone (email / Google Drive / USB cable)
2. On your Android phone:
   - Go to **Settings → Apps → Special app access → Install unknown apps**
   - Find your **File Manager** or **Chrome** → enable **"Allow from this source"**
3. Open the APK file on your phone → tap **"Install"**
4. Open **City Heist** 🎮

---

## 🎮 Game Controls

### On a Computer (keyboard + mouse)
| Action | Key |
|---|---|
| Move | W A S D or Arrow keys |
| Look around | Move the mouse (click game first) |
| Sprint | Hold Shift |
| Enter / Exit car | E |
| Shoot | Left mouse click |
| Change weapon | Q |
| Handbrake | Space (in car) |
| Pause | Escape |

### On Mobile / Touch
| Action | Control |
|---|---|
| Move | Left joystick (bottom-left) |
| Look | Swipe right side of screen |
| Sprint | Push joystick all the way |
| Shoot | 🔥 Red fire button |
| Enter/Exit car | Car icon button |
| Change weapon | Weapon icon button |

---

## 🔁 Updating the game later

After making changes, push updates with:
```bash
git add .
git commit -m "Update"
git push
```
A new APK will automatically build within minutes.

---

## 🌐 Playing in the browser (no install needed)

After pushing to GitHub, you can also host it free on **GitHub Pages**:
1. Go to your repo → **Settings → Pages**
2. Under "Build and deployment" → Source: **"GitHub Actions"**
3. The game will be live at: `https://YourUsername.github.io/city-heist/`

---

## ℹ️ Notes

- The APK is a **debug build** — it works fine on any Android device but is not signed for the Google Play Store
- Minimum Android version: **7.0 (Nougat)**
- Tested on Chrome, Firefox, Edge, Safari
