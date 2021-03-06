import pymongo

class Job:
    def __init__(self, db, spec):
        self.db = db
        self.jid = spec["_id"]
        self.cmd = spec["command"]["sh"]
        self.clientId = spec["clientId"]
        self.name = spec["name"]
        pass

    def json(self):
        return {"id": self.jid, "cmd": self.cmd}

    def setReturnValue(self, v):
        self.db.jobs.update({"_id": self.jid}, {"$set": {"retval": v}})
        pass
