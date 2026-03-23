from flask import Flask
import os
from routes.auth import auth_bp
from flask_cors import CORS
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})
app.register_blueprint(auth_bp, url_prefix="/auth")
@app.route("/")
def home():
    return "Backend is running!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
