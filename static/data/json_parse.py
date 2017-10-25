import json
ifile = open('twitter.json', 'r')
ofile = open('twitter_parse.json', 'w')
jdecode = json.load(ifile)
parse = []
for item in jdecode:
    idict = {}
    idict["name"] = item.get("user").get("name")
    idict["time"] = item.get("created_at")
    coord = item.get("coordinates").get("coordinates")
    print(coord)
    idict["location"] = {}
    idict["location"]["lon"] = coord[0]
    idict["location"]["lat"] = coord[1]
    idict["text"] = item.get("text")
    idict["profile"] = item.get("user").get("profile_image_url")
    parse.append(idict)
back = json.dumps(parse)
ofile.write(json.dumps(parse))
ofile.close()
