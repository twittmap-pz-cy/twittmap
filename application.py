from flask import Flask,request
from flask import jsonify
from flask import render_template
from flask import send_file
import json
from essearch import ESSearch

# EB looks for an 'application' callable by default.
application = Flask(__name__)

essearch = ESSearch()

@application.route('/')
def index():
    return render_template('index.html')

@application.route('/search/')
@application.route('/search/<keyword>')
def search(keyword=None):
    if keyword is None:
        tweets_of_keyword = {"all": []}
        to_return = jsonify(**tweets_of_keyword)
    else:
        search_result = essearch.search(keyword)
        to_return = jsonify(**search_result)
    return to_return

@application.route('/geosearch/',methods=['POST'])
def geosearch():
    location={"lat": 51.0,"lon": -0.1} 
    distance=2000
    #print location
    data = request.form.to_dict()
    print data
    #location = data['location']
    distance = data['distance']
    loc = {};
    dis = {}
    loc['lat'] = data['location[lat]']
    loc['lon'] = data['location[lon]']
    print location,distance
    search_result = essearch.geosearch(loc, distance)
    to_return = jsonify(*search_result)
    return to_return



@application.route('/images/<filename>')
def get_image(filename=None):
    return send_file('static/img/'+filename, mimetype='image/png')

# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    # application.debug = True
    application.run()
