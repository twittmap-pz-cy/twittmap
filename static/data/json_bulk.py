import json
ifile = open('twitter_parse.json', 'r')
ofile = open('twitter_bulk.json', 'a')
dj = json.load(ifile)
x = 1
for item in dj:
    ofile.write('{ "index" : { "_index": "twitter", "_type" : "tweets", "_id" : "')
    ofile.write(str(x))
    ofile.write('"} }')
    ofile.write('\n')
    ofile.write(json.dumps(item))
    ofile.write('\n')
    x += 1
ofile.close()
