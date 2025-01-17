export interface IEvent {
  id: string;
  summary: string;
  description: string;
  colorId: string;
  start: {
    date?: string | undefined;

    // The time, as a combined date-time value (formatted according to RFC3339).
    // A time zone offset is required unless a time zone is explicitly specified in timeZone.
    dateTime?: string | undefined;

    // The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".)
    // For recurring events this field is required and specifies the time zone in which the recurrence is expanded.
    // For single events this field is optional and indicates a custom time zone for the event start/end.
    timeZone?: string | undefined;
  };

  // The (exclusive) end time of the event. For a recurring event, this is the end time of the first instance.
  end: {
    // The date, in the format "yyyy-mm-dd", if this is an all-day event.
    date?: string | undefined;

    // The time, as a combined date-time value (formatted according to RFC3339).
    // A time zone offset is required unless a time zone is explicitly specified in timeZone.
    dateTime?: string | undefined;

    // The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. "Europe/Zurich".)
    // For recurring events this field is required and specifies the time zone in which the recurrence is expanded.
    // For single events this field is optional and indicates a custom time zone for the event start/end.
    timeZone?: string | undefined;
  };
}
