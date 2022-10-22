using Amazon.EC2;
using Amazon.EC2.Model;

async ValueTask<RunInstancesResponse> RunInstance(IAmazonEC2 ec2, string imageId)
{
    RunInstancesRequest runRequest = new();

    runRequest.InstanceType = InstanceType.T1Micro;
    runRequest.MinCount = 1;
    runRequest.MaxCount = 1;

    // Ubuntu 18.04 LTS 
    runRequest.ImageId = "ami-06b263d6ceff0b3dd";

    RunInstancesResponse runInstanceResponse = await ec2.RunInstancesAsync(runRequest);

    return runInstanceResponse;
}

async ValueTask<CreateVolumeResponse> CreateVolume(IAmazonEC2 ec2)
{
    CreateVolumeRequest createVolumeRequest = new();
    createVolumeRequest.Size = 1;
    createVolumeRequest.VolumeType = VolumeType.Gp2;
    createVolumeRequest.AvailabilityZone = "us-east-1b";

    CreateVolumeResponse createVolumeResponse = await ec2.CreateVolumeAsync(createVolumeRequest);

    return createVolumeResponse;
}

async ValueTask<DescribeVolumesResponse> WaitUntilVolumeHasState(
    IAmazonEC2 ec2, Volume volume, VolumeState state)
{
    DescribeVolumesRequest describeRequest = new();
    describeRequest.VolumeIds = new List<string> { volume.VolumeId };

    while (true)
    {
        DescribeVolumesResponse describeResponse = await ec2.DescribeVolumesAsync(describeRequest);

        if (describeResponse.Volumes[0].State == state)
        {
            return describeResponse;
        }

        await Task.Delay(1000);
    }
}

async ValueTask AttachVolume(IAmazonEC2 ec2, Instance instance, Volume volume)
{
    AttachVolumeRequest attachRequest = new();
    attachRequest.InstanceId = instance.InstanceId;
    attachRequest.VolumeId = volume.VolumeId;
    attachRequest.Device = "/dev/sdn";

    AttachVolumeResponse attachResponse = await ec2.AttachVolumeAsync(attachRequest);
}

async ValueTask<DescribeInstancesResponse> WaitUntilInstanceHasState(
    IAmazonEC2 ec2, Instance instance, InstanceStateName state)
{
    DescribeInstancesRequest describeRequest = new();
    describeRequest.InstanceIds = new List<string>() { instance.InstanceId };

    while (true)
    {
        DescribeInstancesResponse describeResponse = await ec2.DescribeInstancesAsync(describeRequest);
        Instance describedInstance = describeResponse.Reservations[0].Instances[0];

        if (describedInstance.State.Name == state)
        {
            return describeResponse;
        }

        await Task.Delay(1000);
    }
}

async ValueTask TerminateInstance(IAmazonEC2 ec2, Instance instance)
{
    TerminateInstancesRequest terminateRequest = new();
    terminateRequest.InstanceIds = new List<string>() { instance.InstanceId };

    await ec2.TerminateInstancesAsync(terminateRequest);
}

async ValueTask DeleteVolume(IAmazonEC2 ec2, Volume volume)
{
    DeleteVolumeRequest deleteVolume = new();
    deleteVolume.VolumeId = volume.VolumeId;

    await ec2.DeleteVolumeAsync(deleteVolume);
}

const string ImageId = "ami-06b263d6ceff0b3dd";
AmazonEC2Client client = new();

RunInstancesResponse runInstances = await RunInstance(client, imageId: ImageId);
Instance instance = runInstances.Reservation.Instances[0];
Console.WriteLine($"Instance {instance.InstanceId} created");

CreateVolumeResponse createVolume = await CreateVolume(client);
Volume volume = createVolume.Volume;
Console.WriteLine($"Volume created = {volume.VolumeId}");

DescribeVolumesResponse describeVolumes = await WaitUntilVolumeHasState(
    client, volume, VolumeState.Available);
volume = describeVolumes.Volumes[0];
Console.WriteLine("Volume available!");

Console.WriteLine("Waiting for instances to start");
DescribeInstancesResponse describeInstances = await WaitUntilInstanceHasState(
    client, instance, InstanceStateName.Running);
instance = describeInstances.Reservations[0].Instances[0];
Console.WriteLine($"Public DNS name = {instance.PublicDnsName}");
Console.WriteLine($"Public IP address = {instance.PublicIpAddress}");

await AttachVolume(client, instance, volume);
Console.WriteLine("Volume attached!");

Console.WriteLine("Press enter to delete the resources");
Console.ReadLine();

await TerminateInstance(client, instance);
Console.WriteLine("Terminating instance");

await WaitUntilInstanceHasState(client, instance, InstanceStateName.Terminated);
Console.WriteLine("Instance terminated");

await DeleteVolume(client, volume);
Console.WriteLine("Deleting volume");
Console.WriteLine("This operation may take some time.");