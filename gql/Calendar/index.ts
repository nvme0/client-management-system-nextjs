import { gql } from "graphql-request";

export const GQL_GET_CALENDAR_EVENTS = gql`
  query GetCalendarEvents {
    getCalendarEvents {
      id
      title
      start
      end
      allDay
      notes
      resource
      createdAt
      updatedAt
      service {
        id
        name
        duration
        expires
        notes
        createdAt
        updatedAt
      }
      client {
        id
        firstName
        lastName
        email
        phone
        address
        notes
        programs {
          id
          name
          notes
          services {
            quantity
            service {
              id
              name
              duration
              expires
              notes
              createdAt
              updatedAt
            }
            booked
            used
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GQL_UPSERT_CALENDAR_EVENT = gql`
  mutation UpsertCalendarEvent($calendarEventInput: CalendarEventInput!) {
    upsertCalendarEvent(calendarEventInput: $calendarEventInput) {
      id
      title
      start
      end
      allDay
      notes
      resource
      createdAt
      updatedAt
      service {
        id
        name
        duration
        expires
        notes
        createdAt
        updatedAt
      }
      client {
        id
        firstName
        lastName
        email
        phone
        address
        notes
        programs {
          id
          name
          notes
          services {
            quantity
            service {
              id
              name
              duration
              expires
              notes
              createdAt
              updatedAt
            }
            booked
            used
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GQL_DELETE_CALENDAR_EVENT = gql`
  mutation DeleteCalendarEvent($id: String!, $deletedAt: DateTime!) {
    deleteCalendarEvent(id: $id, deletedAt: $deletedAt)
  }
`;
