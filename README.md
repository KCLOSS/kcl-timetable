# KCL Timetable

This service takes advantage of the ability to subscribe directly to the Scientia calendar information allowing users to collate events together and see what events they share.

## Scientia API

API endpoint: https://scientia-eu-v2-4-api-d4-02.azurewebsites.net
Full API "documentation": https://scientia-eu-v2-4-api-d4-02.azurewebsites.net/Help

## Reverse Engineering

Why is it, that every single time any sort of educational institution picks something to do timetables with or generally manage their stuff, they always pick the worst possible option, and it is **always** ASP.NET.

Unlike [Insight](https://gitlab.insrt.uk/insert/insight), which I previously had the pleasure of hooking into, this service which is apparently ran by Scientia is **even slower** than Insight. I genuinely thought I already saw the worst of the worst, with Insight I had to generally wait around 10 or so seconds to load my timetable, but with this? Haha, it takes 30 seconds just for a CORS OPTIONS request! Then takes a further 40 or so seconds to actually load the damn data.

![](/reverse/lol.png)

Edit: I just had a request take 3 minutes, this is insane.

![](/reverse/HOW.png)

Edit 2: Turns out I think whatever infrastructure they have is just crap, because I first tested performance when the email was sent out that timetables are available, the service seems to have stabilised now with requests taking less than 3 seconds, but it's no excuse. I've had Revolt survive the Hacker News hug of death running on the cheapest hardware possible, they should definitely survive a few thousand students.

Of course, being an ASP.NET website, the data you receive is tragic as usual but at least it's not just raw HTML like Insight did it.

```json
[
  {
    "Identity": [UUID],
    "ResourceEvents": [
      {
        "IsBooking": false,
        "BookingInfo": null,
        "ResourceInfo": null,
        "IsEdited": false,
        "IsDeleted": false,
        "EventIdentity": [UUID],
        "StartDateTime": [ISO date string],
        "EndDateTime": [ISO date string],
        "UserManuallyAddedEvent": false,
        "StatusIdentity": [UUID],
        "Status": null,
        "StatusBackgroundColor": null,
        "StatusTextColor": null,
        "Identity": [UUID],
        "Location": "-snip-",
        "Description": "Foundations of Computing 1",
        "HostKey": "-snip-",
        "Name": "-snip-",
        "EventType": "Tutorial",
        "Owner": [UUID],
        "IsPublished": true,
        "LastModified": [ISO date string],
        "ParentKey": null,
        "ExtraProperties": [
          {
            "Name": "Activity.UserText3",
            "DisplayName": "Group(s)",
            "Value": "",
            "Rank": 1
          },
          {
            "Name": "Activity.TeachingWeekPattern_PatternAsArray",
            "DisplayName": "Weeks",
            "Value": "6-10, 12-17",
            "Rank": 2
          },
          {
            "Name": "Activity.UserText2",
            "DisplayName": "Additional Information",
            "Value": "",
            "Rank": 3
          },
          {
            "Name": "Staff",
            "DisplayName": "Staff",
            "Value": "-snip-",
            "Rank": 3
          },
          {
            "Name": "Zone",
            "DisplayName": "Zone",
            "Value": "-snip-",
            "Rank": 5
          }
        ],
        "StatusName": null
      },
      -snip-
    ]
  }
]
```

At first glance, ~~it's not terrible~~ (edit: I just noticed that the whole object is an array), the casing is excusable but there are a few things that stick out:
- `null` data types: not sure why you wouldn't just skip serialising these fields(?)
- `Activity.TeachingWeekPattern_PatternAsArray`: self explanatory
- `Activity.UserText2`, `Activity.UserText3`, `Zone`: why is this inconsistent??

Although again, miles better than having to do XML parsing for when I had to deal with Insight.

My worst complaint so far is the response times, but the Typescript types are going to be a headache.

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
await fetch("https://scientia-eu-v2-4-api-d4-02.azurewebsites.net/api/Calendar?StartDate=2021-09-30T23%3A00%3A00.000Z&EndDate=2021-10-31T23%3A59%3A59.999Z", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Linux i686; rv:100.0) Gecko/20100101 Firefox/100.0",
        "Accept": "*/*",
        "Accept-Language": "en-GB,en-US;q=0.7,en;q=0.3",
        "Authorization": "Bearer [token]",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "Sec-GPC": "1"
    },
    "referrer": "https://mytimetable.kcl.ac.uk/",
    "method": "GET",
    "mode": "cors"
});
```

Ok well I had some issues getting this running in Insomnia, but copy pasting the cURL worked. Now I'm going to test a few scenarios.

#### Valid Date (spanning one week)

Works as intended, returns the week's activities.

#### No Range Specified (or one is missing)

Seems to return about 15x more data, so I think this might be the entire semester. The dates seem to be all jumbled up, so I sorted them and then compared if anything was missing from the actual calendar to find that they do indeed match.
