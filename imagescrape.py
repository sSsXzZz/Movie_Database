mport httplib, urllib, base64
import json
import MySQLdb
import time

db = MySQLdb.connect("localhost","root","vishnu1","imdb")
x = db.cursor()

sql_query = "SELECT movie_title FROM Movies"

headers = {
  # Request headers
  #4993
  'Ocp-Apim-Subscription-Key': '2eedf395659f4e098ff62a037897049f',
}


try:
  x.execute(sql_query)
  result = x.fetchall()
  i = 0
  for row in result:
    i = i+1
    if (i > 4796):
      print i
      param = str(row)
      param = param[2:-3]
      param = param + ' movie cover'
      params = urllib.urlencode({
      'q': param,
      'count': '1',
      'offset': '0',
      'mkt': 'en-us',
      'safeSearch': 'Moderate',
      })
      print param
      try:
        conn = httplib.HTTPSConnection('api.cognitive.microsoft.com')
        conn.request("GET", "/bing/v5.0/images/search?%s" % params, "{body}", headers)
        response = conn.getresponse()
        data = response.read()
        data_json  = json.loads(data)
        url = data_json['value'][0]['contentUrl']
        print url
        sql_insert = "UPDATE Movies SET image_url=%s WHERE mid=%s "
        sql_data = (url,i)
        try:
          x.execute(sql_insert,sql_data)
          db.commit()
        except:
          print 'cheese'
          db.rollback()
      except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))
      #time.sleep(5)
except:
  print "Error: unable to fetch data"
db.close()

