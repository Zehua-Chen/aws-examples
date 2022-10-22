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

async ValueTask<DescribeInstancesResponse> WaitUntilInstanceIsRunning(IAmazonEC2 ec2, Instance instance)
{
    DescribeInstancesRequest describeRequest = new();
    describeRequest.InstanceIds = new List<string>() { instance.InstanceId };

    while (true)
    {
        DescribeInstancesResponse describeResponse = await ec2.DescribeInstancesAsync(describeRequest);
        Instance describedInstance = describeResponse.Reservations[0].Instances[0];

        if (describedInstance.State.Name == InstanceStateName.Running)
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

const string ImageId = "ami-06b263d6ceff0b3dd";
AmazonEC2Client client = new();

RunInstancesResponse runInstances = await RunInstance(client, imageId: ImageId);
Instance instance = runInstances.Reservation.Instances[0];
Console.WriteLine($"Instance {instance.InstanceId} created");

Console.WriteLine("Waiting for instances to start");
DescribeInstancesResponse describeInstances = await WaitUntilInstanceIsRunning(client, instance);
instance = describeInstances.Reservations[0].Instances[0];
Console.WriteLine($"Public DNS name = {instance.PublicDnsName}");
Console.WriteLine($"Public IP address = {instance.PublicIpAddress}");

Console.WriteLine("Press enter to delete the resources");
Console.ReadLine();

await TerminateInstance(client, instance);
Console.WriteLine("Instance deleted");