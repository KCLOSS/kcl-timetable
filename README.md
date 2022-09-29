# TODO: rewrite everything

This works as-is, but a lot of questionable code was written.

# KCL Timetable

This service takes advantage of the ability to subscribe directly to the Scientia calendar information allowing users to collate events together and see what events they share.

This is also a mono-repo of two projects:

- Frontend contains the web application showing timetables.
- Data Worker contains a background process which syncs timetable information periodically.

## Scientia API

API endpoint: https://scientia-eu-v2-4-api-d4-02.azurewebsites.net

Full API "documentation": https://scientia-eu-v2-4-api-d4-02.azurewebsites.net/Help

### Constructing Requests

So there's a couple of requests being sent:

- `/Calendar`: fetches your events
- `/BookingRequests`: presumably used to display potentially scheduled tasks?
  I'm not entirely sure, but we'll find out in the future.
- `/Schema`: fetches some extra garbage from the server about how to format `ExtraProperties`
  We can definitely ignore this one.
- `/InstitutionSettings`: appears to return an object with settings
  There's even some HTML in one of the keys! Truly a staple of ASP.NET applications.
- `/UserProfile`: gets some information about you

Let's look into the `Calendar` requests then:

- Seems to be an `Authorization` header with a Bearer token.
- Two random cookies, assuming to be irrelevant.
- The search range is specified in query parameters.

Here is the request copied as fetch:

```js
await fetch(
  "https://scientia-eu-v2-4-api-d4-02.azurewebsites.net/api/Calendar?StartDate=2021-09-30T23%3A00%3A00.000Z&EndDate=2021-10-31T23%3A59%3A59.999Z",
  {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux i686; rv:100.0) Gecko/20100101 Firefox/100.0",
      Accept: "*/*",
      "Accept-Language": "en-GB,en-US;q=0.7,en;q=0.3",
      Authorization: "Bearer [token]",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      "Sec-GPC": "1",
    },
    referrer: "https://mytimetable.kcl.ac.uk/",
    method: "GET",
    mode: "cors",
  }
);
```

#### Valid Date (spanning one week)

Works as intended, returns the week's activities.

#### No Range Specified (or one is missing)

Seems to return about 15x more data, so I think this might be the entire semester. The dates seem to be all jumbled up, so I sorted them and then compared if anything was missing from the actual calendar to find that they do indeed match.
