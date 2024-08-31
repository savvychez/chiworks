import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from database.models import db
from database.populate import populate
from database.update_images import update_job_images
from sqlalchemy import create_engine


# import mysql.connector
# connection = mysql.connector.connect(host='chiworksdb.cu2nxeqvzcmg.us-east-2.rds.amazonaws.com',
#                                          database='chiworksdb',
#                                          user='admin',
#                                          password='sweproject2023')

# engine = create_engine("mysql+mysqlconnector://admin:sweproject2023@chiworksdb.cu2nxeqvzcmg.us-east-2.rds.amazonaws.com")

from dotenv import load_dotenv

load_dotenv()

# configure app
application = Flask(__name__)
CORS(application)
marsh = Marshmallow(application)


# connect database
application.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
db.init_app(application)

app = application

# with app.app_context():
#     update_job_images()
    # db.create_all()

from api import routes
