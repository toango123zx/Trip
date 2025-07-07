import React, { useState, useEffect } from 'react';
import {
    FaUser,
    FaEnvelope,
    FaUserTag,
    FaTransgender,
    FaPhone,
    FaMapMarkerAlt,
    FaEdit,
    FaLock,
    FaCamera,
    FaRegAddressCard,
    FaMoneyBillWave,
    // FaEye,
    // FaEyeSlash,
    FaCheck,
    FaTimes,
} from 'react-icons/fa';
import { userService } from '../services/userService';
import { MainLayout } from '@/layouts';
import { notificationUtils } from '@/utils/notificationUtils';
import { cloudinaryService } from '@/services/cloudinaryService';
import { ERoleName } from '@/features/users/user.type';
import { useNavigate } from 'react-router-dom';
import { FormSelect } from '@/components/Form/FormSelect';
import { Select } from 'antd';

interface UserProfile {
    id: string;
    name: string;
    roleName: string;
    image: string;
    gender: string | null;
    email: string;
    dateOfBirth: string | Date | null;
    phoneNumber: string | null;
    address: string | null;
    balance: number;
    point: number;
    status: string;
    taxId?: string | null;
    bankName?: string | null;
    bankCode?: string | null;
    amount?: number | null;
}

interface PasswordRequirement {
    label: string;
    isValid: boolean;
    pattern: RegExp;
}

const AccountPage: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [joinSupplierMode, setJoinSupplierMode] = useState(false);
    const [withdrawalMode, setWithdrawalMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({});
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
    const [isUploading, setIsUploading] = useState(false);
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const [showConfirmRequirements, setShowConfirmRequirements] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const nav = useNavigate();

    const passwordRequirements: PasswordRequirement[] = [
        {
            label: 'Ít nhất 8 ký tự',
            isValid: passwordData.newPassword.length >= 8,
            pattern: /.{8,}/
        },
        {
            label: 'Chứa ít nhất 1 chữ hoa',
            isValid: /[A-Z]/.test(passwordData.newPassword),
            pattern: /[A-Z]/
        },
        {
            label: 'Chứa ít nhất 1 chữ thường',
            isValid: /[a-z]/.test(passwordData.newPassword),
            pattern: /[a-z]/
        },
        {
            label: 'Chứa ít nhất 1 số',
            isValid: /\d/.test(passwordData.newPassword),
            pattern: /\d/
        },
        {
            label: 'Chứa ít nhất 1 ký tự đặc biệt',
            isValid: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword),
            pattern: /[!@#$%^&*(),.?":{}|<>]/
        }
    ];

    const confirmPasswordRequirements = [
        {
            label: 'Mật khẩu khớp nhau',
            isValid: passwordData.newPassword === passwordData.confirmPassword && passwordData.confirmPassword.length > 0
        }
    ];

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await userService.getUserProfile();
                setUserProfile(profile);
                setFormData({
                    name: profile.name,
                    gender: profile.gender,
                    dateOfBirth: profile.dateOfBirth,
                    phoneNumber: profile.phoneNumber,
                    address: profile.address,
                });
            } catch (err: any) {
                notificationUtils.error({ message: err.response.data.message });
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors: string[] = [];
        if (editMode && joinSupplierMode) {

            if (formData.phoneNumber && !/^\d{10,11}$/.test(formData.phoneNumber)) {
                errors.push('Số điện thoại không hợp lệ');
            }

            if (formData.name && formData.name.trim().length < 2) {
                errors.push('Tên phải có ít nhất 2 ký tự');
            }

            if (joinSupplierMode) {
                formData.gender = 'other'
                formData.dateOfBirth = new Date()
                if (!formData.taxId || formData.taxId.trim().length < 13) {
                    errors.push('Mã số thuế phải có ít nhất 13 ký tự');
                }
            }
        }
        if (withdrawalMode) {
            if (!formData.bankName?.trim()) {
                errors.push('Tên ngân hàng không hợp lệ');
            }
            if (!formData.bankCode?.trim()) {
                errors.push('Mã ngân hàng không hợp lệ');
            }
            if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
                errors.push('Số tiền rút không hợp lệ');
            }
        }

        if (errors.length > 0) {
            notificationUtils.error();
            return false;
        }
        setJoinSupplierMode(false);
        return true;
    };

    const handleUpdateProfile = async () => {
        if (!validateForm()) return;

        try {
            const updatedProfile = await userService.updateProfile(formData);
            setUserProfile(updatedProfile);
            setEditMode(false);
            notificationUtils.success();

        } catch (err: any) {
            notificationUtils.error({ message: err.response.data.message });
        }
    };
    const handleJoinSupplier = async () => {
        if (!validateForm()) return;

        try {
            const updatedProfile = await userService.getJoinSupplier(formData);
            setUserProfile(updatedProfile);
            setEditMode(false);
            notificationUtils.success();
            nav('/account')
        } catch (err: any) {
            notificationUtils.error({ message: err.response.data.message });
        }
    };

    const handleWithdrawal = async () => {
        if (!validateForm()) return;

        try {
            formData.amount = Number(formData.amount);
            const updatedProfile = await userService.postWithdrawal(formData);
            setUserProfile(updatedProfile);
            setWithdrawalMode(false);
            notificationUtils.success();
            nav('/account')
        } catch (err: any) {
            notificationUtils.error({ message: err.response.data.message });
        }
    };

    const validatePassword = () => {
        const allRequirementsMet = passwordRequirements.every(req => req.isValid);
        const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword;

        return allRequirementsMet && passwordsMatch;
    };

    const handleChangePassword = async () => {
        if (!validatePassword()) {
            notificationUtils.error({
                message: 'Lỗi xác thực',
                description: 'Vui lòng kiểm tra lại các điều kiện mật khẩu',
            });
            return;
        }

        try {
            await userService.changePassword(
                passwordData.currentPassword,
                passwordData.newPassword,
            );
            setPasswordMode(false);
            notificationUtils.success({
                message: 'Thành công',
                description: 'Mật khẩu đã được thay đổi thành công',
            });
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err: any) {
            notificationUtils.error({ message: err.response.data.message });
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!editMode) return;

        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const imageUrl = await cloudinaryService.uploadImage(file);

            setFormData((prev) => ({ ...prev, image: imageUrl }));
            setUserProfile((prev) => (prev ? { ...prev, image: imageUrl } : null));

            notificationUtils.success({
                message: 'Cập nhật ảnh thành công',
                description: 'Ảnh đại diện đã được cập nhật',
            });
        } catch (error: any) {
            notificationUtils.error({ message: error.response.data.message });
        } finally {
            setIsUploading(false);
        }
    };

    if (!userProfile) return <div className="loading">Đang tải...</div>;

    return (
        <MainLayout>
            <div className="account-page-container">
                <div className="account-page-header">
                    <div className="profile-avatar relative group">
                        <img
                            src='https://i.pinimg.com/736x/b6/45/a2/b645a23ca1d806f91aee90e02d31f258.jpg'
                            alt="Ảnh đại diện"
                            className="avatar-image w-32 h-32 rounded-full object-cover"
                        />
                        {editMode && (
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center group hover:bg-black/60 transition-colors duration-300">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                    className="hidden"
                                    id="avatarUpload"
                                />
                                <label
                                    htmlFor="avatarUpload"
                                    className="cursor-pointer flex items-center justify-center rounded-full p-3 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                                >
                                    {isUploading ? (
                                        <svg
                                            className="animate-spin h-6 w-6 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            ></path>
                                        </svg>
                                    ) : (
                                        <FaCamera className="text-white text-2xl" />
                                    )}
                                </label>
                            </div>
                        )}
                    </div>
                    <div className="profile-header-info">
                        <h1>{userProfile.name}</h1>
                        <p className="role-badge">{userProfile.roleName}</p>
                    </div>
                </div>

                <div className="account-page-tabs">
                    <button
                        className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <FaUser /> Information
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveTab('password')}
                    >
                        <FaLock /> Change password
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <div className="profile-section">
                        {(!editMode && !joinSupplierMode && !withdrawalMode) ? (
                            <div className="profile-info">
                                <div className="info-item">
                                    <FaUser className="info-icon" />
                                    <span>Name: {userProfile.name}</span>
                                </div>
                                <div className="info-item">
                                    <FaEnvelope className="info-icon" />
                                    <span>Email: {userProfile.email}</span>
                                </div>
                                <div className="info-item">
                                    <FaUserTag className="info-icon" />
                                    <span>Role: {userProfile.roleName}</span>
                                </div>
                                <div className="info-item">
                                    <FaTransgender className="info-icon" />
                                    <span>
                                        Gender: {userProfile.gender || 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <FaPhone className="info-icon" />
                                    <span>
                                        Phone Number: {userProfile.phoneNumber || 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <FaMapMarkerAlt className="info-icon" />
                                    <span>
                                        Address: {userProfile.address || 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <FaMapMarkerAlt className="info-icon" />
                                    <span>
                                        Balance: {`${userProfile.balance} VND` || 'Chưa cập nhật'}
                                    </span>
                                </div>
                                <button
                                    className="edit-button bg-[#ff7a22] hover:bg-[#ff7a22]/80 text-white border-none px-[15px] py-[10px] m-[5px] rounded cursor-pointer transition-colors duration-300 ease-in-out w-full flex items-center justify-center gap-[12px]"
                                    onClick={() => setEditMode(true)}
                                >
                                    <FaEdit /> Edit
                                </button>
                                {
                                    userProfile.roleName === ERoleName.tourist && (
                                        <button
                                            className="edit-button bg-[#ff7a22] hover:bg-[#ff7a22]/80 text-white border-none px-[15px] py-[10px] m-[5px] rounded cursor-pointer transition-colors duration-300 ease-in-out w-full flex items-center justify-center gap-[12px]"
                                            onClick={() => setJoinSupplierMode(true)}
                                        >
                                            <FaRegAddressCard /> Join Supplier
                                        </button>
                                    )
                                }
                                {
                                    userProfile.balance >= 0 && (
                                        <button
                                            className="edit-button bg-[#ff7a22] hover:bg-[#ff7a22]/80 text-white border-none px-[15px] py-[10px] m-[5px] rounded cursor-pointer transition-colors duration-300 ease-in-out w-full flex items-center justify-center gap-[12px]"
                                            onClick={() => setWithdrawalMode(true)}
                                        >
                                            <FaMoneyBillWave /> Withdrawal
                                        </button>
                                    )
                                }
                            </div>
                        ) : (
                            <div>
                                {editMode && (
                                    <div className="profile-edit">
                                        <div className="input-group">
                                            <label htmlFor="name">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="gender">Gender</label>
                                            <Select
                                                showSearch
                                                placeholder="Select gender"
                                                value={formData.gender}
                                                onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                                                filterOption={(input, option) =>
                                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={[
                                                    { value: 'male', label: 'Male' },
                                                    { value: 'female', label: 'Female' },
                                                    { value: 'other', label: 'Other' },
                                                ]}
                                                className='w-full !h-12'
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                            <input
                                                type="text"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={formData.phoneNumber || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="address">Address</label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={formData.address || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="edit-actions">
                                            <button
                                                className="save-button"
                                                onClick={handleUpdateProfile}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="cancel-button"
                                                onClick={() => setEditMode(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {joinSupplierMode && (
                                    <div className="profile-edit">
                                        <div className="input-group">
                                            <label htmlFor="name">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                            <input
                                                type="text"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={formData.phoneNumber || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="address">Address</label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={formData.address || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="taxId">TaxId</label>
                                            <input
                                                type="text"
                                                id="taxId"
                                                name="taxId"
                                                value={formData.taxId || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="edit-actions">
                                            <button
                                                className="save-button"
                                                onClick={handleJoinSupplier}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="cancel-button"
                                                onClick={() => setJoinSupplierMode(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {(withdrawalMode) && (
                                    <div className="profile-edit">
                                        <div className="input-group">
                                            <label htmlFor="bankName">Bank Name</label>
                                            <input
                                                type="text"
                                                id="bankName"
                                                name="bankName"
                                                value={formData.bankName || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="bankCode">Bank Code</label>
                                            <input
                                                type="text"
                                                id="bankCode"
                                                name="bankCode"
                                                value={formData.bankCode || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label htmlFor="amount">Amount</label>
                                            <input
                                                type="number"
                                                id="amount"
                                                name="amount"
                                                value={formData.amount || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="edit-actions">
                                            <button
                                                className="save-button"
                                                onClick={handleWithdrawal}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                className="cancel-button"
                                                onClick={() => setWithdrawalMode(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'password' && (
                    <div className="password-section">
                        <div className="password-change">
                            <div className="input-group">
                                <label htmlFor="currentPassword">Current Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {/* {showCurrentPassword ? <FaEyeSlash /> : <FaEye />} */}
                                    </button>
                                </div>
                            </div>

                            <div className="input-group" style={{ position: 'relative' }}>
                                <label htmlFor="newPassword">New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        onFocus={() => setShowPasswordRequirements(true)}
                                        onBlur={() => setTimeout(() => setShowPasswordRequirements(false), 200)}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {/* {showNewPassword ? <FaEyeSlash /> : <FaEye />} */}
                                    </button>
                                </div>
                                {showPasswordRequirements && (
                                    <div className="password-requirements" style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '0',
                                        right: '0',
                                        zIndex: 10,
                                        background: 'white',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        marginTop: '4px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        animation: 'slideDown 0.2s ease'
                                    }}>
                                        {passwordRequirements.map((requirement, index) => (
                                            <div
                                                key={index}
                                                className={`requirement-item ${requirement.isValid ? 'valid' : 'invalid'}`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '6px 0',
                                                    fontSize: '0.9rem',
                                                    transition: 'color 0.2s ease',
                                                    color: requirement.isValid ? '#28a745' : '#dc3545'
                                                }}
                                            >
                                                <div className={`requirement-icon ${requirement.isValid ? 'valid' : 'invalid'}`} style={{
                                                    fontSize: '0.8rem',
                                                    width: '16px',
                                                    height: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    background: requirement.isValid ? '#28a745' : '#dc3545',
                                                    color: 'white'
                                                }}>
                                                    {requirement.isValid ? <FaCheck /> : <FaTimes />}
                                                </div>
                                                <span>{requirement.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="input-group" style={{ position: 'relative' }}>
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        onFocus={() => setShowConfirmRequirements(true)}
                                        onBlur={() => setTimeout(() => setShowConfirmRequirements(false), 200)}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {/* {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} */}
                                    </button>
                                </div>
                                {showConfirmRequirements && passwordData.confirmPassword && (
                                    <div className="password-requirements" style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '0',
                                        right: '0',
                                        zIndex: 10,
                                        background: 'white',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        padding: '16px',
                                        marginTop: '4px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        animation: 'slideDown 0.2s ease'
                                    }}>
                                        {confirmPasswordRequirements.map((requirement, index) => (
                                            <div
                                                key={index}
                                                className={`requirement-item ${requirement.isValid ? 'valid' : 'invalid'}`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '6px 0',
                                                    fontSize: '0.9rem',
                                                    transition: 'color 0.2s ease',
                                                    color: requirement.isValid ? '#28a745' : '#dc3545'
                                                }}
                                            >
                                                <div className={`requirement-icon ${requirement.isValid ? 'valid' : 'invalid'}`} style={{
                                                    fontSize: '0.8rem',
                                                    width: '16px',
                                                    height: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: '50%',
                                                    background: requirement.isValid ? '#28a745' : '#dc3545',
                                                    color: 'white'
                                                }}>
                                                    {requirement.isValid ? <FaCheck /> : <FaTimes />}
                                                </div>
                                                <span>{requirement.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="password-actions">
                                <button
                                    className="change-password-button"
                                    onClick={handleChangePassword}
                                    disabled={!validatePassword()}
                                    style={{
                                        opacity: validatePassword() ? 1 : 0.6,
                                        cursor: validatePassword() ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default AccountPage;