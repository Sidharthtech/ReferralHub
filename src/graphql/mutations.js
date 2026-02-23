import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $role: Role!) {
    register(name: $name, email: $email, password: $password, role: $role) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const CREATE_CANDIDATE_MUTATION = gql`
  mutation CreateCandidate($name: String!, $email: String!, $experienceYears: Int!) {
    createCandidate(name: $name, email: $email, experienceYears: $experienceYears) {
      id
      name
      email
      experienceYears
    }
  }
`;

export const CREATE_REFERRAL_MUTATION = gql`
  mutation CreateReferral($candidateId: ID!) {
    createReferral(candidateId: $candidateId) {
      id
      status
      candidate {
        id
        name
        email
      }
      referredBy {
        id
        name
      }
    }
  }
`;

export const UPDATE_REFERRAL_STATUS_MUTATION = gql`
  mutation UpdateReferralStatus($referralId: ID!, $status: ReferralStatus!) {
    updateReferralStatus(referralId: $referralId, status: $status) {
      id
      status
      candidate {
        id
        name
      }
      referredBy {
        id
        name
      }
    }
  }
`;
