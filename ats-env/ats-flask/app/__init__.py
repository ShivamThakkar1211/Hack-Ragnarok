from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config['UPLOAD_FOLDER'] = 'app/uploads'

    from app.routes import ats_bp
    app.register_blueprint(ats_bp)

    return app