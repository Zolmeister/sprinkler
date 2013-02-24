import paramiko, time

def install(hostname, ssh_user, ssh_pw, root_pw):
    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.WarningPolicy())

    client.connect(hostname, 22, ssh_user, ssh_pw)
    chan = client.invoke_shell()

    # Quick test that we can send commands
    time.sleep(5)
    chan.send("uptime\n")

    # Create a directory in /tmp for us to work in
    chan.send("mkdir /tmp/sprinkler-install/\n")
    chan.send("cd /tmp/sprinkler-install\n")
    chan.send("pwd\n")
    time.sleep(1)

    # Copy over the source file
    chan.send("cat > client.py\n")
    chan.send(open("../lawn/client.py").read())
    chan.send("%c"%0x03) # Send ctrl-c
    time.sleep(5)

    # Copy over the upstart file
    chan.send("cat > lawn.conf\n")
    chan.send(open("../lawn/lawn.conf").read())
    chan.send("%c"%0x03)
    time.sleep(5)

    # Copy over the initial config file
    chan.send("cat > sprinkler.conf\n")
    chan.send(open("../lawn/sprinkler.conf").read())
    chan.send("%c"%0x03)
    time.sleep(5)

    # Sudo
    chan.send("sudo su\n")
    chan.send(root_pw)
    chan.send("\n")
    time.sleep(1)

    # Copy the files into their respective locations
    chan.send("cp client.py /usr/bin/sprinkler.py\n")
    chan.send("cp sprinkler.conf /etc/\n")
    chan.send("cp lawn.conf /etc/init/\n")
    time.sleep(5)

    # Create the user we're running as
    chan.send("adduser --no-create-home --system --disabled-password --disabled-login sprinkler\n")
    time.sleep(1)

    # Create the log file
    chan.send("touch /var/log/sprinkler.log\n")
    chan.send("chown sprinkler /var/log/sprinkler.log\n")
    time.sleep(1)

    # Start the lawn node
    chan.send("start lawn\n")
    time.sleep(1)

    # Finish.
    chan.send("exit\n")
    chan.send("exit\n")
    time.sleep(1)

    # Print out everything that the remote said
    return chan.recv(32000)
    #print chan.recv(32000)
    pass
