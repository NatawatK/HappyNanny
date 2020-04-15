import AWS, { SNS } from "aws-sdk";

export const sns = new AWS.SNS({ region: "ap-southeast-1" });

export function createTopic(topicName: string) {
  const params = {
    Name: topicName,
    Attributes: {
      DisplayName: topicName,
    },
    Tags: [
      {
        Key: "Name",
        Value: `cloud-project-sns-${topicName}`,
      },
    ],
  };
  return new Promise<SNS.Types.CreateTopicResponse>((resolve, reject) => {
    sns.createTopic(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

export function subscribeTopic(topic: string, email: string) {
  const params = {
    Protocol: "EMAIL",
    TopicArn: topic,
    Endpoint: email,
  };

  return new Promise<SNS.Types.SubscribeResponse>((resolve, reject) => {
    sns.subscribe(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

export function publishMessage(
  topic: string,
  subject: string,
  message: string
) {
  const params = {
    TopicArn: topic,
    Subject: subject,
    Message: message,
  };
  return new Promise<SNS.Types.PublishResponse>((resolve, reject) => {
    sns.publish(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
