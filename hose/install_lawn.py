import paramiko, time

def get_private_key():
    try:
        f = open("id_rsa")
        key = paramiko.RSAKey.from_private_key(f)
        f.close()
        return key
    except:
        # We have to create it...
        # TODO: Add more bits!
        key = paramiko.RSAKey.generate(1024)
        key.write_private_key_file("id_rsa")
        return key
    pass

# Either we use sudo or not
def authenticate_on_channel(chan, use_sudo, password):
    if use_sudo:
        chan.send("sudo su\n")
        chan.send(password)
        chan.send("\n")
        time.sleep(1)
    else:
        chan.send("su root\n")
        chan.send(password)
        chan.send("\n")
        time.sleep(1)

# Returns (True, ...) on success, (False, ...) otherwise
def install_to_channel(chan, use_sudo, password):
    print "installing to channel"
    # Quick test that we can send commands
    time.sleep(1)
    chan.send("uptime\n")
    print "making dirs"
    # Create a directory in /tmp for us to work in
    chan.send("mkdir /tmp/sprinkler-install/\n")
    chan.send("cd /tmp/sprinkler-install\n")
    chan.send("pwd\n")
    time.sleep(1)
    print "pushing client.py"
    # Copy over the source file
    #chan.send("cat > client.py\n")
    #chan.send(open("../lawn/client.py").read())
    #time.sleep(2)
    #chan.send("%c"%0x03) # Send ctrl-c
    chan.send("echo \"%s\" > client.py\n"%open("../lawn/client.py").read().replace("\"", "\\\""))
    time.sleep(1)
    print "pusing first conf"
    # Copy over the upstart file
    #chan.send("cat > lawn.conf\n")
    #chan.send(open("../lawn/lawn.conf").read())
    #time.sleep(2)
    #chan.send("%c"%0x03)
    chan.send("echo \"%s\" > lawn.conf\n"%open("../lawn/lawn.conf").read().replace("\"", "\\\""))
    time.sleep(1)
    print "pushing other conf"
    # Copy over the initial config file
    #chan.send("cat > sprinkler.conf\n")
    #chan.send(open("../lawn/sprinkler.conf").read())
    #time.sleep(2)
    #chan.send("%c"%0x03)
    chan.send("echo \"%s\" > sprinkler.conf\n"%open("../lawn/sprinkler.conf").read().replace("\"", "\\\""))
    time.sleep(1)
    print "getting root"
    # Sudo
    authenticate_on_channel(chan, use_sudo, password)
    #chan.send("sudo su\n")
    #chan.send(root_pw)
    #chan.send("\n")
    #time.sleep(1)
    print "moving files to directories"
    # Copy the files into their respective locations
    chan.send("cp client.py /usr/bin/sprinkler.py\n")
    chan.send("cp sprinkler.conf /etc/\n")
    chan.send("cp lawn.conf /etc/init/\n")
    time.sleep(1)
    print "create user"
    # Create the user we're running as
    chan.send("adduser --no-create-home --system --disabled-password --disabled-login sprinkler\n")
    time.sleep(1)
    print "create log files"
    # Create the log file
    chan.send("touch /var/log/sprinkler.log\n")
    chan.send("chown sprinkler /var/log/sprinkler.log\n")
    time.sleep(1)
    print "start lawn"
    # Start the lawn node
    chan.send("start lawn\n")
    time.sleep(1)
    print "exit"
    # Finish.
    chan.send("exit\n")
    chan.send("exit\n")
    time.sleep(1)

    # Print out everything that the remote said
    return (True, chan.recv(32000))

def install(hostname, ssh_user, ssh_pw, root_pw):
    client = paramiko.SSHClient()
    client.load_system_host_keys()
    client.set_missing_host_key_policy(paramiko.WarningPolicy())

    client.connect(hostname, 22, ssh_user, ssh_pw)
    chan = client.invoke_shell()

    install_to_channel(chan, True, ssh_pw)
    #print chan.recv(32000)
    pass

def install2(hostname, ssh_user, use_pkey, use_sudo, root_pw=None, ssh_pw=None,
             sudo_pw=None):
    if use_pkey:
        print "installing with private key"
        # Create a client using our private key
        key = get_private_key()

        client = paramiko.SSHClient()
        client.load_system_host_keys()
        client.set_missing_host_key_policy(paramiko.WarningPolicy())

        client.connect(hostname, 22, username=ssh_user, pkey=key)
        chan = client.invoke_shell()

        pw = None
        if use_sudo:
            pw = sudo_pw
        else:
            pw = root_pw
        install_to_channel(chan, use_sudo, pw)
        pass
    else:
        print "installing without private key"
        install(hostname, ssh_user, ssh_pw, root_pw)
        #client = paramiko.SSHClient()
        #chan = client.invoke_shell()
        #client.connect(hostname, 22, username=ssh_user)
        #pw = None
        #if use_sudo:
        #    pw = sudo_pw
        #else:
        #    pw = root_pw
        #install_to_channel(chan, use_sudo, pw)
