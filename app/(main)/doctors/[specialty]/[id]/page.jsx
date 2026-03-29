import { redirect, notFound } from "next/navigation";
import { getDoctorById, getAvailableTimeSlots } from "@/actions/appointments";
import { DoctorProfile } from "./_components/doctor-profile";

async function DoctorProfilePage({ params }) {
  const { id } = await params;

  try {
    const [doctorData, slotsData] = await Promise.all([
      getDoctorById(id),
      getAvailableTimeSlots(id),
    ]);

    if (!doctorData?.doctor) return notFound();

    return (
      <DoctorProfile
        doctor={doctorData.doctor}
        availableDays={slotsData?.days || []}
      />
    );
  } catch (error) {
    redirect("/doctors");
    return null; 
  }
}

// Move export to the bottom for Turbopack stability
export default DoctorProfilePage;