class Job:
    def __init__(self):
        self.cmd = "uptime"
        pass

class JobSequence:
    def __init__(self, job=None):
        self.jobs = [] # List of jobs
        if job is not None:
            self.jobs.append(job)
