import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  X,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
} from 'lucide-react';

export interface DetectedPlateResult {
  plateNumber: string;
  city: string;
  make?: string;
  model?: string;
}

interface PlateCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlateDetected: (result: DetectedPlateResult) => void;
}

export const PlateCameraModal: React.FC<PlateCameraModalProps> = ({
  isOpen,
  onClose,
  onPlateDetected,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [detectedResult, setDetectedResult] = useState<DetectedPlateResult | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start camera stream when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setDetectedResult(null);
      setIsAnalyzing(false);
      setAnalysisError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('کامێرا لەسەر ئەم وێبگەڕە پشتگیری ناکرێت، دەتوانیت وێنە لە فایلەوە باربکەیت.');
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError('ڕێگەپێدانی کامێرا نەدراوە یاخود کامێرا بەردەست نییە. دەتوانیت وێنەی تابلۆکە باربکەیت.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Flip camera between front and back
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Snap photo from video feed
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setCapturedImage(dataUrl);

    stopCamera();
    analyzePlateImage(dataUrl);
  };

  // Upload photo from device storage or native camera
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCapturedImage(dataUrl);
        stopCamera();
        analyzePlateImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Call OCR API or fallback
  const analyzePlateImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setDetectedResult(null);

    try {
      const response = await fetch('/api/ocr-plate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64Image,
          mimeType: 'image/jpeg',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const json = await response.json();
      if (json.success && json.data?.plateNumber) {
        const result: DetectedPlateResult = {
          plateNumber: json.data.plateNumber,
          city: json.data.city || 'سلێمانی',
          make: json.data.make,
          model: json.data.model,
        };
        setDetectedResult(result);
      } else {
        throw new Error('نەتوانرا ژمارەی تابلۆکە بە ڕوونی بخوێندرێتەوە');
      }
    } catch (err: any) {
      console.warn('API error, falling back to heuristic parsing:', err);
      // Fallback: try reading or present preset option
      setAnalysisError('نەتوانرا تابلۆکە بخوێندرێتەوە، تکایە ڕووناکی باشتر بکە یاخود ژمارەکە بنووسە.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply quick test demonstration plate
  const handleApplyPreset = (plateNum: string, cityName: string, make?: string, model?: string) => {
    const result: DetectedPlateResult = {
      plateNumber: plateNum,
      city: cityName,
      make,
      model,
    };
    setDetectedResult(result);
  };

  const handleConfirmAndApply = () => {
    if (detectedResult) {
      onPlateDetected(detectedResult);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setDetectedResult(null);
    setAnalysisError(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto text-right font-kurdish">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
              <Camera className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                سکانی تابلۆی ئۆتۆمبێل بە کامێرا
              </h3>
              <p className="text-[11px] text-slate-500">
                خوێندنەوەی خودکاریی تابلۆ (وەک: 21 H 11111) بە ژیری دەستکرد
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Video Container */}
        <div className="relative bg-black w-full aspect-[4/3] flex items-center justify-center overflow-hidden">
          {!capturedImage ? (
            <>
              {/* Live Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* License Plate Target Overlay Box */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div className="w-[85%] max-w-[340px] h-[90px] sm:h-[100px] border-2 border-dashed border-white/80 rounded-2xl relative shadow-[0_0_20px_rgba(255,255,255,0.2)] bg-black/20 backdrop-blur-[1px] flex items-center justify-center">
                  {/* Corner Targets */}
                  <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-white rounded-tl-lg" />
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-white rounded-tr-lg" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-white rounded-bl-lg" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-white rounded-br-lg" />

                  <span className="text-[11px] text-white/90 font-mono tracking-wider bg-black/60 px-2 py-0.5 rounded border border-white/20">
                    21 H 11111
                  </span>
                </div>

                <p className="text-[11px] text-white font-medium text-center mt-3 bg-black/70 px-3 py-1 rounded-full border border-white/10 shadow">
                  تابلۆی ئۆتۆمبێلەکە لە ناو چوارچێوەکە ڕابگرە
                </p>
              </div>

              {/* Flip camera button */}
              <button
                type="button"
                onClick={handleFlipCamera}
                className="absolute top-3 left-3 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-sm transition cursor-pointer"
                title="گۆڕینی کامێرا"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Captured Photo Preview */
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Captured License Plate"
                className="w-full h-full object-cover"
              />

              {/* Scanning Laser Line when analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold text-white bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700 animate-pulse">
                    خوێندنەوە و شیکردنەوەی تابلۆ...
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Camera Error Banner */}
          {cameraError && !capturedImage && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400" />
              <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
                {cameraError}
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white text-slate-950 font-bold text-xs rounded-xl shadow flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                هەڵبژاردنی وێنە لە مۆبایل/فایل
              </button>
            </div>
          )}
        </div>

        {/* Hidden Canvas and File Input */}
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Action Controls & Result Display */}
        <div className="p-4 sm:p-5 space-y-4 bg-white">
          {/* Detected Plate Result Card */}
          {detectedResult && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  تابلۆی دۆزراوە:
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  پشکنین بە سەرکەوتوویی تەواو بوو
                </span>
              </div>

              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-900 text-white font-mono font-bold text-sm rounded-lg shadow-2xs">
                    {detectedResult.plateNumber}
                  </span>
                  {detectedResult.city === 'علوج' ? (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold">
                      ⚠️ علوج (بێ تابلۆ)
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-900 font-bold">
                        {detectedResult.city}
                      </span>
                      {['سلێمانی', 'هەولێر', 'هەڵەبجە', 'دهۆک'].some((c) => detectedResult.city?.includes(c)) && (
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-mono font-bold">
                          KR
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {detectedResult.make && (
                  <span className="text-[11px] text-slate-500">
                    مارکە: <strong className="text-slate-900">{detectedResult.make}</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Analysis Error Notice */}
          {analysisError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
              <span>{analysisError}</span>
              <button
                type="button"
                onClick={handleRetake}
                className="text-rose-900 font-bold hover:underline text-xs cursor-pointer"
              >
                دووبارە هەوڵبدەرەوە
              </button>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2">
            {!capturedImage ? (
              <>
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  وێنە بگرە و سکان بکە (Snap)
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                  title="بارکردنی وێنە"
                >
                  <Upload className="w-4 h-4" />
                  فایل / مۆبایل
                </button>
              </>
            ) : detectedResult ? (
              <>
                <button
                  type="button"
                  onClick={handleConfirmAndApply}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  پڕکردنەوەی خودکاریی خانەکان
                </button>

                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl border border-slate-200 transition cursor-pointer"
                >
                  وێنەی نوێ
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleRetake}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                گرتنەوەی وێنە (Retake)
              </button>
            )}
          </div>

          {/* Quick Demo Test Presets */}
          <div className="border-t border-slate-100 pt-3">
            <span className="text-[10px] text-slate-500 block mb-1.5 font-medium">
              تێستی خێرا (کلیک بکە بۆ تاقیکردنەوەی دەستبەجێ):
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyPreset('21 H 11111', 'سلێمانی', 'Toyota', 'Camry')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[10px] font-mono transition cursor-pointer flex items-center gap-1"
              >
                <span>21 H 11111 (سلێمانی)</span>
                <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">KR</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('22 A 45892', 'هەولێر', 'Toyota', 'Land Cruiser')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[10px] font-mono transition cursor-pointer flex items-center gap-1"
              >
                <span>22 A 45892 (هەولێر)</span>
                <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">KR</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('23 A 55120', 'هەڵەبجە', 'Kia', 'Sportage')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[10px] font-mono transition cursor-pointer flex items-center gap-1"
              >
                <span>23 A 55120 (هەڵەبجە)</span>
                <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">KR</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('24 B 77123', 'دهۆک', 'Hyundai', 'Tucson')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[10px] font-mono transition cursor-pointer flex items-center gap-1"
              >
                <span>24 B 77123 (دهۆک)</span>
                <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1 rounded font-bold">KR</span>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('11 A 90812', 'بەغداد', 'Nissan', 'Sunny')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[10px] font-mono transition cursor-pointer"
              >
                11 A 90812 (بەغداد)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('14 M 33410', 'بەسرە', 'Ford', 'Taurus')}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-[10px] font-mono transition cursor-pointer"
              >
                14 M 33410 (بەسرە)
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('84920', 'علوج', 'Toyota', 'Land Cruiser')}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-[10px] font-mono transition cursor-pointer"
              >
                ⚠️ 84920 (علوج)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
