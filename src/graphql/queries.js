import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      role
    }
  }
`;

export const MY_REFERRALS_QUERY = gql`
  query MyReferrals {
    myReferrals {
      id
      status
      candidate {
        id
        name
        email
        experienceYears
      }
      referredBy {
        id
        name
      }
    }
  }
`;

export const ALL_REFERRALS_QUERY = gql`
  query AllReferrals {
    allReferrals {
      id
      status
      candidate {
        id
        name
        email
        experienceYears
      }
      referredBy {
        id
        name
        email
      }
    }
  }
`;
