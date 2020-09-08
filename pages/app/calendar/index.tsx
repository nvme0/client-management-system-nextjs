import { useState } from "react";
import { Stack, Box, Select, IconButton, ButtonGroup } from "@chakra-ui/core";
import { v4 as uuid } from "uuid";
import { queryCache } from "react-query";
import {
  Calendar as ReactCalendar,
  momentLocalizer,
  ToolbarProps,
  View
} from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import CreateEventModal from "components/modals/CalendarEventModal/CreateEventModal";
import EditEventModal from "components/modals/CalendarEventModal/EditEventModal";
import { useQuery, useMutation } from "lib/outbox";
import { QueryKeys } from "lib/queryKeys";

import { Button } from "components/Button";
import {
  GQL_GET_CALENDAR_EVENTS,
  GQL_UPSERT_CALENDAR_EVENT,
  GQL_DELETE_CALENDAR_EVENT
} from "gql/Calendar";
import { GQL_GET_CLIENTS } from "gql/Client";
import { GQL_GET_SERVICES } from "gql/Service";
import {
  GetCalendarEvents,
  GetCalendarEvents_getCalendarEvents as CalendarEvent
} from "gql/__generated__/GetCalendarEvents";
import { GetClients } from "gql/__generated__/GetClients";
import { GetServices } from "gql/__generated__/GetServices";
import { DeleteCalendarEvent } from "gql/__generated__/DeleteCalendarEvent";
import { optimisticUpsert, optimisticDelete } from "lib/optimisticHelpers";
import LoginModal from "components/modals/LoginModal";
import { useLoggedInState } from "lib/loggedInState";
import { useOnlineState } from "lib/network";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(ReactCalendar);

const CustomToolbar = ({ label, onNavigate, onView, view }: ToolbarProps) => {
  return (
    <Box
      {...{
        display: "grid",
        gridGap: 2,
        gridTemplateColumns: {
          base: "1fr 1fr ",
          sm: "1fr 1fr 1fr"
        },
        gridTemplateAreas: {
          base: '"label label" "view buttonGroup"',
          sm: '"view label buttonGroup"'
        },
        py: 2
      }}
    >
      <Box
        {...{
          gridArea: "view",
          display: "flex",
          justifyContent: "left"
        }}
      >
        <Select
          {...{
            width: "auto",
            value: view,
            onChange: (event) => onView(event.target.value as View)
          }}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="agenda">Agenda</option>
        </Select>
      </Box>
      <Box
        {...{
          gridArea: "label",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <h3 className="prose">{label}</h3>
      </Box>
      <ButtonGroup {...{ gridArea: "buttonGroup", justifyContent: "right" }}>
        <Button
          {...{
            "aria-label": "today",
            templateStyle: "secondary-outline",
            onClick: () => onNavigate("TODAY")
          }}
        >
          Today
        </Button>
        <IconButton
          {...{
            "aria-label": "back",
            onClick: () => onNavigate("PREV"),
            icon: <FiChevronLeft />
          }}
        />
        <IconButton
          {...{
            "aria-label": "back",
            onClick: () => onNavigate("NEXT"),
            icon: <FiChevronRight />
          }}
        />
      </ButtonGroup>
    </Box>
  );
};

export const Calendar = () => {
  const { isOnline } = useOnlineState();
  const { isLoggedIn } = useLoggedInState();
  const [state, setState] = useState<{
    Modal?: () => JSX.Element;
  }>({});

  const { data: clients } = useQuery<GetClients>(
    QueryKeys.GET_CLIENTS,
    GQL_GET_CLIENTS,
    {},
    { initialData: { getClients: [] } }
  );

  const { data: services } = useQuery<GetServices>(
    QueryKeys.GET_SERVICES,
    GQL_GET_SERVICES,
    {},
    { initialData: { getServices: [] } }
  );

  const { data: calendarEvents } = useQuery<GetCalendarEvents>(
    QueryKeys.GET_CALENDAR_EVENTS,
    GQL_GET_CALENDAR_EVENTS,
    {},
    { initialData: { getCalendarEvents: [] } }
  );

  const [upsertCalendarEvent] = useMutation<
    GetCalendarEvents,
    { calendarEventInput: CalendarEvent },
    Error,
    () => void
  >(GQL_UPSERT_CALENDAR_EVENT, {
    onMutate: ({ calendarEventInput }) =>
      optimisticUpsert<CalendarEvent, GetCalendarEvents>(
        QueryKeys.GET_CALENDAR_EVENTS,
        calendarEventInput,
        "getCalendarEvents",
        "CalendarEvents"
      ),
    onError: (error, calendarEventInput, rollback) => {
      console.error(error);
      // TODO: store the newService somewhere so the user can edit it and try again later
      rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(QueryKeys.GET_CALENDAR_EVENTS);
    }
  });

  const [deleteCalendarEvent] = useMutation<
    DeleteCalendarEvent,
    { id: string; deletedAt: string },
    Error,
    () => void
  >(GQL_DELETE_CALENDAR_EVENT, {
    onMutate: ({ id }) =>
      optimisticDelete<CalendarEvent, GetCalendarEvents>(
        QueryKeys.GET_CALENDAR_EVENTS,
        id,
        "getCalendarEvents"
      ),
    onError: (error, calendarEventInput, rollback) => {
      console.error(error);
      // TODO: store the newService somewhere so the user can edit it and try again later
      rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(QueryKeys.GET_CALENDAR_EVENTS);
    }
  });

  const handleCreateEvent = ({
    start,
    end
  }: {
    start: string;
    end: string;
  }) => {
    setState({
      ...state,
      Modal: () => (
        <CreateEventModal
          {...{
            calendarEvent: {
              id: uuid(),
              title: "New Event",
              start,
              end,
              allDay: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              notes: "",
              resource: null,
              service: null,
              client: null
            },
            clients: clients?.getClients || [],
            services: services?.getServices || [],
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (calendarEventInput) => {
              upsertCalendarEvent({
                calendarEventInput: {
                  ...calendarEventInput,
                  updatedAt: new Date().toISOString()
                }
              });
            }
          }}
        />
      )
    });
  };

  const handleSelectEvent = (calendarEvent: CalendarEvent) => {
    setState({
      ...state,
      Modal: () => (
        <EditEventModal
          {...{
            calendarEvent,
            clients: clients?.getClients || [],
            services: services?.getServices || [],
            modalProps: {
              isOpen: true,
              onClose: () => setState({ ...state, Modal: undefined })
            },
            handleSave: (calendarEventInput) => {
              upsertCalendarEvent({
                calendarEventInput: {
                  ...calendarEventInput,
                  updatedAt: new Date().toISOString()
                }
              });
            },
            handleDelete: () => {
              const { id, start, end, resource, ...evt } = calendarEvent;
              deleteCalendarEvent({
                id,
                deletedAt: new Date().toISOString()
              });
            }
          }}
        />
      )
    });
  };

  const handleEditEvent = ({ start, end, ...calendarEvent }: CalendarEvent) => {
    if (start > end) {
      [start, end] = [end, start];
    }
    upsertCalendarEvent({
      calendarEventInput: {
        ...calendarEvent,
        start,
        end,
        updatedAt: new Date().toISOString()
      }
    });
  };

  return (
    <>
      <Stack {...{ spacing: 4 }}>
        <Stack>
          <h2 className="prose">Calendar</h2>
        </Stack>
      </Stack>

      <Box
        {...{
          height: {
            base: "100vmin",
            sm: "85vmin"
          },
          minH: "500px",
          minWidth: "296px"
        }}
      >
        <DragAndDropCalendar
          {...{
            localizer,
            events: calendarEvents?.getCalendarEvents.map(
              ({ start, end, ...calendarEvent }) => ({
                ...(calendarEvent as any),
                start: new Date(start),
                end: new Date(end)
              })
            ),
            defaultDate: moment().toDate(),
            defaultView: "month",
            resizable: true,
            selectable: true,
            showMultiDayTimes: true,
            onEventDrop: ({ start, end, event: { ...event } }) => {
              const calendarEvent = (event as unknown) as CalendarEvent;
              handleEditEvent({
                ...calendarEvent,
                start: (start as Date).toISOString(),
                end: (end as Date).toISOString()
              });
            },
            onEventResize: ({ start, end, event: { ...event } }) => {
              const calendarEvent = (event as unknown) as CalendarEvent;
              handleEditEvent({
                ...calendarEvent,
                start: (start as Date).toISOString(),
                end: (end as Date).toISOString()
              });
            },
            onSelectSlot: (slotInfo) => {
              const start = (slotInfo.start as Date).toISOString();
              const end = (slotInfo.end as Date).toISOString();
              handleCreateEvent({ start, end });
            },
            onSelectEvent: ({
              start,
              end,
              ...calendarEvent
            }: Omit<CalendarEvent, "start" | "end"> & {
              start: Date;
              end: Date;
            }) => {
              handleSelectEvent({
                ...calendarEvent,
                start: start.toISOString(),
                end: end.toISOString()
              });
            },
            style: { height: "100%" },
            components: {
              toolbar: CustomToolbar
            }
          }}
        />
      </Box>
      {state.Modal && <state.Modal />}
      <LoginModal
        {...{
          modalProps: {
            isOpen: !isLoggedIn && isOnline,
            onClose: () => {}
          }
        }}
      />
    </>
  );
};

export default Calendar;
