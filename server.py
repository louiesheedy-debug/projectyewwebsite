#!/usr/bin/env python3
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class CleanURLHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_GET(self):
        path = self.path.split('?')[0].split('#')[0]
        if '.' not in os.path.basename(path) and not path.endswith('/'):
            candidate = os.path.join(BASE_DIR, path.lstrip('/') + '.html')
            if os.path.exists(candidate):
                self.path = path + '.html'
        super().do_GET()

    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    httpd = HTTPServer(('0.0.0.0', port), CleanURLHandler)
    print(f'Serving on port {port}', flush=True)
    httpd.serve_forever()
