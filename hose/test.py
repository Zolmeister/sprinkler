import telnetlib, json, time

def getReply(tn):
    while 1:
        s = tn.read_very_eager()
        if len(s) > 0:
            return s

def send(tn, d):
    tn.write(json.dumps(d)+"\n")

def perform(tn,d):
    send(tn,d)
    return json.loads(getReply(tn))

tn = telnetlib.Telnet("localhost", 7777)
print getReply(tn)

send_d = {"createClient": {"hostname": "14.14.1fs4.14", "default": "lane", "ssh_user": "lane", "ssh_pw": "password", "root_pw": "password", "jobs": []}}

print "Testing invalid createClient URL:"
tn.write(json.dumps(send_d)+"\n")
print getReply(tn)

print "\nTesting client creation:"
send_d["createClient"]["hostname"] = "192.168.2.77"
reply = perform(tn,send_d)
print reply

print "\nTesting job creation:"
send_d = {"newJob": {"client_id": reply["id"], "job": {"cmd": "uptime"}}}
reply = perform(tn, send_d)
print reply

print "\nFetching job status:"
send_d = {"getJob": reply["id"]}
print perform(tn, send_d)

print "\nFetching job status again (letting it complete):"
send_d = {"getJob": reply["id"]}
print perform(tn, send_d)
