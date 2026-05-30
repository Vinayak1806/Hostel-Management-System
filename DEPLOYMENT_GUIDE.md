# 🚀 Hostel Hub - Beginner's Step-by-Step Deployment Guide

Welcome! This guide is written specifically for beginners. It will walk you through deploying your **Backend to Render** and your **Frontend to Vercel** step-by-step, ensuring you don't run into any errors.

---

## 📋 Phase 1: Prerequisites & GitHub

Before we deploy, your code needs to be on the internet.

1. **Create Accounts:**
   - Create a free account on [GitHub](https://github.com/).
   - Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
   - Create a free account on [Render](https://render.com/).
   - Create a free account on [Vercel](https://vercel.com/).

2. **Push Your Code to GitHub:**
   - Go to GitHub and create a **New Repository** (e.g., named `hostel-hub`).
   - Open your terminal in VS Code, ensure you are in the root `project` folder, and run:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/hostel-hub.git
     git push -u origin main
     ```
   *(If you've already pushed your code to GitHub, you can skip this step!)*

---

## 🗄️ Phase 2: Setup MongoDB Atlas (Live Database)

Right now, your app uses a local database on your computer. For the internet to access it, we need a cloud database.

1. Log into **MongoDB Atlas**.
2. Click **Build a Database** and select the **FREE M0** cluster.
3. Once created, go to **Database Access** (left sidebar) and create a database user. **Save the username and password somewhere safe.**
4. Go to **Network Access** (left sidebar), click **Add IP Address**, and select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Go back to **Database**, click **Connect**, then click **Drivers** (Node.js).
6. Copy the connection string. It looks like this:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
7. Replace `<username>` and `<password>` with the credentials you made in Step 3. **This is your Live `MONGO_URI`.**

---

## ⚙️ Phase 3: Deploying Backend to Render

Now we put your Node.js API on the internet.

1. Log into **Render** and click **New +** > **Web Service**.
2. Select **"Build and deploy from a Git repository"** and connect your GitHub account.
3. Select your `hostel-hub` repository.
4. **Configuration Settings:**
   - **Name**: `hostel-hub-api` (or whatever you like)
   - **Root Directory**: `backend` *(This is extremely important! Type exactly `backend`)*
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables**: Scroll down and click "Add Environment Variable". Add the following:
   - Key: `MONGODB_URI` | Value: *(Paste your live connection string from Phase 2)*
   - Key: `JWT_SECRET` | Value: `your_super_secret_key_123` *(You can type any random secure string here)*
   - Key: `PORT` | Value: `5000`
6. Click **Create Web Service**.
7. Render will now build your app. Wait until you see the green **"Live"** status.
8. Look near the top left for your live URL (e.g., `https://hostel-hub-api-abc.onrender.com`). **Copy this URL**.

---

## 💻 Phase 4: Deploying Frontend to Vercel

Finally, we deploy the React website that users will actually see.

1. Log into **Vercel** and click **Add New...** > **Project**.
2. Import your `hostel-hub` repository from GitHub.
3. **Configuration Settings:**
   - Under **Project Name**, leave it as `hostel-hub`.
   - Click **Edit** next to **Root Directory** and select the `frontend` folder. Click Save.
   - Vercel will automatically detect that you are using Vite. Leave the Build commands as default.
4. **Environment Variables:**
   - Open the Environment Variables dropdown.
   - Key: `VITE_API_URL`
   - Value: *(Paste your Render URL from Phase 3, and add `/api` to the end of it)*
   - *Example Value:* `https://hostel-hub-api-abc.onrender.com/api`
5. Click **Deploy**.
6. Vercel will build your site. Once it finishes, you will see confetti! 🎉

---

## ✅ Phase 5: Post-Deployment Testing

Your project is now completely live! To ensure zero errors:

1. Click the URL Vercel gives you to visit your live website.
2. **Create an Account**: Go to the Signup page and create a new account. Since this is a brand new live database, your old local users won't be here.
3. **Check the Network**: If you can't log in, right-click the page > **Inspect** > go to the **Console** tab to see if there are any errors. If it says "CORS error", ensure your `VITE_API_URL` in Vercel is exactly correct (no trailing slash at the very end).
4. **Test Features**: Try clicking on notifications, admissions, etc., to make sure your backend is receiving the requests.

Congratulations! You have successfully deployed a Full-Stack MERN application!
