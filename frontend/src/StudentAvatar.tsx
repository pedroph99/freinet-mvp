import { useState } from "react";

const initials = (name: string) => name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();

export default function StudentAvatar({ name, photo, large = false }: { name: string; photo: string | null; large?: boolean }) {
  const [failed, setFailed] = useState(false);

  return <div className={`avatar${large ? " avatar-large" : ""}`}>
    {photo && !failed
      ? <img src={photo} alt="" loading={large ? "eager" : "lazy"} decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      : initials(name)}
  </div>;
}
