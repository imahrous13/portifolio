$env:RESEND_API_KEY="re_da7xDZYr_Hn1TsAjRg4FKdaEMtbzGMhcN"
$env:CONTACT_TO_EMAIL="imahrous13@gmail.com"
$env:CONTACT_FROM_EMAIL="Portfolio Contact <onboarding@resend.dev>"
$env:DRY_RUN="false"
Write-Host "Starting server with environment variables..."
node server.js
