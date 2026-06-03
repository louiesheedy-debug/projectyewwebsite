FROM nginx:stable-alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY . /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf.template

CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
