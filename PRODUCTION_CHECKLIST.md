# ✅ Production Deployment Checklist

Complete checklist before deploying Web Trends Timeline to production.

---

## 🔐 Security

### Environment Variables
- [ ] Generate secure `JWT_SECRET` (64+ characters random string)
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- [ ] Use Stripe **LIVE** keys (not test keys)
  - [ ] `STRIPE_SECRET_KEY=sk_live_...`
  - [ ] `STRIPE_WEBHOOK_SECRET=whsec_...`
  - [ ] `VITE_STRIPE_PUBLIC_KEY=pk_live_...`
- [ ] Set production `FRONTEND_URL` (your domain)
- [ ] Set production `VITE_API_URL` (your API domain)
- [ ] Verify no secrets in git history
  ```bash
  git log --all --full-history -- "*.env"
  ```

### SSL/TLS
- [ ] SSL certificate installed
- [ ] HTTPS enabled
- [ ] HTTP to HTTPS redirect configured
- [ ] Valid certificate (not self-signed)
- [ ] Certificate auto-renewal configured (Let's Encrypt)

### CORS
- [ ] `FRONTEND_URL` configured correctly in backend
- [ ] Test CORS from production domain
- [ ] No `*` wildcard in production CORS

---

## 💾 Database

### PostgreSQL (Production)
- [ ] PostgreSQL database created
- [ ] Database user created with strong password
- [ ] `DATABASE_URL` configured correctly
- [ ] Database connection tested
- [ ] Initial data seeded
  ```bash
  npm run seed  # If you have seed script
  ```

### Backup Strategy
- [ ] Automated daily backups configured
- [ ] Backup retention policy set (30 days recommended)
- [ ] Backup restoration tested
- [ ] Offsite backup storage configured

### Performance
- [ ] Database indexes created
  ```sql
  CREATE INDEX idx_users_email ON users(email);
  CREATE INDEX idx_users_subscription ON users(subscription_status);
  CREATE INDEX idx_trends_decade ON trends(decade);
  CREATE INDEX idx_trends_country ON trends(country);
  ```
- [ ] Connection pooling configured
- [ ] Query performance tested

---

## 💳 Stripe Configuration

### Products & Prices
- [ ] Subscription product created in Stripe
- [ ] Price ID configured (`STRIPE_PRICE_ID`)
- [ ] Test payment flow with live keys (use $0.50 test)
- [ ] Refund policy set
- [ ] Customer portal settings configured

### Webhooks
- [ ] Webhook endpoint added: `https://yourdomain.com/api/stripe/webhook`
- [ ] Webhook events selected:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
- [ ] Webhook secret configured
- [ ] Webhook endpoint tested
  ```bash
  stripe listen --forward-to localhost:3001/api/stripe/webhook
  stripe trigger checkout.session.completed
  ```

---

## 🌐 Infrastructure

### Server
- [ ] Server/VPS provisioned (or cloud service selected)
- [ ] Minimum 2GB RAM, 2 CPU cores
- [ ] 20GB+ disk space
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Git installed

### Domain & DNS
- [ ] Domain registered
- [ ] DNS records configured:
  - [ ] `A` record: `@ → server IP`
  - [ ] `A` record: `www → server IP`
  - [ ] `CNAME` record: `api → @` (if using subdomain)
- [ ] DNS propagation verified (24-48 hours)

### Firewall
- [ ] Port 80 open (HTTP)
- [ ] Port 443 open (HTTPS)
- [ ] Port 22 open for SSH (from specific IPs only)
- [ ] Port 3001 NOT exposed publicly (internal only)
- [ ] Fail2ban configured (optional but recommended)

---

## 🏗️ Build & Deployment

### Code
- [ ] All tests passing
  ```bash
  npm test
  ```
- [ ] TypeScript compilation successful
  ```bash
  npm run build
  ```
- [ ] No console errors in production build
- [ ] Production environment variables set
- [ ] Git repository up to date
  ```bash
  git status  # Should be clean
  ```

### Docker
- [ ] Docker images build successfully
  ```bash
  docker-compose build
  ```
- [ ] Containers start successfully
  ```bash
  docker-compose up -d
  ```
- [ ] Health checks passing
  ```bash
  ./scripts/health-check.sh
  ```

### Frontend
- [ ] Build optimized (check bundle size)
- [ ] Service Worker registered
- [ ] PWA installable
- [ ] Favicon and icons present
- [ ] Meta tags configured
- [ ] robots.txt configured
- [ ] sitemap.xml configured

### Backend
- [ ] API responding
  ```bash
  curl https://api.yourdomain.com/health
  ```
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Error handling tested

---

## 🧪 Testing

### Manual Testing
- [ ] User registration works
- [ ] Login/logout works
- [ ] Password reset works (if implemented)
- [ ] Subscription purchase works (test with real card)
- [ ] Subscription cancellation works
- [ ] Premium features locked for free users
- [ ] Premium features unlocked for paid users
- [ ] Bookmark system works
- [ ] Export features work (PDF, Excel, JSON)
- [ ] Timeline view works
- [ ] Compare page works
- [ ] Insights dashboard works

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Lighthouse score > 90
  ```bash
  npm install -g lighthouse
  lighthouse https://yourdomain.com
  ```

---

## 📊 Monitoring

### Application Monitoring
- [ ] Health check endpoint working
  ```bash
  curl https://yourdomain.com/api/health
  ```
- [ ] Uptime monitoring configured (UptimeRobot, Pingdom)
- [ ] Error tracking configured (Sentry - optional)
- [ ] Analytics configured (Google Analytics - optional)

### Server Monitoring
- [ ] CPU usage monitoring
- [ ] Memory usage monitoring
- [ ] Disk space monitoring
- [ ] Docker container monitoring
  ```bash
  docker-compose ps
  docker stats
  ```

### Alerts
- [ ] Email alerts for downtime
- [ ] Disk space alerts (< 20% free)
- [ ] Error rate alerts
- [ ] Webhook failures alerts

---

## 📝 Documentation

### User-Facing
- [ ] Terms of Service page
- [ ] Privacy Policy page
- [ ] Refund Policy page
- [ ] FAQ page
- [ ] Contact/Support page
- [ ] Pricing page
- [ ] User guide (if needed)

### Internal
- [ ] Deployment guide (DEPLOYMENT.md)
- [ ] API documentation (API.md)
- [ ] README updated
- [ ] Environment variables documented
- [ ] Runbook for common issues

---

## 🔄 Post-Deployment

### Immediately After Deploy
- [ ] Verify all pages load
- [ ] Verify API endpoints work
- [ ] Test user registration
- [ ] Test login
- [ ] Test payment flow (small amount)
- [ ] Check error logs
  ```bash
  docker-compose logs -f
  ```

### First 24 Hours
- [ ] Monitor error logs continuously
- [ ] Monitor server resources
- [ ] Test from different devices/networks
- [ ] Verify email notifications (if implemented)
- [ ] Monitor Stripe webhooks
- [ ] Backup database

### First Week
- [ ] Daily health checks
- [ ] Daily log review
- [ ] Monitor user registrations
- [ ] Monitor payment success rate
- [ ] Collect user feedback
- [ ] Fix any reported bugs

---

## 🎯 Go-Live Checklist

**Final checks before announcing launch:**

- [ ] All above items completed
- [ ] Backup plan ready (rollback procedure)
- [ ] Support email configured
- [ ] Legal pages accessible
- [ ] Payment system tested end-to-end
- [ ] Marketing materials ready
- [ ] Social media accounts set up
- [ ] Launch announcement prepared
- [ ] Support team briefed
- [ ] Monitoring dashboards set up

---

## 🚨 Emergency Contacts

**Keep these handy:**

- Server provider support: _______________
- Domain registrar support: _______________
- Stripe support: https://support.stripe.com
- Database provider support: _______________
- SSL certificate provider: _______________
- Your technical contact: _______________

---

## 🔄 Maintenance Schedule

### Daily
- Check health status
- Review error logs
- Monitor disk space

### Weekly
- Database backup
- Security updates
- Performance review

### Monthly
- Full system audit
- User feedback review
- Feature planning
- Cost optimization

---

**Sign-off:**

- [ ] I have reviewed this entire checklist
- [ ] All critical items are completed
- [ ] I understand the rollback procedure
- [ ] I am ready to deploy to production

**Deployed by:** _______________
**Date:** _______________
**Version:** _______________

---

**Good luck with your launch! 🚀**
