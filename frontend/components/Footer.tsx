export default function Footer() {
  return (
    <div className="flex flex-row w-full justify-center gap-2">
      <a href="https://insrt.uk" target="_blank">
        <img
          src="https://autumn.revolt.chat/avatars/6rgg372gI2LrxCUx0CiA2R1Qs6eTtmC-2NpMq1Xa_3?max_side=256"
          className="rounded-full w-12 h-12 object-cover"
        />
      </a>
      <div className="flex flex-col items-center text-sm">
        <span>
          Made by{" "}
          <a href="https://insrt.uk" target="_blank" className="underline">
            insert
          </a>
        </span>
        <span>
          <a
            href="https://github.com/KCLOSS/kcl-timetable"
            target="_blank"
            className="underline"
          >
            Source code
          </a>
        </span>
      </div>
    </div>
  );
}
