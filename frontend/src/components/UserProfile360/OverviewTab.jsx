import OverviewItem from "./shared/OverviewItem";
import { formatDate } from "./shared/helpers";

const OverviewTab = ({ personalDetails, staffStats }) => (
  <div>
    {/* Section title */}
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-[11px] bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-base">
        👤
      </div>
      <h3 className="text-[17px] font-bold text-slate-100">
        Personal Information
      </h3>
    </div>

    {/* Divider */}
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-600 whitespace-nowrap">
        Contact & details
      </span>
      <div className="flex-1 h-px bg-white/5" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <OverviewItem
        emoji="📞"
        label="Phone Number"
        value={personalDetails.phone}
      />
      <OverviewItem
        emoji="📅"
        label="Date of Birth"
        value={formatDate(personalDetails.profile?.personal?.dob)}
      />
      <OverviewItem
        emoji="🩸"
        label="Blood Group"
        value={personalDetails.profile?.personal?.bloodGroup}
      />
      <OverviewItem
        emoji="🎓"
        label="Course"
        value={personalDetails.profile?.academic?.course}
      />
      <OverviewItem
        emoji="📋"
        label="Batch"
        value={personalDetails.profile?.academic?.batch}
      />
      <OverviewItem
        emoji="🏫"
        label="Semester"
        value={personalDetails.profile?.academic?.semester}
      />
      {staffStats?.department && (
        <OverviewItem
          emoji="🏢"
          label="Department"
          value={staffStats.department}
        />
      )}
      {personalDetails.profile?.contact?.currentAddress && (
        <OverviewItem
          emoji="📍"
          label="Current Address"
          value={personalDetails.profile.contact.currentAddress}
          fullWidth
        />
      )}
    </div>
  </div>
);

export default OverviewTab;
