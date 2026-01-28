import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actionLogin, actionSignUp } from '../../redux/auth/actions';
import '../../styles/AuthPage.css';
import {
    validateName,
    validateEmail,
    validateMobile,
    validatePassword
} from '../../lib/validations';

const AuthPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    // Mobile responsive state
    const [isMobile, setIsMobile] = useState(false);
    const [showLogin, setShowLogin] = useState(true); 

    // Error states
    const [errors, setErrors] = useState({
        login: '',
        register: ''
    });

    // Validation errors for real-time validation
    const [validationErrors, setValidationErrors] = useState({
        name: '',
        email: '',
        // mobile: '',
        password: '',
        loginEmail: '',
        loginPassword: ''
    });

    // reCAPTCHA states
    const [showRecaptcha, setShowRecaptcha] = useState(false);
    const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

    const [formData, setFormData] = useState({
        // Register form
        name: '',
        email: '',
        mobile: '',
        password: '',
        // Login form
        loginEmail: '',
        loginPassword: '',
        rememberMe: false
    });

    // Load reCAPTCHA script
    useEffect(() => {
        const loadRecaptcha = () => {
            if (window.grecaptcha) {
                setRecaptchaLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js';
            script.async = true;
            script.defer = true;
            script.onload = () => setRecaptchaLoaded(true);
            document.head.appendChild(script);
        };

        loadRecaptcha();

        return () => {
            const existingScript = document.querySelector('script[src="https://www.google.com/recaptcha/api.js"]');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    // Check screen size and update mobile state
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 480);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleRegisterClick = () => {
        setErrors({ login: '', register: '' }); // Clear errors when switching
        if (isMobile) {
            setShowLogin(false); // Mobile: show register form
        } else {
            setIsRightPanelActive(true); // Desktop: slide animation
        }
    };

    const handleLoginClick = () => {
        setErrors({ login: '', register: '' }); // Clear errors when switching
        if (isMobile) {
            setShowLogin(true); // Mobile: show login form
        } else {
            setIsRightPanelActive(false); // Desktop: slide animation
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Real-time validation
        if (type !== "checkbox") {
            let error = "";
            switch (name) {
                case "name":
                    error = validateName(value);
                    break;
                case "email":
                    error = validateEmail(value);
                    break;
                // case "mobile":
                //     error = validateMobile(value);
                //     break;
                case "password":
                    error = validatePassword(value);

                    // Nếu đã nhập confirmPassword thì check luôn
                    if (formData.confirmPassword && formData.confirmPassword !== value) {
                        setValidationErrors((prev) => ({
                            ...prev,
                            confirmPassword: "Mật khẩu xác nhận không khớp",
                        }));
                    } else {
                        setValidationErrors((prev) => ({
                            ...prev,
                            confirmPassword: "",
                        }));
                    }
                    break;
                case "confirmPassword":
                    if (!value.trim()) {
                        error = "Vui lòng nhập xác nhận mật khẩu";
                    } else if (value !== formData.password) {
                        error = "Mật khẩu xác nhận không khớp";
                    } else {
                        error = "";
                    }
                    break;
                case "loginEmail":
                    error = validateEmail(value);
                    break;
                case "loginPassword":
                    error = value ? "" : "Password is required";
                    break;
                default:
                    break;
            }

            setValidationErrors((prev) => ({
                ...prev,
                [name]: error,
            }));
        }

        // Clear general errors when user starts typing
        setErrors({ login: "", register: "" });
    };

    const handleRecaptchaSuccess = async (token) => {
        try {
            const loginData = {
                email: formData.loginEmail,
                password: formData.loginPassword,
                recaptchaToken: token
            };

            const result = await dispatch(actionLogin(loginData));
            if (result) {
                setShowRecaptcha(false);
                navigate('/');
            } else {
                setErrors(prev => ({ ...prev, login: 'Login failed. Please check your credentials.' }));
                setShowRecaptcha(false);
                // Reset reCAPTCHA
                if (window.grecaptcha) {
                    window.grecaptcha.reset();
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors(prev => ({ ...prev, login: 'An error occurred during login. Please try again.' }));
            setShowRecaptcha(false);
            if (window.grecaptcha) {
                window.grecaptcha.reset();
            }
        }
    };

    const handleRecaptchaError = () => {
        setErrors(prev => ({ ...prev, login: 'reCAPTCHA verification failed. Please try again.' }));
        setShowRecaptcha(false);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        // const mobileError = validateMobile(formData.mobile);
        const passwordError = validatePassword(formData.password);

        setValidationErrors({
            name: nameError,
            email: emailError,
            // mobile: mobileError,
            password: passwordError,
            loginEmail: '',
            loginPassword: ''
        });

        if (nameError || emailError || passwordError) {
            setErrors(prev => ({ ...prev, register: 'Please fix the errors above before submitting.' }));
            return;
        }

        try {
            const signUpData = {
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password
            };

            const result = await dispatch(actionSignUp(signUpData));
            if (result) {
                navigate('/');
            } else {
                setErrors(prev => ({ ...prev, register: 'Registration failed. Please try again.' }));
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrors(prev => ({ ...prev, register: 'An error occurred during registration. Please try again.' }));
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        // Validate login fields
        const emailError = validateEmail(formData.loginEmail);
        const passwordError = formData.loginPassword ? '' : 'Password is required';

        setValidationErrors(prev => ({
            ...prev,
            loginEmail: emailError,
            loginPassword: passwordError
        }));

        if (emailError || passwordError) {
            setErrors(prev => ({ ...prev, login: 'Please fix the errors above before submitting.' }));
            return;
        }

        // Show reCAPTCHA modal
        setShowRecaptcha(true);
    };

    const closeRecaptchaModal = () => {
        setShowRecaptcha(false);
        if (window.grecaptcha) {
            window.grecaptcha.reset();
        }
    };

    // reCAPTCHA Modal Component
    const RecaptchaModal = () => {
        useEffect(() => {
            if (showRecaptcha && recaptchaLoaded && window.grecaptcha) {
                // Delay to ensure modal is rendered
                const timer = setTimeout(() => {
                    window.grecaptcha.render('recaptcha-container', {
                        sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
                        callback: handleRecaptchaSuccess,
                        'error-callback': handleRecaptchaError
                    });
                }, 100);

                return () => clearTimeout(timer);
            }
        }, [showRecaptcha, recaptchaLoaded]);

        if (!showRecaptcha) return null;

        return (
            <div className="recaptcha-modal-overlay" onClick={closeRecaptchaModal}>
                <div className="recaptcha-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="recaptcha-header">
                        <h3>Security Verification</h3>
                        <button
                            className="recaptcha-close"
                            onClick={closeRecaptchaModal}
                            type="button"
                        >
                            ×
                        </button>
                    </div>
                    <div className="recaptcha-content">
                        <p>Please verify that you are not a robot:</p>
                        <div id="recaptcha-container"></div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="ap_auth_page">
            <div className={`ap_container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
                {/* Register Form */}
                <div className={`form-ap_container register-ap_container ${isMobile && showLogin ? 'mobile-hidden' : ''
                    }`}>
                    <form onSubmit={handleRegisterSubmit} className='ap_form'>
                        <h1 className='ap_h1'>Đăng ký tại đây</h1>

                        {errors.register && (
                            <div className="error-message">
                                {errors.register}
                            </div>
                        )}

                        <input
                            className={`ap_input ${validationErrors.name ? 'input-error' : ''}`}
                            type="text"
                            placeholder="Họ và tên"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                        {validationErrors.name && (
                            <div className="field-error">{validationErrors.name}</div>
                        )}

                        <input
                            className={`ap_input ${validationErrors.email ? 'input-error' : ''}`}
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                        {validationErrors.email && (
                            <div className="field-error">{validationErrors.email}</div>
                        )}

                        <input
                            className={`ap_input ${validationErrors.password ? 'input-error' : ''}`}
                            type="password"
                            placeholder="Mật khẩu"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                        {validationErrors.password && (
                            <div className="field-error">{validationErrors.password}</div>
                        )}

                        <input
                            className={`ap_input ${validationErrors.confirmPassword ? 'input-error' : ''}`}
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                        {validationErrors.confirmPassword && (
                            <div className="field-error">{validationErrors.confirmPassword}</div>
                        )}

                        <button className='ap_btn' type="submit">Register</button>

                        {/* Mobile toggle button */}
                        {isMobile && (
                            <button
                                type="button"
                                className="mobile-toggle"
                                onClick={handleLoginClick}
                            >
                                Đã có tài khoản? <span className="highlight-link">Đăng nhập tại đây</span>
                            </button>
                        )}

                    </form>
                </div>

                {/* Login Form */}
                <div className={`form-ap_container login-ap_container ${isMobile && !showLogin ? 'mobile-hidden' : ''
                    }`}>
                    <form onSubmit={handleLoginSubmit} className='ap_form'>
                        <h1 className='ap_h1'>Đăng nhập tại đây.</h1>

                        {errors.login && (
                            <div className="error-message">
                                {errors.login}
                            </div>
                        )}

                        <input
                            className={`ap_input ${validationErrors.loginEmail ? 'input-error' : ''}`}
                            type="email"
                            placeholder="Email"
                            name="loginEmail"
                            value={formData.loginEmail}
                            onChange={handleInputChange}
                            required
                        />
                        {validationErrors.loginEmail && (
                            <div className="field-error">{validationErrors.loginEmail}</div>
                        )}

                        <input
                            className={`ap_input ${validationErrors.loginPassword ? 'input-error' : ''}`}
                            type="password"
                            placeholder="Password"
                            name="loginPassword"
                            value={formData.loginPassword}
                            onChange={handleInputChange}
                            required
                        />
                        {validationErrors.loginPassword && (
                            <div className="field-error">{validationErrors.loginPassword}</div>
                        )}

                        <div className="content">
                            <div className="checkbox">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    id="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="checkbox">Ghi nhớ đăng nhập</label>
                            </div>
                            <div className="pass-link">
                                <a href="#">Quên mật khẩu?</a>
                            </div>
                        </div>
                        <button className='ap_btn' type="submit">Login</button>

                        {/* Mobile toggle button */}
                        {isMobile && (
                            <button
                                type="button"
                                className="mobile-toggle"
                                onClick={handleRegisterClick}
                            >
                                Chưa có tài khoản? <span className="highlight-link">Đăng ký tại đây</span>
                            </button>
                        )}

                            <>
                                <span className='ap_span'>hoặc đăng nhập với</span>
                                <div className="social-ap_container">
                                    <a href="#" className="social">
                                        <i className="lni lni-facebook-fill"></i>
                                    </a>
                                    <a href="#" className="social">
                                        <i className="lni lni-google"></i>
                                    </a>
                                    <a href="#" className="social">
                                        <i className="lni lni-linkedin-original"></i>
                                    </a>
                                </div>
                            </>
                    </form>
                </div>

                {/* Overlay - chỉ hiện trên desktop */}
                {!isMobile && (
                    <div className="overlay-ap_container">
                        <div className="overlay">
                            <div className="overlay-panel overlay-left">
                                <h1 className="ap_title">
                                    Math-Tech <br /> Xin chào
                                </h1>
                                <p className='ap_p'>Đã có tài khoản, đăng nhập tại đây.</p>
                                <button className="ap_btn ap_btn_ghost" onClick={handleLoginClick}>
                                    Login
                                    <i className="lni lni-arrow-left ap_icon_login"></i>
                                </button>
                                <>
                                    <span className='ap_span'>hoặc đăng nhập với</span>
                                    <div className="social-ap_container">
                                        <a href="#" className="social">
                                            <i className="lni lni-facebook-fill"></i>
                                        </a>
                                        <a href="#" className="social">
                                            <i className="lni lni-google"></i>
                                        </a>
                                        <a href="#" className="social">
                                            <i className="lni lni-linkedin-original"></i>
                                        </a>
                                    </div>
                                </>
                            </div>
                            <div className="overlay-panel overlay-right">
                                <h1 className="ap_title">
                                    Tham gia <br /> Math-Tech
                                </h1>
                                <p className='ap_p'>Chưa có tài khoản, đăng ký tại đây.</p>
                                <button className="ap_btn ap_btn_ghost" onClick={handleRegisterClick}>
                                    Register
                                    <i className="lni lni-arrow-right ap_icon_register"></i>
                                </button>
                                
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* reCAPTCHA Modal */}
            <RecaptchaModal />
        </div>
    );
};

export default AuthPage;