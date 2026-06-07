#!/bin/sh
cat > /etc/nginx/conf.d/default.conf << EOF
server {
    listen ${PORT:-8080};
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files \$uri \$uri.html \$uri/ =404;
    }
}
EOF
exec nginx -g 'daemon off;'
