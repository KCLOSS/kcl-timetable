import Navbar from "../../components/Navbar";
import Avatar from "../../components/Avatar";
import { AuthInterface } from "../../lib/auth";
import { EventWithUsers } from "../../components/ListRenderer";

import Utterances from "@insertish/utterances";
import advancedFormat from "dayjs/plugin/advancedFormat";
import AvatarGroup from "../../components/AvatarGroup";
dayjs.extend(advancedFormat);

type Props = AuthInterface & { event?: EventWithUsers };

const person = `select-none rounded-md bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer p-4 my-2 shadow-sm flex items-center gap-2`;
const IndexPage = ({ user, event }: Props) => {
  if (!event) return <>404</>;

  const [showAll, setAll] = useState(false);
  return (
    <div className="p-4 max-w-5xl mx-auto flex flex-col">
      <title>{event.summary}</title>
      <meta
        property="og:site_name"
        content={`${dayjs(event.start)
          .tz(TZ)
          .format("Do [of] MMMM [at] HH:mm")} to ${dayjs(event.end)
          .tz(TZ)
          .format("HH:mm")}`}
      />
      <meta property="og:title" content={event.summary} />
      <meta property="og:description" content={event.description} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`https://kcl.insrt.uk/event/${event._id}`}
      />

      <Navbar user={user} />

      <h1 className="text-2xl text-indigo-600">{event.summary}</h1>
      <Summary title={event.summary} />
      <span className="font-medium">
        {dayjs(event.start).tz(TZ).format("Do [of] MMMM [at] HH:mm")} to{" "}
        {dayjs(event.end).tz(TZ).format("HH:mm")}
      </span>
      <span>{event.location}</span>

      <h2 className="text-xl mt-4 mb-2">Description</h2>
      <div className="whitespace-pre-wrap font-mono p-2 bg-gray-100 rounded">
        {event.description.trim()}
      </div>

      <h2 className="text-xl mt-4 mb-2">People</h2>
      <div>
        {event.people.slice(0, showAll ? event.people.length : 4).map((x) => (
          <div key={x._id} className={person}>
            <Avatar user={x} />
            <div className="flex-grow flex flex-col">
              <span>
                {(x.firstname as any).toTitleCase()} {x.surname}
              </span>
              <span className="text-gray-700">{x.bio}</span>
            </div>
          </div>
        ))}
        {event.people.length > 4 && !showAll && (
          <div
            onClick={() => setAll(true)}
            className={`flex flex-col gap-4 lg:flex-row lg:gap-0 hover:border-indigo-500 bg-indigo-100 hover:bg-indigo-200 border-2 ${person}`}
          >
            <span className="flex-grow text-xl">Click to see all.</span>
            <AvatarGroup people={event.people.slice(5)} overflow={8} />
          </div>
        )}
      </div>

      <h2 className="text-xl mt-4 mb-2 text-center">Discuss With Others</h2>
      <Utterances
        repo="KCLOSS/event-discussion"
        //theme="preferred-color-scheme"
        theme="github-light"
        async
      />
    </div>
  );
};

import { getServerSideProps as getProps } from "../../lib/auth";
import { connectToDatabase } from "../../lib/mongodb";
import dayjs from "dayjs";
import { useState } from "react";
import { EventEmitter } from "stream";
import Summary from "../../components/Summary";
import { TZ } from "../../lib/constants";

export async function getServerSideProps(context): Promise<{ props: Props }> {
  const { props } = await getProps(context);
  const client = await connectToDatabase();

  const event: any = await client
    .db("kcl-timetables")
    .collection("events")
    .findOne({ _id: context.query.id });

  // MongoDB returns them as actual Dates which
  // we can't just serialise again.
  event.start = event.start.toISOString();
  event.end = event.end.toISOString();

  event.people = await client
    .db("kcl-timetables")
    .collection("users")
    .find({ _id: { $in: event.people ?? [] } })
    .toArray();

  return {
    props: {
      ...props,
      event,
    },
  };
}

export default IndexPage;
