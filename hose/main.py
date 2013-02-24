import paramiko #ssh library
import socket
import json
import struct
if False:
    from head_connection import Connector
else:
    from testing_connector import Connector
import pika, time
import pymongo
from bson import ObjectId
from job import Job
import select
import install_lawn

class LawnConnection:
    def __init__(self, hostname):
        self.hostname = hostname
        self.isWaitingOnReply = False

    def sendPacket(self, packet):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((self.hostname, 4321))
        cmd = json.dumps(packet)
        s.send(struct.pack("I", len(cmd)))
        s.send(cmd)
        self.sock = s
        self.poll = select.poll()
        self.poll.register(self.sock, select.POLLIN)
        self.isWaitingOnReply = True

    def recieveReply(self):
        # Poll the socket
        readable = self.poll.poll(0)
        if len(readable) == 0:
            return None # Nothing was readable

        # Recieve the return value
        l = struct.unpack("I", self.sock.recv(4))[0]
        ret = self.sock.recv(l)
        self.isWaitingOnReply = False
        print ret
        return json.loads(ret)

class Client:
    def __init__(self, db, doc):
        # Information about us in the database
        self.id = str(doc["_id"]) # The mongo ID in string form
        self.hostname = doc["hostname"]
        self.default_job_username = "lane"

        # State information
        self.jobs = []
        for j in doc.get("job_queue", []):
            # j is a job ID
            self.jobs.append(Job(db, db.jobs.find({"_id": j})))

        self.conn = LawnConnection(self.hostname)
        self.finished_jobs = []

    def install(self, ssh_user, ssh_pw, root_pw):
        install_lawn.install(self.hostname, ssh_user, ssh_pw, root_pw)
        pass
        
    def json(self):
        return {}

    def update(self):
        if not self.conn.isWaitingOnReply and len(self.jobs) > 0:
            # Assign a new job!
            self.conn.sendPacket({"cmd": self.jobs[0].cmd})
            pass

        if self.conn.isWaitingOnReply:
            # Check to see if they've replied yet.
            ret = self.conn.recieveReply()
            if ret is not None:
                # Do something with the return value
                self.jobs[0].setReturnValue(ret["retval"])
                self.finished_jobs.append(self.jobs[0])
                del self.jobs[0]
                pass
        pass

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

def handle_AMQP(s):
    pass

def reply(d):
    pass # Send over the AMQP link.

# Doc has the following:
# - IP: IP address of the client.
# - Default User: The user to run as.
# - Job queue: A queue of jobs, which defaults to []
def createClient(doc):
    doc["job_queue"] = []
    if "force_id" in doc:
        doc["_id"] = ObjectId(doc["force_id"])
        del doc["force_id"]
    cid = str(db.clients.insert(doc))

    # Add it to the memory database
    clients[cid] = Client(db, doc)

    # Also, we should SSH in and deploy a lawn node.
    clients[cid].install(doc["ssh_user"], doc["ssh_pw"], doc["root_pw"])

    return cid

def removeClient(cid):
    # TODO: Implement
    pass

# Jobspec contains:
# - "cmd": The shell command.
def createJob(client_id, jobspec):
    j = db.jobs.insert(jobspec)
    clients[client_id].jobs.append(Job(db, db.jobs.find_one({"_id": j})))
    pass

def removeJob(jid):
    pass

def getJobInformation(jid):
    return db.jobs.find({"_id": jid})

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
                d["clientList"].append(c.json())
            reply(d)
        elif "removeClient" in cmd:
            # Remove the client!
            removeClient(cmd["removeClient"])
            pass
        elif "createClient" in cmd:
            # Create a client!
            cid = createClient(cmd["createClient"])
            reply({"id": cid})
        elif "newJob" in cmd:
            # Add a job to (someone's) queue
            createJob(cmd["newJob"]["client_id"], cmd["newJob"]["job"])
            reply({"success": True})
        elif "removeJob" in cmd:
            # Remove/cancel a job from the queue
            removeJob(cmd["removeJob"])
            pass
        elif "getJob" in cmd:
            # Retreive information about a job
            reply(getJobInformation(cmd["getJob"]))
    except pika.exceptions.AMQPConnectionError:
        print "We aren't connected to the head."
        pass # We probably aren't connected

    time.sleep(1)
    pass
