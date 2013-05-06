import paramiko
import socket
import json
import struct
import settings
from head_connection import Connector
import pika, time
import pymongo
from bson import ObjectId
from job import Job
import select
import install_lawn
from lawn_connection import LawnConnection
from client import Client

#l = LawnConnection("127.0.0.1")
#l.sendPacket({"cmd": "uptime"})

clients = {}

# Load the clients from the mongo database
conn = pymongo.MongoClient('localhost', 27017)
db = conn.sprinkler

for cdef in db.clients.find():
    c = Client(db, cdef)
    cid = str(cdef["_id"])
    clients[cid] = c
    pass

def reply(d):
    con.send(json.dumps(d))

def createClient(doc):
    print "creating client"
    doc["job_queue"] = []
    if "force_id" in doc:
        doc["_id"] = ObjectId(doc["force_id"])
        del doc["force_id"]
    doc["status"] = "installing"
    print "installing"

    # Check to see if the specified hostname already exists
    if db.clients.find_one({"hostname": doc["hostname"]}):
        print "duplicate creation"
        return (None, "duplicate creation of %s"%doc["hostname"])

    cid = str(db.clients.insert(doc))

    # Add it to the memory database
    c = Client(db, doc)

    if "remote_auth_method" in doc:
        if doc["remote_auth_method"] == "query":
            c.installByQuery()
            clients[cid] = c
            return (cid, "")
        elif doc["remote_auth_method"] == "sudo":
            # Fall-through to the SSH method below
            pass
        pass

    # Also, we should SSH in and deploy a lawn node.
    try:
        #c.install(doc["ssh_user"], doc["ssh_pw"], doc["root_pw"])
        c.install(doc)
    except socket.error:
        print "Could not install the lawn."
        return (cid, "socket error while installing lawn. Check network connection.")
    clients[cid] = c

    return (cid, "")

def removeClient(cid):
    # TODO: Implement
    pass

# Jobspec contains:
# - "cmd": The shell command.
def createJob(client_id, jobspec):
    j = db.jobs.insert(jobspec)
    clients[client_id].jobs.append(Job(db, db.jobs.find_one({"_id": j})))
    return str(j)

def removeJob(jid):
    pass

def getJobInformation(jid):
    d = db.jobs.find_one({"_id": ObjectId(jid)})
    d["id"] = str(d["_id"])
    del d["_id"]
    return d

def getClientJobs(cid):
    jobs = []
    for j in clients[cid].jobs:
        jobs.append(j.json())
    return jobs

# Yay for event loops!
con = Connector()
while 1:
    # Update the clients
    for c in clients:
        clients[c].update()

    # Go check for the head
    try:
        #print con.recieve()
        cmd = con.recieve()
        if cmd == None:
            continue
        print cmd
        cmd = json.loads(cmd)
        if "getClient" in cmd:
            cid = cmd["getClient"]
            reply({"client": clients[cid].json()})
        elif "getClientList" in cmd:
            d = {"clientList": []}
            for c in clients:
                d["clientList"].append(clients[c].json())
            reply(d)
        #elif "removeClient" in cmd:
        #    # Remove the client!
        #    removeClient(cmd["removeClient"])
        #    pass
        elif "newClient" in cmd:
            # Create a client!
            cid = createClient(cmd["newClient"])
            if not cid[0]:
                reply({"success": False, "error": cid[1]})
            else:
                reply({"success": True})
                clientList = []
                for c in clients:
                    clientList.append(clients[c].json())
                reply({"clientList": clientList})
        elif "newJob" in cmd:
            # Add a job to (someone's) queue
            jid = createJob(cmd["newJob"]["clientId"], cmd["newJob"])
            reply({"id": jid, "success": True})
        #elif "removeJob" in cmd:
        #    # Remove/cancel a job from the queue
        #    removeJob(cmd["removeJob"])
        #elif "getJob" in cmd:
        #    # Retreive information about a job
        #    reply(getJobInformation(cmd["getJob"]))
        #elif "getClientJobs" in cmd:
        #    reply(getClientJobs(cmd["getClientJobs"]["id"]))
    except pika.exceptions.AMQPConnectionError:
        print "We aren't connected to the head."

    time.sleep(1)
