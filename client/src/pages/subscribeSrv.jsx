import { useSubscription } from '@apollo/client';
import { gql } from '@apollo/client';

const MESSAGE_SUBSCRIPTION = gql`
  subscription {
    newMessage {
      id
      content
      timestamp
      sender
    }
  }
`;

export const useMessageSubscription = () => {
  const { data: subscriptionData } = useSubscription(MESSAGE_SUBSCRIPTION);
  return subscriptionData?.newMessage;
};