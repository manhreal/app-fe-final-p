import { commonClasses } from "./commonMathUtils";

// Component templates
export const TheorySection = ({ title, icon, formula, description, example }) => (
    <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
        <h3 className={commonClasses.sectionTitle}>
            <span className="mr-2 text-lg">{icon}</span>
            {title}
        </h3>

        {formula && (
            <div className={`${commonClasses.mathDisplay} my-4`}>
                <div className="tex2jax_process text-sm sm:text-base lg:text-lg">
                    {formula}
                </div>
            </div>
        )}

        {description && (
            <p className="text-center text-gray-600 text-xs sm:text-sm lg:text-base mt-3">
                {description}
            </p>
        )}

        {example && (
            <div className={commonClasses.exampleBox}>
                <strong className="text-gray-800 text-xs sm:text-sm lg:text-base">Ví dụ mẫu:</strong>
                <div className="tex2jax_process mt-2 text-xs sm:text-sm lg:text-base overflow-x-auto">
                    {example}
                </div>
            </div>
        )}
    </div>
);

export const InputField = ({ label, value, onChange, type = "number", step, min, max, helpText, required = true }) => (
    <div className="flex flex-col items-center gap-2">
        <label className={commonClasses.label}>{label}:</label>
        <input
            type={type}
            value={value}
            onChange={e => {
                if (e.target.value.length <= 20) {
                    onChange(e.target.value);
                }
            }}
            className={commonClasses.input}
            step={step}
            min={min}
            max={max}
            required={required}
        />
        {helpText && (
            <div className={commonClasses.helpText}>
                {helpText}
            </div>
        )}
    </div>
);

export const SubmitButton = ({
    loading, disabled, onClick,
    normalText = "Tính toán",
    loadingText = "Đang tính toán..."
 }) => (
    <div className="flex justify-center mt-6">
        <button
            type="submit"
            disabled={loading || disabled}
            onClick={onClick}
            className={`${commonClasses.button} ${loading || disabled
                ? 'bg-gray-500 text-white cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
                }`}
        >
            {loading ? loadingText : normalText}
        </button>
    </div>
);

export const ErrorMessage = ({ error }) => (
    error && (
        <div className={commonClasses.errorBox}>
            <strong>❌ Lỗi:</strong> {error}
        </div>
    )
);

export const ResultSection = ({ title, icon, children }) => (
    <div className={`${commonClasses.card} ${commonClasses.cardPadding}`}>
        <h3 className={commonClasses.sectionTitle}>
            <span className="mr-2 text-lg">{icon}</span>
            {title}
        </h3>
        {children}
    </div>
);