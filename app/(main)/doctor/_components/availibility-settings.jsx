"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Button } from "@/components/button";
import { Label } from "@/components/label";
import { Clock, Plus, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { setAvailabilitySlots } from "@/actions/doctor";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

export function AvailabilitySettings({ slots }) {
  const [showForm, setShowForm] = useState(false);

  const { loading, fn: submitSlots, data } = useFetch(setAvailabilitySlots);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startHour: "9",
      startMinute: "00",
      startAmPm: "AM",
      endHour: "5",
      endMinute: "00",
      endAmPm: "PM",
    },
  });

  const onSubmit = async (data) => {
    if (loading) return;

    const formData = new FormData();

    // Convert start time to 24h Date
    let startHour = parseInt(data.startHour);
    const startMinute = parseInt(data.startMinute);
    if (data.startAmPm === "PM" && startHour < 12) startHour += 12;
    if (data.startAmPm === "AM" && startHour === 12) startHour = 0;

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    // Convert end time to 24h Date
    let endHour = parseInt(data.endHour);
    const endMinute = parseInt(data.endMinute);
    if (data.endAmPm === "PM" && endHour < 12) endHour += 12;
    if (data.endAmPm === "AM" && endHour === 12) endHour = 0;

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);

    if (startDate >= endDate) {
      toast.error("End time must be after start time");
      return;
    }

    formData.append("startTime", startDate.toISOString());
    formData.append("endTime", endDate.toISOString());

    await submitSlots(formData);
  };

  useEffect(() => {
    if (data?.success) {
      Promise.resolve().then(() => setShowForm(false));
      toast.success("Availability slots updated successfully");
    }
  }, [data]);

  const formatTimeString = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (e) {
      return "Invalid time";
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "15", "30", "45"];
  const ampm = ["AM", "PM"];

  // Common class for dropdowns with hover/focus for dark mode + emerald theme
  const selectClass =
    "bg-background text-white border border-emerald-700 rounded p-2 w-full " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 " +
    "hover:border-emerald-400 transition-colors";

  return (
    <Card className="border-emerald-900/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <Clock className="h-5 w-5 mr-2 text-emerald-400" />
          Availability Settings
        </CardTitle>
        <CardDescription>
          Set your daily availability for patient appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-3">
                Current Availability
              </h3>

              {slots.length === 0 ? (
                <p className="text-muted-foreground">
                  You haven&apos;t set any availability slots yet. Add your
                  availability to start accepting appointments.
                </p>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center p-3 rounded-md bg-muted/20 border border-emerald-900/20"
                    >
                      <div className="bg-emerald-900/20 p-2 rounded-full mr-3">
                        <Clock className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {formatTimeString(slot.startTime)} -{" "}
                          {formatTimeString(slot.endTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {slot.appointment ? "Booked" : "Available"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={() => setShowForm(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Set Availability Time
            </Button>
          </>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 border border-emerald-900/20 rounded-md p-4"
          >
            <h3 className="text-lg font-medium text-white mb-2">
              Set Daily Availability
            </h3>

            {/* Start Time */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="startHour">Start Hour</Label>
                <select
                  id="startHour"
                  {...register("startHour", { required: true })}
                  className={selectClass}
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startMinute">Start Minute</Label>
                <select
                  id="startMinute"
                  {...register("startMinute", { required: true })}
                  className={selectClass}
                >
                  {minutes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startAmPm">AM/PM</Label>
                <select
                  id="startAmPm"
                  {...register("startAmPm", { required: true })}
                  className={selectClass}
                >
                  {ampm.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* End Time */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="endHour">End Hour</Label>
                <select
                  id="endHour"
                  {...register("endHour", { required: true })}
                  className={selectClass}
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endMinute">End Minute</Label>
                <select
                  id="endMinute"
                  {...register("endMinute", { required: true })}
                  className={selectClass}
                >
                  {minutes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endAmPm">AM/PM</Label>
                <select
                  id="endAmPm"
                  {...register("endAmPm", { required: true })}
                  className={selectClass}
                >
                  {ampm.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                disabled={loading}
                className="border-emerald-900/30"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Availability"
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 p-4 bg-muted/10 border border-emerald-900/10 rounded-md">
          <h4 className="font-medium text-white mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-emerald-400" />
            How Availability Works
          </h4>
          <p className="text-muted-foreground text-sm">
            Setting your daily availability allows patients to book appointments
            during those hours. The same availability applies to all days. You
            can update your availability at any time, but existing booked
            appointments will not be affected.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
