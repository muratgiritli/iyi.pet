import { useState, useRef } from "react";
import { X, Star, ImageIcon, ChevronDown, Check, ShieldCheck } from "lucide-react";

interface ReviewModalProps {
  brandName: string;
  onClose: () => void;
}

const petTypes = [
  "Kedi",
  "Köpek",
  "Kuş",
  "Balık",
  "Hamster",
  "Tavşan",
  "Diğer",
];

export function ReviewModal({ brandName, onClose }: ReviewModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [petType, setPetType] = useState("");
  const [petDropdownOpen, setPetDropdownOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhotoName(file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setPhotoName(file.name);
  };

  const canSubmit = firstName.trim().length > 0 && lastName.trim().length > 0 && phone.trim().length > 0 && rating > 0 && comment.trim().length > 0 && accepted;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
        data-testid="overlay-review-modal"
      />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[92vh] overflow-y-auto"
        data-testid="modal-review"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-base font-bold text-gray-900">Yorum Yaz</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            data-testid="button-close-modal"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-14 px-5 gap-3">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={28} className="text-green-600" />
            </div>
            <p className="text-base font-semibold text-gray-900">Yorumunuz gönderildi!</p>
            <p className="text-sm text-gray-500 text-center">İnceleme sürecinden sonra yayınlanacaktır.</p>
          </div>
        ) : (
          <div className="px-5 py-5 space-y-5">
            {/* Personal info */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-800">Kişisel Bilgiler</label>
              </div>
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 mb-3">
                <ShieldCheck size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Kişisel bilgileriniz <span className="font-semibold">kimse ile paylaşılmayacaktır.</span> Yalnızca yorum doğrulama amacıyla kullanılır.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Ad <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="Adınız"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Soyad <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="Soyadınız"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Telefon <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d\s+()-]/g, "");
                    setPhone(val);
                  }}
                  maxLength={15}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
                  data-testid="input-phone"
                />
              </div>
            </div>

            {/* Star rating */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-800">Puanınızı seçin</label>
                <span className="text-sm text-gray-400 font-medium">
                  Puanınız{" "}
                  <span className={rating > 0 ? "text-amber-500 font-bold" : ""}>
                    {rating}
                  </span>{" "}
                  / 5
                </span>
              </div>
              <div className="flex items-center gap-2" data-testid="star-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95"
                    data-testid={`button-star-${star}`}
                  >
                    <Star
                      size={32}
                      fill={(hoverRating || rating) >= star ? "#f59e0b" : "none"}
                      className={(hoverRating || rating) >= star ? "text-amber-400" : "text-gray-300"}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">
                Başlık <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
              </label>
              <input
                type="text"
                placeholder="Kısa bir başlık ekleyin"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
                data-testid="input-review-title"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">Yorumunuz</label>
              <div className="relative">
                <textarea
                  placeholder={"Ürün hakkındaki deneyiminizi paylaşın...\n(Enerji, tüy yapısı, sindirim, iştah vb.)"}
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 1000))}
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 resize-none"
                  data-testid="textarea-review-comment"
                />
                <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                  {comment.length} / 1000
                </span>
              </div>
            </div>

            {/* Pet type */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">Evcil hayvanınız</label>
              <div className="relative">
                <button
                  onClick={() => setPetDropdownOpen(!petDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-left"
                  data-testid="button-pet-type"
                >
                  <span className={petType ? "text-gray-900" : "text-gray-400"}>
                    {petType || "Tür seçin"}
                  </span>
                  <ChevronDown size={15} className="text-gray-400" />
                </button>
                {petDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setPetDropdownOpen(false)} />
                    <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      {petTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => { setPetType(type); setPetDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${type === petType ? "text-green-700 font-semibold bg-green-50" : "text-gray-700"}`}
                          data-testid={`option-pet-${type}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Photo upload */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">
                Fotoğraf ekleyin <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
              </label>
              <button
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`w-full border-2 border-dashed rounded-xl py-5 flex flex-col items-center gap-1.5 transition-colors ${dragOver ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
                data-testid="button-photo-upload"
              >
                <ImageIcon size={20} className="text-gray-400" />
                {photoName ? (
                  <span className="text-sm text-green-600 font-medium">{photoName}</span>
                ) : (
                  <>
                    <span className="text-sm text-gray-500">Fotoğraf seçin veya buraya sürükleyin</span>
                    <span className="text-xs text-gray-400">jpg, png (maks. 5MB)</span>
                  </>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleFileChange}
                data-testid="input-photo-file"
              />
            </div>

            {/* Terms */}
            <button
              onClick={() => setAccepted(!accepted)}
              className="flex items-start gap-2.5 w-full text-left"
              data-testid="button-accept-terms"
            >
              <div className={`w-4 h-4 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${accepted ? "bg-green-600 border-green-600" : "border-gray-400 bg-white"}`}>
                {accepted && <Check size={10} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-xs text-gray-600 leading-relaxed">
                Yorumların{" "}
                <span className="text-green-600 underline cursor-pointer">yayınlanma kurallarını</span>
                {" "}kabul ediyorum.
              </span>
            </button>

            {/* Buttons */}
            <div className="flex gap-3 pt-1 pb-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 text-sm font-semibold border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                data-testid="button-cancel-review"
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex-1 py-3 text-sm font-semibold rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700"
                data-testid="button-submit-review"
              >
                Yorumumu Gönder
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
