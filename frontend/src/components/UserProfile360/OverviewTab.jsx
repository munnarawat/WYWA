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
        value={formatDate(personalDetails.dob)}
      />
      <OverviewItem
        emoji="🩸"
        label="Blood Group"
        value={personalDetails.bloodGroup}
      />
      <OverviewItem emoji="🎓" label="Course" value={personalDetails.course} />
      <OverviewItem
        emoji="🏫"
        label="Semester"
        value={personalDetails.semester}
      />
      {personalDetails.permanentAddress && (
        <OverviewItem
          emoji="📍"
          label="Current Address"
          value={personalDetails.permanentAddress}
          fullWidth
        />
      )}
      {personalDetails.currentAddress && (
        <OverviewItem
          emoji="📍"
          label="Current Address"
          value={personalDetails.currentAddress}
          fullWidth
        />
      )}
    </div>
  </div>
);

export default OverviewTab;
