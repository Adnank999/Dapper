import CreateProject from "@/app/components/projectComponents/create/CreateProject";
import React from "react";

export default async function projects() {
  return (
    <section className="mt-24 mx-auto max-w-2xl">
      <CreateProject />
    </section>
  );
}
