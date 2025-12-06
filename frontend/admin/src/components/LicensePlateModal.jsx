import { X, Save } from "lucide-react";

import { useState } from "react";

// 차량 번호판 모달 컴포넌트입니다.
// isOpen: 모달 열림 여부
// onClose: 모달 닫기 함수
// vehicleData: 차량 정보 객체
// onSave: 번호판 저장 시 실행할 외부 함수
export function LicensePlateModal({ isOpen, onClose, vehicleData, onSave }) {
  // 수정할 번호판 내용을 저장
  const [editedPlateNumber, setEditedPlateNumber] = useState(vehicleData.plateNumber);

  // 현재 수정 모드인지 여부를 저장
  const [isEditing, setIsEditing] = useState(false);

  // 모달이 열려 있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  // 저장 버튼 클릭 시 실행 함수
  const handleSave = () => {
    // 외부에서 전달된 onSave 함수에 수정된 번호판을 전달
    onSave(vehicleData.id, editedPlateNumber);
    // 수정 모드를 종료
    setIsEditing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        {/* 상단 헤더 영역 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-gray-900">차량 번호판 확인</h2>
            <p className="text-gray-500 mt-1">{vehicleData.time}</p>
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          {/* 번호판 이미지 영역 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">번호판 이미지</label>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={vehicleData.plateImage}
                alt="차량 번호판"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          {/* 인식된 번호판 수정 영역 */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">인식된 번호판</label>

            <div className="flex gap-3">
              {/* 번호판 입력 필드 */}
              <input
                type="text"
                value={editedPlateNumber}
                onChange={(e) => setEditedPlateNumber(e.target.value)}
                disabled={!isEditing}
                className={`flex-1 px-4 py-3 rounded-lg border text-gray-900 ${
                  isEditing ? "border-blue-500 bg-white" : "border-gray-300 bg-gray-50"
                }`}
              />

              {/* 수정 버튼 또는 저장 버튼 */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  수정
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  저장
                </button>
              )}
            </div>

            {/* 수정 모드일 때 안내 메시지 */}
            {isEditing && (
              <p className="text-gray-500 text-sm mt-2">
                번호판이 제대로 인식되지 않은 경우 수정해주세요.
              </p>
            )}
          </div>

          {/* 차량 정보 표시 영역 */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-gray-500 text-sm">출입 유형</p>
              <p className="text-gray-900 mt-1">{vehicleData.type}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">시간</p>
              <p className="text-gray-900 mt-1">{vehicleData.time}</p>
            </div>
          </div>
        </div>

        {/* 하단 닫기 버튼 */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
