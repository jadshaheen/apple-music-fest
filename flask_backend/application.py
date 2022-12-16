import logic

import json
from flask import Flask
from flask import jsonify
from flask import request
from flask_cors import CORS

app == Flask(__name__)
CORS(app)

@app.route('/generate_image')
def generate_image():
	artists = request.args.to_dict().get('artists')
	# filename = logic.generate_image(artists)
	return logic.generate_image(artists) 
