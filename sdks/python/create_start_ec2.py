"""Create and start EC2 VM
"""
import boto3
# import requests
import time
import os


def create_sg(session: boto3.Session, sg_name, sg_desc):
    ec2 = session.client('ec2', region_name="us-east-1")
    res = ec2.create_security_group(
        GroupName=sg_name,
        Description=sg_desc
    )
    res2 = ec2.authorize_security_group_ingress(
        GroupId=res["GroupId"],
        IpPermissions=[
            {
                'FromPort': 22,
                'IpProtocol': 'tcp',
                'IpRanges': [
                    {
                        'CidrIp': '0.0.0.0/32',
                        'Description': 'SSH access from anywhere',
                    },
                ],
                'ToPort': 22,
            },
        ],
    )


def create_key_pair(name):
    ec2 = boto3.resource('ec2')
    res = ec2.create_key_pair(KeyName=name)
    with open("key_pair.pem", "w") as file:
        file.write(res.key_material)


def create_ec2(amiId, keyName, sgName, instType='t1.micro', minInst=1, maxInst=1):
    ec2 = boto3.resource('ec2')
    instances = ec2.create_instances(
        ImageId=amiId,
        MinCount=minInst,
        MaxCount=maxInst,
        InstanceType=instType,
        KeyName=keyName,
        SecurityGroups=[sgName]
    )
    host = instances[0]
    while host.state['Name'] == 'pending':
        print("Reload")
        time.sleep(1)
        host.load()
    print(instances[0].public_dns_name)


if __name__ == '__main__':
    sg_name = 'securityGroupForDemo'
    sg_desc = 'This is a security group for demo'
    key_name = 'demo-key'
    ami_id = 'ami-06b263d6ceff0b3dd'

    session = boto3.Session(
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"])

    create_sg(session, sg_name, sg_desc)
    create_key_pair(key_name)
    create_ec2(ami_id, key_name, sg_name)
