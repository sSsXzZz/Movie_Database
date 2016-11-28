import httplib, urllib, base64
import json
import MySQLdb

db = MySQLdb.connect("localhost","root","vishnu1","imdb")
x = db.cursor()

sql = "SELECT movie_title FROM Movies"

headers = {
    # Request headers
    #28ce2731d0af4e85a5f60f3b6ba2edf5
    'Ocp-Apim-Subscription-Key': 'c78e761f28224c789c98d5a60939c8a4',
}


try:
    x.execute(sql)
    result = x.fetchall()
    i = 0
    for row in result:
        params = urllib.urlencode({
        # Request parameters
        'q': str(row),
        'count': '1',
        'offset': '0',
        'mkt': 'en-us',
        'safeSearch': 'Moderate',
        })
        if (i < 975):
            try:
                i=i+1
                conn = httplib.HTTPSConnection('api.cognitive.microsoft.com')
                conn.request("GET", "/bing/v5.0/images/search?%s" % params, "{body}", headers)
                response = conn.getresponse()
                data = response.read()
                data_json  = json.loads(data)
                #data_json['value'][0][u'contentURL]
                #Run INSERT if Sable allows
            except Exception as e:
                print("[Errno {0}] {1}".format(e.errno, e.strerror))
    #Check if we pass the API Limit
    print i
except:
    print "Error: unable to fetch data"
db.close()
