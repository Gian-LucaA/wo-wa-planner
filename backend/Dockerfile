# Select a base image
FROM php:8.4-apache

RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Europe/Berlin /etc/localtime && dpkg-reconfigure -f noninteractive tzdata

RUN apt-get update && apt-get install -y --no-install-recommends gnupg dirmngr ca-certificates

# Installieren Sie die MongoDB PHP-Erweiterung und Composer
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    unzip \
    libssl-dev \
    pkg-config \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd zip \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set the working directory
WORKDIR /var/www/html

# Copy the PHP files to the Apache directory
COPY . /var/www/html/

RUN composer update

# Install PHP dependencies
RUN composer install

RUN composer require phpmailer/phpmailer

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Enable mod_rewrite
RUN a2enmod rewrite

# Open the port for the Apache server
EXPOSE 80