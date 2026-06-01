import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const StudentListTable = ({ students }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      {/* 🖥️ Desktop View  */}
      <div className="hidden md:block overflow-hidden rounded-[20px] border border-white/5 bg-[#0d1117]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-[10px] font-bold tracking-widest uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Branch</th>
              <th className="px-6 py-4">Attendance</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {students.map((student, i) => (
              <tr
                onClick={() =>
                  navigate(`/thinkTank/user-profile/${student._id}`)
                }
                key={i}
                className="hover:bg-white/2 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3">
                  {student?.imageUrl ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={student?.imageUrl}
                        alt={`${student?.userName}'s avatar`}
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-linear-to-tr from-teal-500 to-lime-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                      {student?.fullName?.[0]?.toUpperCase()}
                    </div>
                  )}

                  <span className="text-sm font-medium text-slate-200">
                    {student.fullName}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400 capitalize">
                  {student.branch}
                </td>
                <td className="px-6 py-4 text-sm text-teal-400 font-bold">
                  {student.attendance}%
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="px-2 py-1 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Mobile View  */}
      <div className="md:hidden flex flex-col gap-4">
        {students.map((student, i) => (
          <motion.div
            key={i}
            onClick={() => navigate(`/thinkTank/user-profile/${student._id}`)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-[20px] bg-[#0d1117] border border-white/5 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {student?.imageUrl ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={student?.imageUrl}
                      alt={`${student?.fullName}'s avatar`}
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-teal-500 to-lime-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                    {student?.fullName?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-slate-200 font-bold">
                    {student?.fullName}
                  </h4>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider">
                    {student.branch}
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-full bg-teal-500/10 text-teal-400 text-[9px] font-bold uppercase">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between  gap-2 pt-3 border-t border-white/5">
                <p  className="text-[10px] text-slate-600 font-bold uppercase">
                  Attendance
                </p>
                <p className="text-sm text-teal-400 font-bold">
                  {student.attendance}%
                </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentListTable;
