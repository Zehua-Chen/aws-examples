# EC2 Creation

- EC2 does not have explicit create instance request. Instead, create and start
  an instance is done in a single "run instance" request

## Volumes

- Volume must be attached after the EC2 instance is available
- Root volume by default will be deleted after instance termination
- Attached volume will not be deleted after instance termination
- Volume can only be deleted after an EC2 instance has been stopped or
  terminated
