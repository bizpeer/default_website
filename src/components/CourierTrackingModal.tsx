import { useState, useEffect } from 'react';
import { CourierCompany } from '../types/OrderTypes';
import {
  fetchCourierTrackingAPI,
  CourierTrackingResult,
  getCourierWebTrackingUrl,
} from '../services/courierTrackingService';

interface CourierTrackingModalProps {
  isOpen: boolean;
  courier?: CourierCompany;
  trackingNumber?: string;
  orderId?: string;
  onClose: () => void;
}

export function CourierTrackingModal({
  isOpen,
  courier = 'CJ대한통운',
  trackingNumber = '',
  orderId = '',
  onClose,
}: CourierTrackingModalProps) {
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<CourierTrackingResult | null>(null);

  useEffect(() => {
    if (isOpen && trackingNumber) {
      setLoading(true);
      fetchCourierTrackingAPI(courier, trackingNumber)
        .then((res) => {
          setTrackingData(res);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen, courier, trackingNumber]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-blue-600">local_shipping</span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                실시간 택배 배송 API 추적
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 rounded-full">
                  {courier} API 연동
                </span>
              </h3>
              {orderId && (
                <p className="text-xs text-slate-500 font-mono">주문번호: {orderId}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Tracking Details Body */}
        {loading ? (
          <div className="py-20 text-center space-y-3 my-auto">
            <span className="material-symbols-outlined text-[48px] text-blue-500 animate-spin">
              autorenew
            </span>
            <p className="text-sm font-bold text-slate-700">
              {courier} API 서버에서 실시간 배송 상태를 수신하는 중입니다...
            </p>
          </div>
        ) : trackingData ? (
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Top Summary Card */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4 shadow-md">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <span className="text-[11px] font-bold text-blue-300 uppercase tracking-widest block">
                    {trackingData.courier} 운송장 번호
                  </span>
                  <span className="text-xl font-mono font-bold tracking-wider text-white">
                    {trackingData.trackingNumber}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block mb-0.5">현재 배송 상태</span>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      trackingData.currentStatus === '배송완료'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    ● {trackingData.currentStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 block">최종 위치</span>
                  <span className="font-bold text-white">{trackingData.lastLocation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">최종 조회시간</span>
                  <span className="font-mono text-slate-300">{trackingData.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600">route</span>
                실시간 이동 경로 타임라인 ({trackingData.steps.length}단계 수신)
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {trackingData.steps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 text-xs">
                    {/* Status Dot */}
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                        idx === trackingData.steps.length - 1
                          ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center flex-wrap gap-1">
                        <span className="font-bold text-slate-900 text-sm">{step.location}</span>
                        <span className="text-[11px] font-mono text-slate-400">{step.time}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">{step.description}</p>
                      {step.driverName && (
                        <p className="text-[11px] text-blue-700 font-bold pt-1">
                          👤 담당 배송기사: {step.driverName} ({step.driverPhone})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 my-auto">
            <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">
              error_outline
            </span>
            <p className="text-xs font-bold">택배 배송 정보를 불러올 수 없습니다.</p>
          </div>
        )}

        {/* Footer Link Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center flex-wrap gap-2">
          <a
            href={getCourierWebTrackingUrl(courier, trackingNumber)}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            {courier} 공식 홈페이지 추적 ➔
          </a>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
