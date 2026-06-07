FROM nginx:stable-alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY . /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf.template

CMD ["/bin/sh", "-c", "sed \"s/NGINX_PORT/${PORT:-80}/\" /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
