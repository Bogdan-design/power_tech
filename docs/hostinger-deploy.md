# Hostinger Deploy

## GitHub secrets

Add these repository secrets in `Settings -> Secrets and variables -> Actions`:

- `FTP_SERVER`: your Hostinger FTP host
- `FTP_USERNAME`: your Hostinger FTP username
- `FTP_PASSWORD`: your Hostinger FTP password
- `FTP_SERVER_DIR`: usually `/public_html/`

## First deploy

1. Push this repository to GitHub.
2. Make sure your production branch is `main`.
3. Add the secrets listed above.
4. Open `Actions` in GitHub and run `Build and Deploy to Hostinger`, or push to `main`.

## Notes

- The workflow uploads the built `dist/` contents to Hostinger.
- The existing `public/.htaccess` file is copied into `dist/` during build and supports SPA routing on Hostinger.
- If your domain uses a subfolder instead of the root website directory, update `FTP_SERVER_DIR`.
