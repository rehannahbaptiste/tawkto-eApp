#!/usr/bin/env bash
set -e

: "${PORT:=10000}"

# Update Apache to listen on $PORT
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/:80/:${PORT}/" /etc/apache2/sites-available/000-default.conf

# Laravel key must already be set in Render env vars for production.
# Clear caches just in case (safe for stateless demo)
php artisan optimize:clear || true

exec apache2-foreground
