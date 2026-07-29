import sys
import os

here = os.path.dirname(os.path.abspath(__file__))
backend_path = os.path.join(here, "backend")
if not os.path.isdir(backend_path):
    backend_path = os.path.join(here, "..", "backend")
sys.path.insert(0, backend_path)

from main import app
