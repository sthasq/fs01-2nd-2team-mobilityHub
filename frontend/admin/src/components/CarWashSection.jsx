import { CCTVFeed } from "./CCTVFeed";
import { Droplets, Clock, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CARWASH_IMAGE =
  "https://images.unsplash.com/photo-1760827797819-4361cd5cd353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3YXNoJTIwc2VydmljZXxlbnwxfHx8fDE3NjQyODMzOTV8MA&ixlib=rb-4.1.0&q=80&w=1080";

export function CarWashSection() {
  const washJobs = [
    {
      id: "1",
      plateNumber: "12가3456",
      status: "진행중",
      startTime: "14:20",
      estimatedTime: 15,
      washType: "프리미엄 세차",
    },
    {
      id: "2",
      plateNumber: "78나9012",
      status: "대기중",
      startTime: "14:35",
      estimatedTime: 10,
      washType: "기본 세차",
    },
    {
      id: "3",
      plateNumber: "34다5678",
      status: "대기중",
      startTime: "14:50",
      estimatedTime: 15,
      washType: "프리미엄 세차",
    },
    {
      id: "4",
      plateNumber: "90라1234",
      status: "완료",
      startTime: "14:05",
      estimatedTime: 10,
      washType: "기본 세차",
    },
  ];

  // 통계 데이터 계산
  const inProgress = washJobs.filter((j) => j.status === "진행중").length;
  const waiting = washJobs.filter((j) => j.status === "대기중").length;
  const completed = washJobs.filter((j) => j.status === "완료").length;

  // 하루 시간별 이용량
  const hourlyData = [
    { hour: "09:00", count: 3 },
    { hour: "10:00", count: 5 },
    { hour: "11:00", count: 7 },
    { hour: "12:00", count: 4 },
    { hour: "13:00", count: 6 },
    { hour: "14:00", count: 8 },
    { hour: "15:00", count: 5 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">진행중</p>
              <p className="text-gray-900 mt-2">{inProgress}대</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">대기중</p>
              <p className="text-gray-900 mt-2">{waiting}대</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">오늘 완료</p>
              <p className="text-gray-900 mt-2">{completed}대</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* CCTV와 이용 현황 */}
      <div className="grid grid-cols-2 gap-6">
        <CCTVFeed cameraId="CAM-WASH-001" title="세차장 카메라" imageUrl={CARWASH_IMAGE} />

        {/* 이용 현황 */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-gray-900">이용 현황</h3>
          </div>

          <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
            {washJobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-gray-900">{job.plateNumber}</p>
                  <p className="text-gray-500 text-sm">{job.washType}</p>
                </div>

                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm ${
                    job.status === "진행중"
                      ? "bg-blue-100 text-blue-700"
                      : job.status === "대기중"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하루 이용량 통계 그래프 */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-gray-900">하루 이용량 통계</h3>
        </div>

        <div className="p-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
