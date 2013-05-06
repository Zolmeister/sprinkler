from lawn_connection import LawnConnection
import install_lawn

class Client:
    def __init__(self, db, doc):
        # Information about us in the database
        self.id = str(doc["_id"]) # The mongo ID in string form
        self.hostname = doc["hostname"]
        self.default_job_username = "lane"
        self.status = doc["status"]
        self.db = db

        # State information
        self.jobs = []
        for j in doc.get("job_queue", []):
            # j is a job ID
            self.jobs.append(Job(db, db.jobs.find({"_id": j})))

        self.conn = LawnConnection(self.hostname)
        self.finished_jobs = []

    def installByQuery(self):
        self.conn.sendPacket({"action": "getStatus"})

    #def install(self, ssh_user, ssh_pw, root_pw):
    #    install_lawn.install(self.hostname, ssh_user, ssh_pw, root_pw)
    #    self.installByQuery()
    #    pass

    def install(self, doc):
        #if "sshPassword" in doc and "publicKey" in doc:
        if "sshUser" not in doc:
            # We have a malformed doc!
            print "malformed doc"
            return

        use_pkey = doc.get("publicKey", False)
        use_sudo = True
        if "rootPassword" in doc:
            use_sudo = False
        print "running install"
        install_lawn.install2(self.hostname, doc["sshUser"], use_pkey, use_sudo,
                              root_pw=doc.get("rootPassword", None),
                              ssh_pw=doc.get("sshPassword", None),
                              sudo_pw=doc.get("sshPassword", None))
        """
        if use_pkey:
            if "rootPassword" in doc:
                # Install using keyed ssh and su authentication
                pass
            else:
                # Install using keyed ssh and sudo
                pass
            pass
        else:
            if "rootPassword" in doc:
                #
                """
        pass

    def json(self):
        jobs = []
        for j in jobs:
            jobs.append(j.json())
        return {"id": self.id, "hostname": self.hostname, "status": self.status, "jobs": jobs}

    def update(self):
        if self.status == "installing":
            if not self.conn.isWaitingOnReply:
                self.status = "ready"
                self.db.clients.update({"_id": self.id}, {"$set": {"status": "ready"}})
                # TODO: Report back to the head when this happens.
            return

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
