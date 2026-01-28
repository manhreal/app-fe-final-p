import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { actionLoginAdmin } from '../../redux/auth/actions';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(actionLoginAdmin(formData));
        if (result) {
            navigate('/');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Đăng nhập</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-submit">
                        Đăng nhập
                    </button>
                </form>

                <p className="auth-link">
                    Chưa có tài khoản? <Link to="/sign-up">Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;