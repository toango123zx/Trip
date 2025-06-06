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
} from 'react-icons/fa';
import { userService } from '../services/userService';
import { MainLayout } from '@/layouts';
import { notificationUtils } from '@/utils/notificationUtils';
import { cloudinaryService } from '@/services/cloudinaryService';

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
		confirmPassword: '',
	});
	const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
	const [isUploading, setIsUploading] = useState(false);

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
			} catch (err) {
				notificationUtils.error();
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
			notificationUtils.error({
				description: 'Mật khẩu mới không khớp',
			});
			return;
		}

		if (passwordData.newPassword.length < 8) {
			notificationUtils.error({
				description: 'Mật khẩu mới phải có ít nhất 8 ký tự',
			});
			return;
		}

		try {
			await userService.changePassword(
				passwordData.currentPassword,
				passwordData.newPassword,
			);
			setPasswordMode(false);
			notificationUtils.success();
			setPasswordData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (err: any) {
			notificationUtils.error();
		}
	};

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!editMode) return; // Only allow upload in edit mode

		const file = event.target.files?.[0];
		if (!file) return;

		try {
			setIsUploading(true);
			const imageUrl = await cloudinaryService.uploadImage(file);

			// Update both formData and userProfile with new image URL
			setFormData((prev) => ({ ...prev, image: imageUrl }));
			setUserProfile((prev) => (prev ? { ...prev, image: imageUrl } : null));

			notificationUtils.success({
				message: 'Cập nhật ảnh thành công',
				description: 'Ảnh đại diện đã được cập nhật',
			});
		} catch (error) {
			notificationUtils.error();
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
							src={
								userProfile.image ||
								'https://www.strasys.uk/wp-content/uploads/2022/02/Depositphotos_484354208_S.jpg'
							}
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
								<button
									className="edit-button bg-[#ff7a22] hover:bg-[#ff7a22]/80 text-white border-none px-[15px] py-[10px] m-[5px] rounded cursor-pointer transition-colors duration-300 ease-in-out w-full flex items-center justify-center gap-[12px]"
									onClick={() => setEditMode(true)}
								>
									<FaEdit /> Chỉnh sửa
								</button>
							</div>
						) : (
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
									<input
										type="text"
										id="gender"
										name="gender"
										value={formData.gender || ''}
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
					</div>
				)}

				{activeTab === 'password' && (
					<div className="password-section">
						<div className="password-change">
							<div className="input-group">
								<label htmlFor="currentPassword">Current Password</label>
								<input
									type="password"
									id="currentPassword"
									name="currentPassword"
									value={passwordData.currentPassword}
									onChange={handlePasswordChange}
								/>
							</div>
							<div className="input-group">
								<label htmlFor="newPassword">New Password</label>
								<input
									type="password"
									id="newPassword"
									name="newPassword"
									value={passwordData.newPassword}
									onChange={handlePasswordChange}
								/>
							</div>
							<div className="input-group">
								<label htmlFor="confirmPassword">Confirm New Password</label>
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
