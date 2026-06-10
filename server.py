#!/usr/bin/env python3
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    httpd = HTTPServer(('0.0.0.0', port), Handler)
    print(f'Serving on port {port}', flush=True)
    httpd.serve_forever()
