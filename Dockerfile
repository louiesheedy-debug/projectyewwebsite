FROM nginx:stable-alpine
COPY . /usr/share/nginx/html
COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD ["/start.sh"]
