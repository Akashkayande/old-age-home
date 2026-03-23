from flask import Flask
from routes.auth import auth_bp
from flask_cors import CORS
app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})
app.register_blueprint(auth_bp, url_prefix="/auth")
@app.route("/")
def home():
    return "Backend is running!"

if __name__ == "__main__":
    app.run(debug=True)
