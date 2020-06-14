import pandas as pd
import json
import os
import subprocess

def uploadMongo(username, path, db_name, coll_name):
    uri = 'mongodb+srv://' + os.getenv("mongou") + ':' + os.getenv("mongop") + '@cluster0-cofis.mongodb.net/' + db_name
    print(uri)
    subprocess.run(['mongoimport ', '--uri', uri,  '--collection', username, '--file', path, '--mode', 'upsert'])

