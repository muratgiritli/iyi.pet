import { useState } from "react";
import { X, Star, Check, ShieldCheck, Upload } from "lucide-react";
import { useData } from "@/contexts/DataContext";

interface ReviewModalProps {
  brandName: string;
  brandId: number;
  onClose: () => void;
}

export function ReviewModal({ brandName, brandId, onClose }: ReviewModalProps) {
  const { addReview } = useData();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [petType, setPetType] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string | undefined>();
  const [photoName, setPhotoName] = useState("");
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit =
    firstName.trim() && lastName.trim() && phone.trim().length >= 10 &&
    rating > 0 && comment.trim().length >= 10 && terms;

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Dosya 5MB'den büyük olamaz."); return; }
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoBase64(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    const initial = firstName.trim()[0]?.toUpperCase() ?? "?";
    const author = `${firstName.trim()} ${lastName.trim()[0]?.toUpperCase()}.`;
    addReview({
      brandId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      author,
      avatar: initial,
      rating,
      title: title.trim(),
      text: comment.trim(),
      petType,
      photoBase64,
      status: "pending",
    });
    setSubmitted(true);
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40"
        style={{ animation: "fade-in 0.2s ease" }}
        onClick={onClose}
        data-testid="overlay-review-modal"
      />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-white rounded-t-2xl shadow-2xl max-h-[78vh] sm:max-h-[82vh]"
        style={{ animation: "slide-up 0.28s cubic-bezier(0.32,0.72,0,1)" }}
        data-testid="modal-review"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-5 py-3 flex items-center justify-between flex-shrink-0">
          <h2 className="text-base font-bold text-gray-900">Yorum Yaz — {brandName}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500" data-testid="button-close-modal">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-14 px-5 gap-3 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={28} className="text-green-600" />
            </div>
            <p className="text-base font-semibold text-gray-900">Yorumunuz gönderildi!</p>
            <p className="text-sm text-gray-500 text-center">İnceleme sürecinden sonra yayınlanacaktır.</p>
            <button onClick={onClose} className="mt-2 px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700">
              Kapat
            </button>
          </div>
        ) : (
          <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
            {/* Personal info */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">Kişisel Bilgiler</label>
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 mb-3">
                <ShieldCheck size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Kişisel bilgileriniz <span className="font-semibold">kimse ile paylaşılmayacaktır.</span> Yalnızca yorum doğrulama amacıyla kullanılır.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Ad <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="Adınız" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
                    data-testid="input-first-name" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Soyad <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="Soyadınız" value={lastName} onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
                    data-testid="input-last-name" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Telefon <span className="text-red-400">*</span></label>
                <input type="tel" placeholder="05XX XXX XX XX" value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d\s+()-]/g, ""))}
                  maxLength={15}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
                  data-testid="input-phone" />
              </div>
            </div>

            {/* Star rating */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-800">Puanınızı seçin</label>
                <span className="text-sm text-gray-400 font-medium">
                  Puanınız <span className={rating > 0 ? "text-amber-500 font-bold" : ""}>{rating}</span> / 5
                </span>
              </div>
              <div className="flex items-center gap-2" data-testid="star-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95" data-testid={`button-star-${star}`}>
                    <Star size={32} fill={(hoverRating || rating) >= star ? "#f59e0b" : "none"}
                      className={(hoverRating || rating) >= star ? "text-amber-400" : "text-gray-300"} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">Başlık <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
              <input type="text" placeholder="Kısa bir başlık ekleyin" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
                data-testid="input-review-title" />
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">Yorumunuz <span className="text-red-400">*</span></label>
              <div className="relative">
                <textarea
                  placeholder={"Ürün hakkındaki deneyiminizi paylaşın...\n(Enerji, tüy yapısı, sindirim, iştah vb.)"}
                  value={comment} onChange={(e) => setComment(e.target.value.slice(0, 1000))}
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none placeholder:text-gray-400"
                  data-testid="input-review-comment"
                />
                <span className="absolute bottom-2 right-3 text-xs text-gray-400">{comment.length} / 1000</span>
              </div>
            </div>

            {/* Pet type */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">Evcil hayvanınız</label>
              <select value={petType} onChange={(e) => setPetType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700"
                data-testid="select-pet-type">
                <option value="">Tür seçin</option>
                <option value="Kedi">Kedi</option>
                <option value="Köpek">Köpek</option>
                <option value="Kuş">Kuş</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>

            {/* Photo */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">Fotoğraf ekleyin <span className="text-gray-400 font-normal">(isteğe bağlı)</span></label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg py-4 px-3 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all" data-testid="input-photo">
                <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                {photoBase64 ? (
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <img src={photoBase64} alt="" className="w-10 h-10 object-cover rounded" />
                    <span className="font-medium">{photoName}</span>
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Fotoğraf seçin veya buraya sürükleyin</span>
                    <span className="text-xs text-gray-400 mt-0.5">jpg, png (maks. 5MB)</span>
                  </>
                )}
              </label>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer" data-testid="label-terms">
              <div
                onClick={() => setTerms(!terms)}
                className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${terms ? "bg-green-600 border-green-600" : "border-gray-300"}`}
                data-testid="checkbox-terms"
              >
                {terms && <Check size={10} className="text-white" />}
              </div>
              <span className="text-xs text-gray-600 leading-relaxed">
                Yorumların <span className="text-green-600 underline cursor-pointer">yayınlanma kurallarını</span> kabul ediyorum.
              </span>
            </label>

            {/* Actions */}
            <div className="flex gap-3 pt-1 pb-2">
              <button onClick={onClose} className="flex-1 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors" data-testid="button-cancel">
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold rounded-xl transition-colors"
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
