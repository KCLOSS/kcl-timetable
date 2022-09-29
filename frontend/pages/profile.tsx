import axios from "axios";
import { InputHTMLAttributes, useState } from "react";
import Input from "../components/Input";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Footer from "../components/Footer";
import { AuthInterface } from "../lib/auth";

interface FieldProps {
  title: string;
  onChange?: (v: string) => void;
}

function Field({
  title,
  onChange,
  ...props
}: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <div>
      <div className="mt-2">{title}</div>
      <Input {...props} onChange={(e) => onChange(e.currentTarget.value)} />
    </div>
  );
}

const ProfilePage = ({ user }: AuthInterface) => {
  if (!user) return <Navbar />;

  const [surname, setSurname] = useState(user.surname ?? "");
  const [avatar, setAvatar] = useState(user.avatar ?? "");
  const [bio, setBio] = useState(user.bio ?? "");

  const [state, setState] = useState<"unchanged" | "changed" | "processing">(
    "unchanged"
  );
  const [error, setError] = useState<string | undefined>();

  function save() {
    setState("processing");
    setError(undefined);

    axios
      .post("/api/update", {
        surname,
        avatar,
        bio,
      })
      .catch((error) => setError(error?.response?.data ?? "" + error))
      .finally(() => setState("unchanged"));
  }

  return (
    <div className="select-none p-4 max-w-5xl mx-auto flex flex-col">
      <title>Your Profile</title>

      <Navbar user={{ ...user, surname, avatar }} />

      <h1 className="text-center text-4xl mt-4">Your Profile</h1>

      <div className="mx-auto mt-4 mb-8 flex flex-col items-center">
        <Field
          title="First / Full Name"
          value={(user.firstname as any).toTitleCase()}
          disabled={true}
        />
        <Field
          title="Surname (Legacy)"
          value={surname}
          onChange={setSurname}
          disabled={state === "processing"}
          onKeyDown={() => state !== "changed" && setState("changed")}
          maxLength={64}
        />
        <Field
          title="Short Bio"
          value={bio}
          onChange={setBio}
          disabled={state === "processing"}
          onKeyDown={() => state !== "changed" && setState("changed")}
          maxLength={64}
        />
        <Field
          title="Avatar"
          value={avatar}
          onChange={setAvatar}
          disabled={state === "processing"}
          onKeyDown={() => state !== "changed" && setState("changed")}
          maxLength={256}
        />
        <div className="text-sm py-2 my-1 text-center">
          <b>Whitelisted origins:</b>
          <ul>
            <li>cdn.discordapp.com</li>
            <li>autumn.revolt.chat</li>
          </ul>
        </div>
        <div className="mt-1">
          <Button type="submit" onClick={save} disabled={state !== "changed"}>
            Save
          </Button>
        </div>
        {error && <div className="text-red-700 mt-4">{error}</div>}
      </div>

      {/*<h1 className="text-center text-4xl mt-4">
				Security
			</h1>

			<div className="mx-auto mt-4 mb-8 flex flex-col items-center">
				<Field
					title="Set passphrase"
					value={avatar}
					onChange={setAvatar}
					disabled={state === 'processing'}
					onKeyDown={() => state !== 'changed' && setState('changed')}
					maxLength={256}
				/>
				<div className="mt-1">
					<Button
						type="submit"
						onClick={save}
						disabled={state !== 'changed'}>
						Update
					</Button>
				</div>
			</div>*/}

      <div className="text-center text-gray-700 text-xs select-all">
        {user._id}
      </div>

      <div className="mx-auto my-4">
        <a href="/api/logout">
          <Button>Logout</Button>
        </a>
      </div>

      <Footer />
    </div>
  );
};

export { getServerSideProps } from "../lib/auth";
export default ProfilePage;
