#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CleanURLHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?')[0].split('#')[0]
        # If no extension and not a directory, try appending .html
        if '.' not in os.path.basename(path) and not path.endswith('/'):
            candidate = self.translate_path(path + '.html')
            if os.path.exists(candidate):
                self.path = path + '.html'
        super().do_GET()

    def log_message(self, format, *args):
        pass  # silence request logs

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    server = HTTPServer(('0.0.0.0', port), CleanURLHandler)
    print(f'Serving at http://0.0.0.0:{port}')
    server.serve_forever()
