export const commonClasses = {
    container: "mx-auto min-h-screen px-2 sm:px-4 max-w-full lg:max-w-6xl",
    card: "bg-white rounded-xl shadow-lg border border-gray-200 mb-6 overflow-hidden",
    cardPadding: "p-3 sm:p-4 lg:p-6",
    sectionTitle: "text-base sm:text-lg lg:text-xl font-semibold text-gray-700 mb-4 flex items-center",
    mathDisplay: "text-center p-3 sm:p-4 lg:p-5 bg-gray-50 rounded-lg border-2 border-gray-300 overflow-x-auto",
    button: "px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300",
    input: "w-48 px-2 sm:px-3 py-2 border-2 border-gray-300 rounded-md text-center text-sm sm:text-base font-medium focus:border-blue-500 focus:outline-none",
    label: "font-semibold text-gray-700 text-xs sm:text-sm lg:text-base",
    helpText: "text-xs text-gray-500 mt-1 text-center",
    tableCell: "px-1 sm:px-2 lg:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm",
    tableHeader: "px-1 sm:px-2 lg:px-4 py-2 sm:py-3 text-center font-semibold text-xs sm:text-sm",
    errorBox: "bg-red-100 border border-red-300 text-red-700 px-3 sm:px-4 py-3 rounded-lg mb-6 text-xs sm:text-sm lg:text-base",
    successBox: "p-3 sm:p-4 bg-green-100 border border-green-300 rounded-lg",
    resultBox: "mt-3 p-3 bg-blue-50 rounded border-2 border-blue-200 overflow-x-auto",
    exampleBox: "mt-5 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
};

export const mathJaxConfig = {
    chtml: {
        linebreaks: { automatic: true },
        scale: 0.9,
        minScale: 0.5,
    },
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
    },
    options: {
        ignoreHtmlClass: 'tex2jax_ignore',
        processHtmlClass: 'tex2jax_process'
    },
    startup: {
        ready: () => {
            window.MathJax.startup.defaultReady();
        }
    }
};

export const initializeMathJax = (setMathJaxReady) => {
    if (window.MathJax) {
        setMathJaxReady(true);
        return;
    }

    window.MathJax = {
        ...mathJaxConfig,
        startup: {
            ready: () => {
                window.MathJax.startup.defaultReady();
                setMathJaxReady(true);
            }
        }
    };

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.min.js';
    script.async = true;
    document.head.appendChild(script);
};

export const renderMathJax = (mathJaxReady) => {
    if (window.MathJax && window.MathJax.typesetPromise && mathJaxReady) {
        return window.MathJax.typesetPromise().catch(err =>
            console.error('MathJax rendering error:', err)
        );
    }
    return Promise.resolve();
};
