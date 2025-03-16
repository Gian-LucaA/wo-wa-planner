"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import BookingCalendar from "@/components/bookingCalendar";

export default function Page() {
  const pathname = usePathname();
  const place_id = pathname.split("/").pop();

  return (
    <>
      <h1> {place_id} </h1>
      <BookingCalendar />
    </>
  );
}
