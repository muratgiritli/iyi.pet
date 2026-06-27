import { useState } from "react";
import { X, Star, Check, ShieldCheck, Upload, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateReview,
  getListPublicReviewsQueryKey,
  getListReviewsQueryKey,
  getListBrandsQueryKey,
  getGetStatsQueryKey,
} from "@workspace/api-client-react";
import { getApiErrorMessage } from "@/lib/apiError";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReviewModalProps {
  brandName: string;
  brandId: number;
  onClose: () => void;
}

export function ReviewModal({ brandName, brandId, onClose }: ReviewModalProps) {
  const queryClient = useQueryClient();
  const createReview = useCreateReview();
  const { t } = useLanguage();

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
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit =
    firstName.trim() && lastName.trim() && phone.trim().length >= 10 &&
    rating > 0 && comment.trim().length >= 10 && terms;

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert(t("modal.fileTooBig")); return; }
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoBase64(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!canSubmit || createReview.isPending) return;
    setErrorMsg("");
    try {
      await createReview.mutateAsync({
        data: {
          brandId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          rating,
          title: title.trim(),
          text: comment.trim(),
          petType: petType || undefined,
          photoBase64: photoBase64 ?? null,
        },
      });
      queryClient.invalidateQueries({ queryKey: getListPublicReviewsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListReviewsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getListBrandsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err, t("modal.errorDefault")));
    }
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
          <h2 className="text-base font-bold text-gray-900">{t("modal.title", { brand: brandName })}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500" data-testid="button-close-modal">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-14 px-5 gap-3 overflow-y-auto">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={28} className="text-green-600" />
            </div>
            <p className="text-base font-semibold text-gray-900">{t("modal.submitted")}</p>
            <p className="text-sm text-gray-500 text-center">{t("modal.submittedDesc")}</p>
            <button onClick={onClose} className="mt-2 px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700">
              {t("modal.close")}
            </button>
          </div>
        ) : (
          <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1">
            {/* Personal info */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">{t("modal.personalInfo")}</label>
              <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 mb-3">
                <ShieldCheck size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  {t("modal.privacyA")} <span className="font-semibold">{t("modal.privacyBold")}</span> {t("modal.privacyB")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{t("modal.firstName")} <span className="text-red-400">*</span></label>
                  <input type="text" placeholder={t("modal.firstNamePh")} value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
                    data-testid="input-first-name" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">{t("modal.lastName")} <span className="text-red-400">*</span></label>
                  <input type="text" placeholder={t("modal.lastNamePh")} value={lastName} onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
                    data-testid="input-last-name" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">{t("modal.phone")} <span className="text-red-400">*</span></label>
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
                <label className="text-sm font-semibold text-gray-800">{t("modal.selectRating")}</label>
                <span className="text-sm text-gray-400 font-medium">
                  {t("modal.yourRating")} <span className={rating > 0 ? "text-amber-500 font-bold" : ""}>{rating}</span> / 5
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
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">{t("modal.titleLabel")} <span className="text-gray-400 font-normal">{t("modal.optional")}</span></label>
              <input type="text" placeholder={t("modal.titlePh")} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
                data-testid="input-review-title" />
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">{t("modal.commentLabel")} <span className="text-red-400">*</span></label>
              <div className="relative">
                <textarea
                  placeholder={t("modal.commentPh")}
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
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">{t("modal.petLabel")}</label>
              <select value={petType} onChange={(e) => setPetType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700"
                data-testid="select-pet-type">
                <option value="">{t("modal.petSelect")}</option>
                <option value="Kedi">{t("pet.cat")}</option>
                <option value="Köpek">{t("pet.dog")}</option>
                <option value="Kuş">{t("pet.bird")}</option>
                <option value="Diğer">{t("pet.other")}</option>
              </select>
            </div>

            {/* Photo */}
            <div>
              <label className="text-sm font-semibold text-gray-800 block mb-1.5">{t("modal.photoLabel")} <span className="text-gray-400 font-normal">{t("modal.optional")}</span></label>
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
                    <span className="text-xs text-gray-500">{t("modal.photoHint")}</span>
                    <span className="text-xs text-gray-400 mt-0.5">{t("modal.photoFormats")}</span>
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
                {t("modal.termsA")} <span className="text-green-600 underline cursor-pointer">{t("modal.termsLink")}</span> {t("modal.termsB")}
              </span>
            </label>

            {errorMsg && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5" data-testid="error-review">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 leading-relaxed">{errorMsg}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1 pb-2">
              <button onClick={onClose} className="flex-1 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors" data-testid="button-cancel">
                {t("modal.cancel")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || createReview.isPending}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold rounded-xl transition-colors"
                data-testid="button-submit-review"
              >
                {createReview.isPending ? t("modal.submitting") : t("modal.submit")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
