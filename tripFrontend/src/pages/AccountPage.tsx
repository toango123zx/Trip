import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaUserTag, 
  FaTransgender, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaLock 
} from 'react-icons/fa';
import { userService } from '../services/userService';
import { MainLayout } from '@/layouts';
import { notificationUtils } from '@/utils/notificationUtils';

interface UserProfile {
  id: string;
  name: string;
  roleName: string;
  image: string;
  gender: string | null;
  email: string;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  address: string | null;
  balance: number;
  point: number;
  status: string;
}

const AccountPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

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
          address: profile.address
        });
      } catch (err) {
        notificationUtils.error();
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (formData.phoneNumber && !/^\d{10,11}$/.test(formData.phoneNumber)) {
      errors.push('Số điện thoại không hợp lệ');
    }

    if (formData.name && formData.name.trim().length < 2) {
      errors.push('Tên phải có ít nhất 2 ký tự');
    }

    if (errors.length > 0) {
      notificationUtils.error();
      return false;
    }
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
      notificationUtils.error();
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        notificationUtils.error(
            {
                description: 'Mật khẩu mới không khớp'
            }
        )
        return;
    }

    if (passwordData.newPassword.length < 8) {
        notificationUtils.error(
            {
                description: 'Mật khẩu mới phải có ít nhất 8 ký tự'
            }
        )
      return;
    }

    try {
      await userService.changePassword(
        passwordData.currentPassword, 
        passwordData.newPassword
      );
      setPasswordMode(false);
      notificationUtils.success();
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      notificationUtils.error();
    }
  };

  if (!userProfile) return <div className="loading">Đang tải...</div>;

  return (
    <MainLayout>
      <div className="account-page-container">
        <div className="account-page-header">
          <div className="profile-avatar">
            <img 
              src={'https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg'} 
              alt="Ảnh đại diện" 
              className="avatar-image" 
            />
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
            <FaUser /> Thông Tin Cá Nhân
          </button>
          <button 
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <FaLock /> Đổi Mật Khẩu
          </button>
        </div>

        {activeTab === 'profile' && (
          <div className="profile-section">
            {!editMode ? (
              <div className="profile-info">
                <div className="info-item">
                  <FaUser className="info-icon" />
                  <span>Tên: {userProfile.name}</span>
                </div>
                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <span>Email: {userProfile.email}</span>
                </div>
                <div className="info-item">
                  <FaUserTag className="info-icon" />
                  <span>Vai trò: {userProfile.roleName}</span>
                </div>
                <div className="info-item">
                  <FaTransgender className="info-icon" />
                  <span>Giới tính: {userProfile.gender || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <FaPhone className="info-icon" />
                  <span>Số điện thoại: {userProfile.phoneNumber || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <span>Địa chỉ: {userProfile.address || 'Chưa cập nhật'}</span>
                </div>
                <button 
                  className="edit-button bg-[#4CAF50] text-white border-none px-[15px] py-[10px] m-[5px] rounded cursor-pointer transition-colors duration-300 ease-in-out w-full flex items-center justify-center gap-[12px]" 
                  onClick={() => setEditMode(true)}
                >
                  <FaEdit /> Chỉnh sửa
                </button>
              </div>
            ) : (
              <div className="profile-edit">
                <div className="input-group">
                  <label htmlFor="name">Tên</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name" 
                    value={formData.name || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="gender">Giới tính</label>
                  <input 
                    type="text" 
                    id="gender"
                    name="gender" 
                    value={formData.gender || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="phoneNumber">Số điện thoại</label>
                  <input 
                    type="text" 
                    id="phoneNumber"
                    name="phoneNumber" 
                    value={formData.phoneNumber || ''} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="address">Địa chỉ</label>
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
                    Lưu
                  </button>
                  <button 
                    className="cancel-button" 
                    onClick={() => setEditMode(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'password' && (
          <div className="password-section">
            <div className="password-change">
              <div className="input-group">
                <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  id="currentPassword"
                  name="currentPassword" 
                  value={passwordData.currentPassword} 
                  onChange={handlePasswordChange} 
                />
              </div>
              <div className="input-group">
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <input 
                  type="password" 
                  id="newPassword"
                  name="newPassword" 
                  value={passwordData.newPassword} 
                  onChange={handlePasswordChange} 
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                <input 
                  type="password" 
                  id="confirmPassword"
                  name="confirmPassword" 
                  value={passwordData.confirmPassword} 
                  onChange={handlePasswordChange} 
                />
              </div>
              <div className="password-actions">
                <button 
                  className="change-password-button" 
                  onClick={handleChangePassword}
                >
                  Đổi mật khẩu
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