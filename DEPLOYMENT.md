# Gadget E-Commerce Setup & Deployment Guide

## 🎮 Dark Tech Gaming Theme

Your e-commerce site now features a stunning **Dark Tech Gaming Theme** with:
- **Dark Navy Background**: `#0a0d14` - Professional and immersive
- **Neon Purple Accents**: `#b537f2` - Eye-catching primary accent
- **Neon Cyan**: `#00d9ff` - Secondary accent for highlights
- **High Contrast**: Optimized for readability and visual appeal

The theme is fully implemented in `app/globals.css` and will automatically apply to all components.

---

## 📧 Email Notifications Setup

### How It Works

When a customer places an order, two emails are automatically sent:

1. **Customer Confirmation Email** - Order details with items, price, and delivery information
2. **Admin Notification Email** - Alert to your email with full order details for processing

### Getting Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account (includes 100 free emails/day)
3. Navigate to **API Tokens** in the dashboard
4. Create a new API key and copy it
5. Add it to your environment variables as `RESEND_API_KEY`

### Setting Up Sender Email

1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `noreply@yourdomain.com`) OR use Resend's subdomain
3. Verify your sender email
4. Add it to your environment variables as `RESEND_FROM_EMAIL`

### Environment Variables

Create a `.env.local` file in your project root with:

```env
# Resend API Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
ORDER_NOTIFICATION_EMAIL=your-email@example.com
```

**Do NOT commit `.env.local` to GitHub** - it contains sensitive API keys.

---

## 🚀 Deployment to Vercel via GitHub

### Step 1: Push Code to GitHub

```bash
# From your project directory
git add .
git commit -m "Add dark tech gaming theme and email notifications"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository
4. Click **"Import"**

### Step 3: Configure Environment Variables in Vercel

1. In the Vercel project settings, go to **Settings** → **Environment Variables**
2. Add these three variables:
   - `RESEND_API_KEY`: Your Resend API key
   - `RESEND_FROM_EMAIL`: Your verified sender email
   - `ORDER_NOTIFICATION_EMAIL`: Your admin email address

3. Click **"Save"**
4. Redeploy: Go to **Deployments** → Click on the latest deployment → **Redeploy**

### Step 4: Verify Deployment

- Your site will be live at a URL like: `https://your-project.vercel.app`
- Test an order to ensure emails are sent correctly
- Check your email for order confirmations

---

## 🎨 Theme Customization

All colors are defined in `app/globals.css`:

- **Primary Color**: Change `--primary`
- **Accent Colors**: Modify `--accent` and `--chart-*` variables
- **Background**: Adjust `--background` and `--card`

For dark mode, all variables are overridden in the `.dark` selector.

---

## 📝 Testing Email Functionality

To test email sending locally:

1. Add your environment variables to `.env.local`
2. Run the dev server: `npm run dev`
3. Place a test order through the checkout
4. Check your email for confirmation

---

## ✅ Deployment Checklist

- [ ] Resend API key obtained and added to `.env.local`
- [ ] Sender email verified in Resend
- [ ] Admin email configured
- [ ] Code pushed to GitHub
- [ ] Vercel project created and connected
- [ ] Environment variables added to Vercel
- [ ] Test order placed successfully
- [ ] Emails received correctly
- [ ] Custom domain configured (optional)

---

## 🆘 Troubleshooting

### Emails not sending?
- Verify `RESEND_API_KEY` is correct in Vercel environment variables
- Check that sender email is verified in Resend
- Look at Vercel function logs for error messages

### Theme not applying?
- Clear browser cache
- Hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
- Verify `app/globals.css` was deployed

### Order not showing in admin email?
- Confirm `ORDER_NOTIFICATION_EMAIL` is set correctly
- Check spam/junk folder
- Verify email is not filtered by your email provider

---

## 📞 Support

For issues with:
- **Resend emails**: [Resend Docs](https://resend.com/docs)
- **Vercel deployment**: [Vercel Docs](https://vercel.com/docs)
- **Your store**: Check the console logs in Vercel dashboard
