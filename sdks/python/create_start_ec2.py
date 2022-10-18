"""Create and start EC2 VM
"""
import os
# import requests
import time

import boto3

SECURITY_GROUP_NAME = 'securityGroupForDemo'
SECURITY_GROUP_DESC = 'This is a security group for demo'
KEY_NAME = 'demo-key'
IMAGE_ID = 'ami-06b263d6ceff0b3dd'


def create_security_group(session: boto3.Session, sg_name: str, sg_desc: str):
    """TODO:

    Args:
        session (boto3.Session): _description_
        sg_name (str): _description_
        sg_desc (str): _description_
    """
    ec2 = session.client('ec2', region_name="us-east-1")
    res = ec2.create_security_group(
        GroupName=sg_name,
        Description=sg_desc
    )

    _ = ec2.authorize_security_group_ingress(
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


def create_key_pair(name: str):
    """TODO:

    Args:
        name (str): _description_
    """
    ec2 = boto3.resource('ec2')
    res = ec2.create_key_pair(KeyName=name)

    with open("key_pair.pem", "w", encoding="UTF8") as file:
        file.write(res.key_material)


def create_ec2(
        image_id: str,
        key_name: str,
        security_group_name: str,
        instance_type: str = 't1.micro',
        min_instances: int = 1,
        max_instances: int = 1):
    """TODO:

    Args:
        image_id (str): _description_
        key_name (str): _description_
        security_group_name (str): _description_
        instance_type (str, optional): _description_. Defaults to 't1.micro'.
        min_instances (int, optional): _description_. Defaults to 1.
        max_instances (int, optional): _description_. Defaults to 1.
    """
    ec2 = boto3.resource('ec2')
    instances = ec2.create_instances(
        ImageId=image_id,
        MinCount=min_instances,
        MaxCount=max_instances,
        InstanceType=instance_type,
        KeyName=key_name,
        SecurityGroups=[security_group_name]
    )
    host = instances[0]
    while host.state['Name'] == 'pending':
        print("Reload")
        time.sleep(1)
        host.load()
    print(instances[0].public_dns_name)


def main() -> None:
    """Main
    """
    session = boto3.Session(
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"])

    create_security_group(session, SECURITY_GROUP_NAME, SECURITY_GROUP_DESC)
    create_key_pair(KEY_NAME)
    create_ec2(IMAGE_ID, KEY_NAME, SECURITY_GROUP_NAME)


if __name__ == '__main__':
    main()
