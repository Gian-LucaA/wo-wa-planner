# Pin image versions (consider also pinning digests)
FROM php:8.4.1-apache

ENV DEBIAN_FRONTEND=noninteractive \
    TZ=Europe/Berlin \
    COMPOSER_ALLOW_SUPERUSER=1

# System deps (single layer) + cleanup
RUN apt-get update && apt-get install -y --no-install-recommends \
      tzdata \
      ca-certificates \
      unzip \
      libpng-dev libjpeg-dev libfreetype6-dev \
      libzip-dev \
      libssl-dev pkg-config \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" gd zip \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb \
    && rm -rf /var/lib/apt/lists/*

# Pin Composer instead of :latest (choose a real version you want)
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy only composer files first for better caching
COPY composer.json composer.lock ./

# Install prod deps only (no update!)
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader

# Now copy the application code
COPY . .

# Permissions: make code not writable; only allow write where needed (example paths)
RUN chown -R www-data:www-data /var/www/html \
    && find /var/www/html -type f -exec chmod 0644 {} \; \
    && find /var/www/html -type d -exec chmod 0755 {} \;

# Apache: enable rewrite, but don’t globally AllowOverride All
RUN a2enmod rewrite \
 && printf '%s\n' \
    '<Directory /var/www/html>' \
    '  AllowOverride All' \
    '  Require all granted' \
    '</Directory>' \
    > /etc/apache2/conf-available/app.conf \
 && a2enconf app

EXPOSE 80