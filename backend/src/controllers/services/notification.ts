import AWS, { SNS } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

export const sns = new AWS.SNS({ region: "ap-southeast-1" });

export function createTopic(topicName: string) {
  const acceptedTopic = `${topicName.replace(
    /([^A-Za-z0-9]+)/gi,
    "-"
  )}-${uuidv4()}`;
  const params = {
    Name: acceptedTopic,
    Attributes: {
      DisplayName: topicName,
    },
    Tags: [
      {
        Key: "Name",
        Value: `cloud-project-sns-${acceptedTopic}`,
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

export function deleteTopic(topic: string) {
  return new Promise((resolve, reject) => {
    sns.deleteTopic({ TopicArn: topic }, (err, data) => {
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
      console.log(data)
    });
  });
}

export function unsubscribeTopic(subscriptionArn: string) {
  const params = {
    SubscriptionArn: subscriptionArn
  };

  return new Promise((resolve, reject) => {
    sns.unsubscribe(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}


export function publishMessage(
  topic: string,
  subject: string,
  message?: string
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
      console.log(data);
    });
  });
}
