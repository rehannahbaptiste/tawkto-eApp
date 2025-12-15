FROM php:8.3-apache

# System deps + PHP extensions commonly needed by Laravel
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libicu-dev \
  && docker-php-ext-install pdo pdo_mysql intl zip \
  && a2enmod rewrite \
  && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first (better caching)
COPY composer.json composer.lock ./

# Install dependencies (no dev)
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_MEMORY_LIMIT=-1
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Copy the rest of the application
COPY . .

# Laravel perms
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Ensure Apache serves Laravel public/
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Render provides $PORT. We’ll rewrite Apache listen port at runtime.
COPY deploy/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
