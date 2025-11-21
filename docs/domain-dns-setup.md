# Domain & DNS Setup Guide (20.x)

This guide covers setting up the `fellowus.app` domain and DNS records with Turhost.

## 20.1 DNS Baseline (Turhost Panel)

### Access Turhost DNS Panel

1. **Login to Turhost**:
   - Go to Turhost control panel
   - Navigate to DNS Management

2. **Configure DNS Records**:

   **CNAME Record (www)**:

   ```
   Type: CNAME
   Name: www
   Value: yasertunc.github.io
   TTL: 3600
   ```

   **A Records (Apex/@)**:

   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   TTL: 3600

   Type: A
   Name: @
   Value: 185.199.109.153
   TTL: 3600

   Type: A
   Name: @
   Value: 185.199.110.153
   TTL: 3600

   Type: A
   Name: @
   Value: 185.199.111.153
   TTL: 3600
   ```

3. **Optional TXT Records**:

   **Google Search Console**:

   ```
   Type: TXT
   Name: @
   Value: google-site-verification=XXXXXXXXXX
   TTL: 3600
   ```

   **GitHub Pages**:

   ```
   Type: TXT
   Name: _github-pages-challenge-fellowus
   Value: (provided by GitHub Pages)
   TTL: 3600
   ```

   **Firebase/Play Console** (if needed):

   ```
   Type: TXT
   Name: @
   Value: (provided by Firebase/Play Console)
   TTL: 3600
   ```

4. **Save Changes**:
   - Save all DNS records
   - Wait for DNS propagation (can take up to 48 hours, usually < 1 hour)

## 20.2 GitHub Pages Setup

### Configure Custom Domain

1. **Add CNAME File** (already done):
   - File: `public/CNAME`
   - Content: `fellowus.app`

2. **Configure in GitHub**:
   - Go to Repository → Settings → Pages
   - Under "Custom domain", enter: `fellowus.app`
   - Check "Enforce HTTPS"
   - Wait for DNS verification

3. **Apex Redirect** (if needed):
   - GitHub Pages doesn't support apex domains directly
   - Use DNS provider's redirect feature or:
   - Set up a redirect service (e.g., Cloudflare, Netlify)

## 20.3 SSL/HSTS

### GitHub Pages SSL

- GitHub Pages automatically provides SSL certificates via Let's Encrypt
- HTTPS is enforced when "Enforce HTTPS" is enabled
- Certificate renewal is automatic

### HSTS (Optional)

If using a CDN or custom server, configure HSTS:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## 20.4 Validations

### Google Search Console

1. **Add Property**:
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add property: `https://www.fellowus.com`
   - Verify ownership via DNS TXT record or HTML file

2. **Submit Sitemap**:
   - Go to Sitemaps section
   - Submit: `https://fellowus.app/sitemap.xml`

### Play Console

1. **Add Website**:
   - Go to Play Console → App → Store presence → Main store listing
   - Add website: `https://www.fellowus.com`
   - Verify via DNS TXT record if required

### Firebase

1. **Add Domain**:
   - Go to Firebase Console → Hosting
   - Add custom domain: `fellowus.app`
   - Verify via DNS TXT record

### GitHub Pages

- DNS verification happens automatically when custom domain is added
- Check status in Repository → Settings → Pages

## 20.5 Routes

### Verify Routes Work

- [ ] `/` - Homepage loads correctly
- [ ] `/storybook/` - Storybook loads (if deployed)
- [ ] `/download` - Download page loads
- [ ] `/privacy` - Privacy policy loads
- [ ] `/terms` - Terms of service loads
- [ ] `/sitemap.xml` - Sitemap is accessible
- [ ] `/robots.txt` - Robots.txt is accessible

### Test Redirects

- [ ] `http://fellowus.app` → `https://www.fellowus.com` (if configured)
- [ ] `http://fellowus.app` → `https://www.fellowus.com`

## 20.6 Email (Optional)

### MX Records (if setting up email)

```
Type: MX
Name: @
Value: mail.fellowus.app (or your email provider)
Priority: 10
TTL: 3600
```

### SPF Record

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
TTL: 3600
```

### DKIM Record

```
Type: TXT
Name: default._domainkey
Value: (provided by email provider)
TTL: 3600
```

### DMARC Record

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@fellowus.app
TTL: 3600
```

## 20.7 CAA Records (Optional)

### Let's Encrypt

```
Type: CAA
Name: @
Value: 0 issue "letsencrypt.org"
TTL: 3600
```

### Google Trust Services

```
Type: CAA
Name: @
Value: 0 issue "pki.goog"
TTL: 3600
```

## 20.8 CI Variables

### Add to GitHub Secrets

- `DOWNLOAD_URL` = `https://www.fellowus.com/download`
- `SITE_ORIGIN` = `https://www.fellowus.com`

### Add to Environment Variables

```bash
# .env
EXPO_PUBLIC_DOWNLOAD_URL=https://www.fellowus.com/download
EXPO_PUBLIC_SITE_ORIGIN=https://www.fellowus.com
```

## Verification Checklist

- [ ] DNS records configured in Turhost
- [ ] CNAME `www` → `yasertunc.github.io` working
- [ ] A records for apex domain configured
- [ ] GitHub Pages custom domain configured
- [ ] HTTPS enforced in GitHub Pages
- [ ] DNS propagation complete (check with `dig` or online tools)
- [ ] All routes accessible and working
- [ ] Google Search Console verified
- [ ] Sitemap submitted to Search Console
- [ ] CI variables updated
- [ ] Email records configured (if applicable)

## Testing DNS

### Check DNS Records

```bash
# Check CNAME
dig fellowus.app CNAME

# Check A records
dig fellowus.app A

# Check TXT records
dig fellowus.app TXT
```

### Online Tools

- [DNS Checker](https://dnschecker.org/)
- [MXToolbox](https://mxtoolbox.com/)
- [What's My DNS](https://www.whatsmydns.net/)

## Troubleshooting

### DNS Not Propagating

- Wait up to 48 hours for full propagation
- Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
- Check with multiple DNS servers

### HTTPS Not Working

- Ensure "Enforce HTTPS" is enabled in GitHub Pages
- Wait for SSL certificate provisioning (can take a few hours)
- Check certificate: `openssl s_client -connect fellowus.app:443`

### Apex Domain Not Redirecting

- GitHub Pages doesn't support apex domains directly
- Use DNS provider's redirect feature
- Or use a service like Cloudflare for redirects
