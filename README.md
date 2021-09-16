# KCL Timetable

## Reverse Engineering

Why is it, that every single time any sort of educational institution picks something to do timetables with or generally manage their stuff, they always pick the worst possible option, and it is **always** ASP.NET.

Unlike [Insight](https://gitlab.insrt.uk/insert/insight), which I previously had the pleasure of hooking into, this service which is apparently ran by Scientia is **even slower** than Insight. I genuinely thought I already saw the worst of the worst, with Insight I had to generally wait around 10 or so seconds to load my timetable, but with this? Haha, it takes 30 seconds just for a CORS OPTIONS request! Then takes a further 40 or so seconds to actually load the damn data.

![](/reverse/lol.png)

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

At first glance, it's not terrible, the casing is excusable but there are a few things that stick out:
- `null` data types: not sure why you wouldn't just skip serialising these fields(?)
- `Activity.TeachingWeekPattern_PatternAsArray`: self explanatory
- `Activity.UserText2`, `Activity.UserText3`, `Zone`: why is this inconsistent??

Although again, miles better than having to do XML parsing for when I had to deal with Insight.

My worst complaint so far is the response times, but the Typescript types are going to be a headache.
